#!/usr/bin/env node
/**
 * Seed script — pilot data integration (2026-05-16)
 *
 * Reads dashboard/Docs/final_engagement_scores.csv and inserts 46 real pilot
 * students into Supabase, replacing the previous 30 synthetic students.
 *
 * Usage:
 *   SUPABASE_URL=https://xxx.supabase.co \
 *   SUPABASE_ANON_KEY=eyJ... \
 *   node scripts/seed-supabase.mjs
 *
 * Safe to re-run: clears existing students (cascade) then upserts fresh rows.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import {
  MILESTONE_TEMPLATES,
  ACTIVITY_TEMPLATES,
  NOTE_TEMPLATES,
} from './templates/engagement-templates.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing env vars: SUPABASE_URL and SUPABASE_ANON_KEY are required');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Utilities ────────────────────────────────────────────────────────────────

/** Simple seeded pseudo-random for deterministic career_direction assignment. */
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

const CAREER_DIRECTIONS = ['clear', 'exploring', 'uncertain', 'undeclared'];

function pickCareerDirection(studentId) {
  const hash = studentId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const rng = seededRandom(hash);
  return CAREER_DIRECTIONS[Math.floor(rng() * CAREER_DIRECTIONS.length)];
}

function statusFromCategory(category) {
  if (category === 'Red')    return 'Needs Attention';
  if (category === 'Yellow') return 'At Risk';
  return 'On Track';
}

function normalizeClassYear(raw) {
  const cleaned = raw.trim();
  if (/sophmore/i.test(cleaned)) return 'Sophomore';
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
}

/** Parse a minimal CSV without external deps. Handles quoted fields. */
function parseCSV(text) {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map(line => {
    const values = [];
    let current = '';
    let inQuotes = false;
    for (const char of line) {
      if (char === '"') { inQuotes = !inQuotes; continue; }
      if (char === ',' && !inQuotes) { values.push(current.trim()); current = ''; continue; }
      current += char;
    }
    values.push(current.trim());
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']));
  });
}

function pick(arr, index) {
  return arr[index % arr.length];
}

// ── Load CSV ─────────────────────────────────────────────────────────────────

const csvPath = join(__dirname, '../Docs/final_engagement_scores.csv');
const csvText = readFileSync(csvPath, 'utf8');
const rows = parseCSV(csvText);

console.log(`Parsed ${rows.length} students from CSV.`);

// ── Clear existing data (cascade deletes milestones, notes, activity) ────────

console.log('Clearing existing students…');
const { error: clearErr } = await supabase.from('students').delete().neq('id', '__none__');
if (clearErr) {
  console.error('Failed to clear students:', clearErr.message);
  process.exit(1);
}
console.log('Cleared.');

// ── Seed students + children ─────────────────────────────────────────────────

const TODAY = new Date().toISOString().slice(0, 10);

for (let i = 0; i < rows.length; i++) {
  const row = rows[i];
  const category = row['engagement_category']?.trim() || 'Red';
  const studentId = row['student_id']?.trim();

  if (!studentId) { console.warn(`Row ${i + 1}: missing student_id, skipping`); continue; }

  const studentRow = {
    id:                   studentId,
    name:                 null,
    email:                row['Email']?.trim() || '',
    major:                row['major_x']?.trim() || 'Undeclared',
    graduation_year:      parseInt(row['Grad.Year'], 10) || 2029,
    career_direction:     pickCareerDirection(studentId),
    confidence_score:     null,
    engagement_score:     Math.round(parseFloat(row['final_engagement']) * 100),
    engagement_trend:     null,
    last_active_date:     TODAY,
    last_contacted_date:  TODAY,
    status:               statusFromCategory(category),
    age:                  (n => Number.isFinite(n) ? n : null)(parseInt(row['age'], 10)),
    gpa:                  (n => Number.isFinite(n) ? n : null)(parseFloat(row['GPA'])),
    attendance_rate:      (n => Number.isFinite(n) ? n : null)(parseFloat(row['attendance_rate'])),
    college:              row['College_y']?.trim() || null,
    class_year:           row['Class.Year'] ? normalizeClassYear(row['Class.Year']) : null,
    enrollment_status:    row['enrollment_status']?.trim() || null,
    engagement_category:  category,
  };

  const { error: sErr } = await supabase.from('students').upsert(studentRow, { onConflict: 'id' });
  if (sErr) { console.error(`Student ${studentId} failed:`, sErr.message); process.exit(1); }

  // ── Milestones (weighted by category) ──────────────────────────────────────
  const milestoneTemplate = pick(MILESTONE_TEMPLATES[category] ?? MILESTONE_TEMPLATES.Red, i);
  const milestoneRows = milestoneTemplate.map((m, mi) => ({
    id:             `${studentId}-m${mi + 1}`,
    student_id:     studentId,
    label:          m.label,
    status:         m.status,
    category:       m.category,
    completed_date: m.completedDate ?? null,
  }));
  if (milestoneRows.length) {
    const { error: mErr } = await supabase.from('milestones').upsert(milestoneRows, { onConflict: 'id' });
    if (mErr) console.error(`Milestones for ${studentId} failed:`, mErr.message);
  }

  // ── Recent activity (weighted by category) ──────────────────────────────────
  const actTemplate = pick(ACTIVITY_TEMPLATES[category] ?? ACTIVITY_TEMPLATES.Red, i);
  const actRows = actTemplate.map((a, ai) => ({
    id:          `${studentId}-a${ai + 1}`,
    student_id:  studentId,
    description: a.description,
    event_type:  a.event_type,
    timestamp:   a.timestamp,
  }));
  if (actRows.length) {
    const { error: aErr } = await supabase.from('recent_activity').upsert(actRows, { onConflict: 'id' });
    if (aErr) console.error(`Activity for ${studentId} failed:`, aErr.message);
  }

  // ── Advisor note (one per student, weighted by category) ────────────────────
  const notePool = NOTE_TEMPLATES[category] ?? NOTE_TEMPLATES.Red;
  const noteText = notePool[i % notePool.length];
  const { error: nErr } = await supabase.from('advisor_notes').insert({
    student_id:  studentId,
    text:        noteText,
    author_name: 'Counselor',
  });
  if (nErr) console.error(`Note for ${studentId} failed:`, nErr.message);

  console.log(`✓ ${studentId} [${category}]`);
}

console.log('\nSeed complete.');
