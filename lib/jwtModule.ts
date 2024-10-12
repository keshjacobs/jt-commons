import config from "../config";
import jwt, { SignOptions } from "jsonwebtoken";

function sign(payload: any) {
	const signingOptions: SignOptions = {
		expiresIn: "365d",
	};
	return jwt.sign(payload, config.JWT_TOKEN as string, signingOptions);
}

function parseTokenFromAuthorizationHeader(req: any) {
	const authorizationHeader = req.headers["authorization"];
	if (!authorizationHeader || !authorizationHeader.includes("Bearer ")) {
		return null;
	}
	return req.headers["authorization"].split(" ")[1];
}

function verify(token: any): any {
	const verifyOptions: SignOptions = {
		algorithm: "RS256",
	};

	try {
		return jwt.verify(token, config.JWT_TOKEN as string, verifyOptions);
	} catch (err) {
		return null;
	}
}

function decode(token: any) {
	return jwt.decode(token, { complete: true });
}

export default {
	decode,
	sign,
	verify,
	parseTokenFromAuthorizationHeader,
};
