import config from "../config";
import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";

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
  const verifyOptions: any = {
    algorithm: "RS256",
  };

  try {
    return jwt.verify(token, config.JWT_TOKEN as string, verifyOptions);
  } catch (err: any) {
    console.error(
      "JWT verify failed:",
      err.name,
      "-",
      err.message,
      "| token prefix:",
      String(token).slice(0, 20),
      "| secret present:",
      !!config.JWT_TOKEN,
      "| secret length:",
      config.JWT_TOKEN?.length,
    );
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
