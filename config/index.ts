import dotenv from "dotenv";

dotenv.config();
const {
	JWT_TOKEN
} = process.env;

export default {
	JWT_TOKEN,
};