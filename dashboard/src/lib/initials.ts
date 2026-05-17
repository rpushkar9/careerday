export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0]!.toUpperCase())
    .join("");
}

/** Returns a short avatar label from a student ID (e.g. "S005" → "S05", "S132" → "132"). */
export function idToAvatar(id: string): string {
  // Strip leading letter if present, keep up to 3 chars
  const digits = id.replace(/^[A-Za-z]+/, "");
  if (digits.length > 0) return digits.slice(-3);
  return id.slice(0, 3).toUpperCase();
}
