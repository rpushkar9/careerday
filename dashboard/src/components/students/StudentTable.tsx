import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import type { Student } from "@/types";
import { EngagementBadge } from "@/components/shared/EngagementBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";

interface StudentTableProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
}

const columnHelper = createColumnHelper<Student>();

const columns = [
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("careerDirection", {
    header: "Career Direction",
    cell: (info) => {
      const value = info.getValue();
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
  }),
  columnHelper.accessor("engagementTier", {
    header: "Engagement",
    cell: (info) => <EngagementBadge tier={info.getValue()} />,
    sortingFn: (rowA, rowB) => {
      const order = { High: 3, Medium: 2, Low: 1 };
      return (
        order[rowA.original.engagementTier] -
        order[rowB.original.engagementTier]
      );
    },
  }),
  columnHelper.display({
    id: "milestones",
    header: "Milestones",
    cell: ({ row }) => {
      const completed = row.original.milestones.filter(
        (m) => m.status === "Completed",
      ).length;
      return `${completed} / ${row.original.milestones.length}`;
    },
  }),
  columnHelper.accessor("lastActiveDate", {
    header: "Last Active",
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
  }),
  columnHelper.accessor("lastContactedDate", {
    header: "Last Contacted",
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => <StatusBadge status={info.getValue()} />,
  }),
];

export function StudentTable({ students, onSelectStudent }: StudentTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table is not yet compatible with React Compiler; safe to use here as no memoized consumers depend on these values
  const table = useReactTable({
    data: students,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (students.length === 0) {
    return <EmptyState message="No students found" />;
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-left font-medium text-muted-foreground cursor-pointer select-none"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                  {header.column.getIsSorted() === "asc" && " ▲"}
                  {header.column.getIsSorted() === "desc" && " ▼"}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="border-b cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => onSelectStudent(row.original)}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
