import jwt from "jsonwebtoken";
declare function sign(payload: any): string;
declare function parseTokenFromAuthorizationHeader(req: any): any;
declare function verify(token: any): any;
declare function decode(token: any): jwt.Jwt | null;
declare const _default: {
    decode: typeof decode;
    sign: typeof sign;
    verify: typeof verify;
    parseTokenFromAuthorizationHeader: typeof parseTokenFromAuthorizationHeader;
};
export default _default;
