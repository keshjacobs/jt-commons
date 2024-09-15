import { Request, Response, NextFunction } from "express";
export declare function verifyToken(req: Request | any, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
