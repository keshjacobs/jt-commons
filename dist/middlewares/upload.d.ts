import Multer from "multer";
declare const processFile: Multer.Multer;
declare const bucket: import("@google-cloud/storage").Bucket;
export { processFile, bucket };
