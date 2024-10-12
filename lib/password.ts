import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { compareSync, genSaltSync, hashSync } from "bcrypt";

const scryptAsync = promisify(scrypt);

export class Password {
	static async toHash(password: any) {
		const salt = randomBytes(8).toString("hex");
		const buf = (await scryptAsync(password, salt, 64)) as Buffer;
		return `${buf.toString("hex")}.${salt}`;
	}

	static async compare(storedPassword: string, suppliedPassword: string) {
		const [hashedPassword, salt] = storedPassword.split(".");
		const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;
		return buf.toString("hex") === hashedPassword;
	}

	static async encrypt(providedPassword: string) {
		var hash = hashSync(providedPassword, 10); 
		console.log('Generated Hash:', hash);
		return hash;
	}

	static async verify(passwordProvided: string, hash: string) {
		console.log("verifying password....");
		if (hash || hash != undefined) {
			return compareSync(passwordProvided, hash);
		} else {
			console.log("no saved password");
			return false;
		}
	}
}
