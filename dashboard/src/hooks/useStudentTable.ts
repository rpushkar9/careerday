import { useState, useMemo } from "react";
import type { Student } from "@/types";
import type { FilterChip } from "@/lib/constants";
import { filterByChip } from "@/data";

export function useStudentTable(students: Student[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChip, setActiveChip] = useState<FilterChip>("All");

  const filteredStudents = useMemo(() => {
    const chipFiltered = filterByChip(students, activeChip);

    if (!searchQuery.trim()) return chipFiltered;

    const query = searchQuery.toLowerCase();
    return chipFiltered.filter((s) => s.name.toLowerCase().includes(query));
  }, [students, activeChip, searchQuery]);

  return {
    filteredStudents,
    searchQuery,
    setSearchQuery,
    activeChip,
    setActiveChip,
  };
}
