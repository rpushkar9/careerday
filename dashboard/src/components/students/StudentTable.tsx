import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";
import { useState, useEffect } from "react";
import {
  ArrowUp,
  ArrowDown,
  Minus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { Student } from "@/types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";

interface StudentTableProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
}

const CAREER_DIRECTION_STYLES: Record<
  Student["careerDirection"],
  { className: string; label: string }
> = {
  clear: {
    className:
      "bg-green-50 text-green-700 border border-green-200 rounded-lg px-2 py-0.5 text-xs",
    label: "Clear",
  },
  exploring: {
    className:
      "bg-blue-50 text-blue-700 border border-blue-200 rounded-lg px-2 py-0.5 text-xs",
    label: "Exploring",
  },
  uncertain: {
    className:
      "bg-amber-50 text-amber-700 border border-amber-200 rounded-lg px-2 py-0.5 text-xs",
    label: "Uncertain",
  },
  undeclared: {
    className:
      "bg-gray-50 text-gray-600 border border-gray-200 rounded-lg px-2 py-0.5 text-xs",
    label: "Undeclared",
  },
};

const STATUS_TOOLTIP: Partial<Record<Student["status"], string>> = {
  "At Risk": "Engagement declining or milestones behind schedule",
  "Needs Attention": "Marked for counselor follow-up",
};

const columnHelper = createColumnHelper<Student>();

const columns = [
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => {
      const student = info.row.original;
      return (
        <div>
          <div className="font-medium">{student.name}</div>
          <div className="text-xs text-muted-foreground">{student.email}</div>
        </div>
      );
    },
  }),
  columnHelper.accessor("major", {
    header: "Major",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("graduationYear", {
    header: "Grad Year",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("careerDirection", {
    header: "Career Direction",
    cell: (info) => {
      const value = info.getValue();
      const style = CAREER_DIRECTION_STYLES[value];
      return <span className={style.className}>{style.label}</span>;
    },
  }),
  columnHelper.accessor((row) => row.engagementScore, {
    id: "engagement",
    header: "Engagement",
    cell: ({ row }) => {
      const score = row.original.engagementScore;
      const trend = row.original.engagementTrend;

      const scoreColor =
        score >= 80
          ? "text-green-600"
          : score >= 50
            ? "text-amber-600"
            : "text-red-600";

      const TrendIcon =
        trend === "up" ? ArrowUp : trend === "down" ? ArrowDown : Minus;
      const trendColor =
        trend === "up"
          ? "text-green-600"
          : trend === "down"
            ? "text-red-500"
            : "text-gray-400";

      return (
        <span className="flex items-center gap-0.5">
          <span className={scoreColor}>{score}%</span>
          <TrendIcon className={`w-3.5 h-3.5 ${trendColor}`} />
        </span>
      );
    },
  }),
  columnHelper.accessor(
    (row) => {
      const total = row.milestones.length;
      const completed = row.milestones.filter(
        (m) => m.status === "Completed",
      ).length;
      return total > 0 ? completed / total : 0;
    },
    {
      id: "milestones",
      header: "Milestones",
      sortingFn: "basic",
      cell: ({ row }) => {
        const completed = row.original.milestones.filter(
          (m) => m.status === "Completed",
        ).length;
        return `${completed} / ${row.original.milestones.length}`;
      },
    },
  ),
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
  }),
];

export function StudentTable({ students, onSelectStudent }: StudentTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);

  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table is not yet compatible with React Compiler; safe to use here as no memoized consumers depend on these values
  const table = useReactTable({
    data: students,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  // Reset to page 0 whenever the filtered student list changes
  useEffect(() => {
    table.setPageIndex(0);
  }, [students, table]);

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
                  className={`px-4 py-3 text-left font-medium text-muted-foreground select-none ${header.column.getCanSort() ? "cursor-pointer" : "cursor-default"}`}
                  tabIndex={header.column.getCanSort() ? 0 : undefined}
                  aria-sort={
                    header.column.getIsSorted() === "asc"
                      ? "ascending"
                      : header.column.getIsSorted() === "desc"
                        ? "descending"
                        : header.column.getCanSort()
                          ? "none"
                          : undefined
                  }
                  onClick={header.column.getToggleSortingHandler()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      header.column.getToggleSortingHandler()?.(e);
                    }
                  }}
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
              tabIndex={0}
              className="border-b cursor-pointer hover:bg-muted/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
              onClick={() => onSelectStudent(row.original)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectStudent(row.original);
                }
              }}
            >
              {row.getVisibleCells().map((cell) => {
                if (cell.column.id === "status") {
                  const status = row.original.status;
                  const tooltipText = STATUS_TOOLTIP[status];
                  const isHovered = hoveredRowId === row.id;
                  return (
                    <td
                      key={cell.id}
                      className="px-4 py-3 relative"
                      onMouseEnter={() => {
                        if (tooltipText) setHoveredRowId(row.id);
                      }}
                      onMouseLeave={() => setHoveredRowId(null)}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectStudent(row.original);
                      }}
                    >
                      <div className="relative inline-block">
                        <StatusBadge status={status} />
                        {tooltipText && isHovered && (
                          <div className="absolute z-10 left-0 top-full mt-1 bg-popover border border-border rounded-lg shadow-lg p-2.5 text-xs text-foreground whitespace-nowrap">
                            {tooltipText}
                          </div>
                        )}
                      </div>
                    </td>
                  );
                }
                return (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-muted-foreground">
          <span>
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()} · {students.length} students
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="rounded p-1 hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="rounded p-1 hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
