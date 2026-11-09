// helpers/adminQuery.ts
// Small parsing helpers shared by the admin list endpoints.

export interface Pagination {
  page: number;
  pageSize: number;
  skip: number;
}

/** ?page=1&pageSize=12 -> clamped values + skip. */
export function parsePagination(
  query: any,
  defaults: { pageSize?: number; maxPageSize?: number } = {},
): Pagination {
  const maxPageSize = defaults.maxPageSize ?? 100;
  const page = Math.max(1, parseInt(String(query?.page ?? "1"), 10) || 1);
  const pageSize = Math.min(
    maxPageSize,
    Math.max(1, parseInt(String(query?.pageSize ?? defaults.pageSize ?? 12), 10) || 12),
  );
  return { page, pageSize, skip: (page - 1) * pageSize };
}

/** Response shape the admin frontend expects for paged lists. */
export const paginated = <T>(items: T[], total: number, p: Pagination) => ({
  items,
  total,
  page: p.page,
  pageSize: p.pageSize,
});

/** ?days=30 -> clamped integer (default 30, 1..365). */
export function parseDays(value: any, fallback = 30, max = 365): number {
  const n = parseInt(String(value ?? fallback), 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(1, n));
}

/**
 * ?sort=-date_created -> { date_created: -1 }, only for whitelisted fields
 * (`allowed` maps the public sort key to the DB path).
 */
export function parseSort(
  value: any,
  allowed: Record<string, string>,
  fallback: string,
): Record<string, 1 | -1> {
  const raw = typeof value === "string" && value.length ? value : fallback;
  const desc = raw.startsWith("-");
  const key = desc ? raw.slice(1) : raw;
  const path = allowed[key] ?? allowed[fallback.replace(/^-/, "")];
  return { [path]: desc ? -1 : 1, _id: desc ? -1 : 1 } as Record<string, 1 | -1>;
}

/** Escape user input before putting it in a RegExp. */
export const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Midnight UTC `days` days ago (inclusive window ending today). */
export function startOfWindow(days: number, now = new Date()): Date {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  d.setUTCDate(d.getUTCDate() - (days - 1));
  return d;
}

/** Fill a { date: "YYYY-MM-DD", ... } series so every day in the window is present. */
export function fillDailySeries<T extends Record<string, number>>(
  rows: Array<{ _id: string } & Partial<T>>,
  days: number,
  keys: (keyof T)[],
  now = new Date(),
): Array<{ date: string } & T> {
  const byDate = new Map(rows.map((r) => [r._id, r]));
  const start = startOfWindow(days, now);
  const out: Array<{ date: string } & T> = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setUTCDate(start.getUTCDate() + i);
    const date = d.toISOString().slice(0, 10);
    const row: any = { date };
    const found: any = byDate.get(date) ?? {};
    for (const k of keys) row[k] = found[k] ?? 0;
    out.push(row);
  }
  return out;
}
