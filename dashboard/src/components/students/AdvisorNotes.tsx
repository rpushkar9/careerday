import { useState } from "react";
import type { AdvisorNote } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/EmptyState";

interface AdvisorNotesProps {
  notes: AdvisorNote[];
  onAddNote: (text: string) => void;
}

export function AdvisorNotes({ notes, onAddNote }: AdvisorNotesProps) {
  const [text, setText] = useState("");

  function handleAdd() {
    const trimmed = text.trim();
    if (!trimmed) return;
    onAddNote(trimmed);
    setText("");
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          placeholder="Add a note..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-label="Note text"
        />
        <Button
          size="sm"
          disabled={text.trim().length === 0}
          onClick={handleAdd}
        >
          Add Note
        </Button>
      </div>

      {notes.length === 0 ? (
        <EmptyState message="No notes yet — add the first one" />
      ) : (
        <ul className="space-y-2">
          {notes.map((note) => (
            <li key={note.id} className="rounded-md border px-3 py-2 text-sm">
              <p>{note.text}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {note.authorName} &mdash;{" "}
                {new Date(note.timestamp).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
