import util from "util";
import Multer from "multer";
import path from "path";
import { Storage } from "@google-cloud/storage";

const processFile = Multer({
	storage: Multer.memoryStorage(),
	limits: {
		fileSize: 25 * 1024 * 1024, // no larger than 5mb, you can change as needed.
	},
});

const serviceKey = path.join(
	__dirname,
	"../config/google-cloud/justtalk-8402a-5fba89171a09.json"
);
// const uploadFile = util.promisify(processFile);

const storage = new Storage({
	keyFilename: serviceKey,
	projectId: "justtalk-8402a",
});
const bucket = storage.bucket("justtalkstorage");

export { processFile, bucket };
