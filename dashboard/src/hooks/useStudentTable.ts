import { useState, useMemo } from "react";
import type { Student } from "@/types";
import type { FilterChip } from "@/lib/constants";
import { filterByChip } from "@/data";

export function useStudentTable(students: Student[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChips, setActiveChips] = useState<string[]>([]);

  const filteredStudents = useMemo(() => {
    let chipFiltered: Student[];

    if (activeChips.length === 0 || activeChips.includes("All")) {
      chipFiltered = students;
    } else {
      // OR-filter: union of all active chip results, deduplicated by id
      const seen = new Set<string>();
      chipFiltered = [];
      for (const chip of activeChips) {
        const results = filterByChip(students, chip as FilterChip);
        for (const student of results) {
          if (!seen.has(student.id)) {
            seen.add(student.id);
            chipFiltered.push(student);
          }
        }
      }
    }

    if (!searchQuery.trim()) return chipFiltered;

    const query = searchQuery.toLowerCase();
    return chipFiltered.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.careerDirection.toLowerCase().includes(query),
    );
  }, [students, activeChips, searchQuery]);

  return {
    filteredStudents,
    searchQuery,
    setSearchQuery,
    activeChips,
    setActiveChips,
  };
}
