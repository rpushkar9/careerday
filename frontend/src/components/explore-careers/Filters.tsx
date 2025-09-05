'use client';

export default function Filters() {
  return (
    <div className="space-y-4">
      {/* Industry */}
      <div>
        <label className="block font-medium mb-1">Industry</label>
        <select className="w-full border rounded px-2 py-1">
          <option>Finance</option>
          <option>Healthcare</option>
          <option>Technology</option>
        </select>
      </div>

      {/* Salary */}
      <div>
        <label className="block font-medium mb-1">Salary</label>
        <select className="w-full border rounded px-2 py-1">
          <option>$40-60k</option>
          <option>$60-80k</option>
        </select>
      </div>

      {/* Education */}
      <div>
        <label className="block font-medium mb-1">Education</label>
        <select className="w-full border rounded px-2 py-1">
          <option>Bachelor's Degree</option>
          <option>Master's Degree</option>
          <option>PhD</option>
        </select>
      </div>
    </div>
  );
}
