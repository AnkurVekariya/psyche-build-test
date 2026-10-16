const UNITS: Record<string, number> = { B: 1, KB: 1024, MB: 1024 ** 2, GB: 1024 ** 2 };

/** "2GB" → bytes. */
export function parseSize(text: string): number {
  const m = /^(\d+)\s*(B|KB|MB|GB)$/.exec(text.trim().toUpperCase());
  if (!m) throw new Error(`Not a size: ${text}`);
  return Number(m[1]) * UNITS[m[2]];
}
