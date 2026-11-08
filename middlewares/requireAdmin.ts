import { Request, Response, NextFunction } from "express";
import { User } from "jt-models";
import { httpStatus } from "../helpers/httpStatus";
import { errorResponse } from "../helpers/httpResponses";

// Use after verifyToken. Admin status is read from the database on every request
// (never trusted from the token). No API endpoint sets the admin flag.
export async function requireAdmin(
	req: Request | any,
	res: Response,
	next: NextFunction
) {
	try {
		const user = await User.findById(req.user?.id).select("admin");

		if (!user || !user.admin) {
			return res
				.status(httpStatus.FORBIDDEN)
				.json(errorResponse("Admin access required"));
		}

		next();
	} catch (error) {
		next(error);
	}
}
