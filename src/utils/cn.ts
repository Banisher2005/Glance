type ClassValue = string | number | null | undefined | false | Record<string, boolean>;

/** Minimal classnames combinator so we don't need an extra dependency for this alone. */
export function cn(...values: ClassValue[]): string {
  const out: string[] = [];
  for (const v of values) {
    if (!v) continue;
    if (typeof v === 'string' || typeof v === 'number') {
      out.push(String(v));
    } else {
      for (const [key, on] of Object.entries(v)) if (on) out.push(key);
    }
  }
  return out.join(' ');
}
