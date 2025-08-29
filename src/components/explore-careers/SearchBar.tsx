"use client";

interface SearchBarProps {
  search: string;
  setSearch: (value: string) => void;
}

export default function SearchBar({ search, setSearch }: SearchBarProps) {
  return (
    <div className="flex justify-center mb-6">
      <input
        type="text"
        placeholder="Search Careers"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-2/3 border rounded-full px-4 py-2 shadow-sm"
      />
    </div>
  );
}
