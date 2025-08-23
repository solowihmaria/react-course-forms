export function filterCountries(
  query: string,
  list: string[],
  limit = 8
): string[] {
  const q = query.trim().toLowerCase();
  if (!q) return list.slice(0, limit);
  return list.filter((c) => c.toLowerCase().includes(q)).slice(0, limit);
}
