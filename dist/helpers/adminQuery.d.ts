export interface Pagination {
    page: number;
    pageSize: number;
    skip: number;
}
/** ?page=1&pageSize=12 -> clamped values + skip. */
export declare function parsePagination(query: any, defaults?: {
    pageSize?: number;
    maxPageSize?: number;
}): Pagination;
/** Response shape the admin frontend expects for paged lists. */
export declare const paginated: <T>(items: T[], total: number, p: Pagination) => {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
};
/** ?days=30 -> clamped integer (default 30, 1..365). */
export declare function parseDays(value: any, fallback?: number, max?: number): number;
/**
 * ?sort=-date_created -> { date_created: -1 }, only for whitelisted fields
 * (`allowed` maps the public sort key to the DB path).
 */
export declare function parseSort(value: any, allowed: Record<string, string>, fallback: string): Record<string, 1 | -1>;
/** Escape user input before putting it in a RegExp. */
export declare const escapeRegex: (s: string) => string;
/** Midnight UTC `days` days ago (inclusive window ending today). */
export declare function startOfWindow(days: number, now?: Date): Date;
/** Fill a { date: "YYYY-MM-DD", ... } series so every day in the window is present. */
export declare function fillDailySeries<T extends Record<string, number>>(rows: Array<{
    _id: string;
} & Partial<T>>, days: number, keys: (keyof T)[], now?: Date): Array<{
    date: string;
} & T>;
