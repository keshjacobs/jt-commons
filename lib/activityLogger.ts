// services/activityLogger.ts
import { Types } from "mongoose";
import {
  ActivityLog,
  ActivityType,
  ActivityTargetModel,
  User,
} from "jt-models";

// Per-process cache: last time we bumped `lastActive` for each user.
// Keeps writes off the User collection during action bursts.
const lastActiveCache = new Map<string, number>();
const LAST_ACTIVE_DEBOUNCE_MS = 30 * 1000; // 30s feels right for "last seen"

// Optional: keep the cache from growing forever in a long-running process
setInterval(
  () => {
    const cutoff = Date.now() - 10 * 60 * 1000;
    for (const [k, v] of lastActiveCache)
      if (v < cutoff) lastActiveCache.delete(k);
  },
  5 * 60 * 1000,
).unref();

export interface LogActivityParams {
  userId: string | Types.ObjectId;
  type: ActivityType;
  targetModel?: ActivityTargetModel;
  targetId?: string | Types.ObjectId;
  metadata?: Record<string, any>;
  ip?: string;
  userAgent?: string;
  // Set false for actions that shouldn't count as "presence"
  // (e.g. a webhook-triggered action). Defaults to true.
  updateLastActive?: boolean;
}

/**
 * Fire-and-forget. Never throws. Never blocks the caller.
 * When you add BullMQ later, replace the body with `queue.add(...)`.
 */
export function logActivity(params: LogActivityParams): void {
  setImmediate(async () => {
    try {
      await ActivityLog.create({
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
    } catch (err) {
      // Logging failures must never break the request
      console.error("[activityLogger] failed:", err);
    }
  });
}

/**
 * For middleware / sockets / heartbeats — bumps lastActive without
 * writing an ActivityLog row.
 */
export function bumpLastActive(userId: string | Types.ObjectId): void {
  setImmediate(() => {
    maybeBumpLastActive(userId).catch((err) =>
      console.error("[bumpLastActive] failed:", err),
    );
  });
}

async function maybeBumpLastActive(userId: string | Types.ObjectId) {
  const key = String(userId);
  const now = Date.now();
  const last = lastActiveCache.get(key) ?? 0;
  if (now - last < LAST_ACTIVE_DEBOUNCE_MS) return;
  lastActiveCache.set(key, now);
  await User.updateOne(
    { _id: userId },
    { $set: { lastActive: new Date(now) } },
  );
}
