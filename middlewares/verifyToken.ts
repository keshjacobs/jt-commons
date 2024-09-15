import { Request, Response, NextFunction } from "express";
import JwtModule from "../lib/jwtModule";
import { httpStatus } from "../helpers/httpStatus";
import { errorResponse } from "../helpers/httpResponses";

export async function verifyToken(
	req: Request | any,
	res: Response,
	next: NextFunction
) {
	const token = JwtModule.parseTokenFromAuthorizationHeader(req);

	if (!token) {
		return res
			.status(httpStatus.FORBIDDEN)
			.json(
				errorResponse(
					"Bearer token not provided as expected in authorization header"
				)
			);
	}

	const verifyResult = JwtModule.verify(token);

	if (!verifyResult || !verifyResult.id) {
		return res
			.status(httpStatus.FORBIDDEN)
			.json(errorResponse("Bearer token failed verification"));
	}

	req.user = {
		id: verifyResult.id,
	};
	next();
}
