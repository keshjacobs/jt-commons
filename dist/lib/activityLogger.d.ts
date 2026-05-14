import { Types } from "mongoose";
import { ActivityType, ActivityTargetModel } from "jt-models";
export interface LogActivityParams {
    userId: string | Types.ObjectId;
    type: ActivityType;
    targetModel?: ActivityTargetModel;
    targetId?: string | Types.ObjectId;
    metadata?: Record<string, any>;
    ip?: string;
    userAgent?: string;
    updateLastActive?: boolean;
}
/**
 * Fire-and-forget. Never throws. Never blocks the caller.
 * When you add BullMQ later, replace the body with `queue.add(...)`.
 */
export declare function logActivity(params: LogActivityParams): void;
/**
 * For middleware / sockets / heartbeats — bumps lastActive without
 * writing an ActivityLog row.
 */
export declare function bumpLastActive(userId: string | Types.ObjectId): void;
