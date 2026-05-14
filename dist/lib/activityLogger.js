"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logActivity = logActivity;
exports.bumpLastActive = bumpLastActive;
const jt_models_1 = require("jt-models");
// Per-process cache: last time we bumped `lastActive` for each user.
// Keeps writes off the User collection during action bursts.
const lastActiveCache = new Map();
const LAST_ACTIVE_DEBOUNCE_MS = 30 * 1000; // 30s feels right for "last seen"
// Optional: keep the cache from growing forever in a long-running process
setInterval(() => {
    const cutoff = Date.now() - 10 * 60 * 1000;
    for (const [k, v] of lastActiveCache)
        if (v < cutoff)
            lastActiveCache.delete(k);
}, 5 * 60 * 1000).unref();
/**
 * Fire-and-forget. Never throws. Never blocks the caller.
 * When you add BullMQ later, replace the body with `queue.add(...)`.
 */
function logActivity(params) {
    setImmediate(async () => {
        try {
            await jt_models_1.ActivityLog.create({
                user: params.userId,
                type: params.type,
                targetModel: params.targetModel,
                targetId: params.targetId,
                metadata: params.metadata,
                ip: params.ip,
                userAgent: params.userAgent,
            });
            if (params.updateLastActive !== false) {
                await maybeBumpLastActive(params.userId);
            }
        }
        catch (err) {
            // Logging failures must never break the request
            console.error("[activityLogger] failed:", err);
        }
    });
}
/**
 * For middleware / sockets / heartbeats — bumps lastActive without
 * writing an ActivityLog row.
 */
function bumpLastActive(userId) {
    setImmediate(() => {
        maybeBumpLastActive(userId).catch((err) => console.error("[bumpLastActive] failed:", err));
    });
}
async function maybeBumpLastActive(userId) {
    const key = String(userId);
    const now = Date.now();
    const last = lastActiveCache.get(key) ?? 0;
    if (now - last < LAST_ACTIVE_DEBOUNCE_MS)
        return;
    lastActiveCache.set(key, now);
    await jt_models_1.User.updateOne({ _id: userId }, { $set: { lastActive: new Date(now) } });
}
