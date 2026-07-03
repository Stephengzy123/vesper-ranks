export function baseSlug(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72) || "leaderboard";
}

export function numberedSlug(base: string, index: number) {
  return index === 0 ? base : `${base}-${index}`;
}
