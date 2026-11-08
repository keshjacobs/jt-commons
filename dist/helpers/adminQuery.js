"use strict";
// helpers/adminQuery.ts
// Small parsing helpers shared by the admin list endpoints.
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeRegex = exports.paginated = void 0;
exports.parsePagination = parsePagination;
exports.parseDays = parseDays;
exports.parseSort = parseSort;
exports.startOfWindow = startOfWindow;
exports.fillDailySeries = fillDailySeries;
/** ?page=1&pageSize=12 -> clamped values + skip. */
function parsePagination(query, defaults = {}) {
    const maxPageSize = defaults.maxPageSize ?? 100;
    const page = Math.max(1, parseInt(String(query?.page ?? "1"), 10) || 1);
    const pageSize = Math.min(maxPageSize, Math.max(1, parseInt(String(query?.pageSize ?? defaults.pageSize ?? 12), 10) || 12));
    return { page, pageSize, skip: (page - 1) * pageSize };
}
/** Response shape the admin frontend expects for paged lists. */
const paginated = (items, total, p) => ({
    items,
    total,
    page: p.page,
    pageSize: p.pageSize,
});
exports.paginated = paginated;
/** ?days=30 -> clamped integer (default 30, 1..365). */
function parseDays(value, fallback = 30, max = 365) {
    const n = parseInt(String(value ?? fallback), 10);
    if (!Number.isFinite(n))
        return fallback;
    return Math.min(max, Math.max(1, n));
}
/**
 * ?sort=-date_created -> { date_created: -1 }, only for whitelisted fields
 * (`allowed` maps the public sort key to the DB path).
 */
function parseSort(value, allowed, fallback) {
    const raw = typeof value === "string" && value.length ? value : fallback;
    const desc = raw.startsWith("-");
    const key = desc ? raw.slice(1) : raw;
    const path = allowed[key] ?? allowed[fallback.replace(/^-/, "")];
    return { [path]: desc ? -1 : 1, _id: desc ? -1 : 1 };
}
/** Escape user input before putting it in a RegExp. */
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
exports.escapeRegex = escapeRegex;
/** Midnight UTC `days` days ago (inclusive window ending today). */
function startOfWindow(days, now = new Date()) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    d.setUTCDate(d.getUTCDate() - (days - 1));
    return d;
}
/** Fill a { date: "YYYY-MM-DD", ... } series so every day in the window is present. */
function fillDailySeries(rows, days, keys, now = new Date()) {
    const byDate = new Map(rows.map((r) => [r._id, r]));
    const start = startOfWindow(days, now);
    const out = [];
    for (let i = 0; i < days; i++) {
        const d = new Date(start);
        d.setUTCDate(start.getUTCDate() + i);
        const date = d.toISOString().slice(0, 10);
        const row = { date };
        const found = byDate.get(date) ?? {};
        for (const k of keys)
            row[k] = found[k] ?? 0;
        out.push(row);
    }
    return out;
}
