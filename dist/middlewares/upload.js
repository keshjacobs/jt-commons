"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bucket = exports.processFile = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage_1 = require("@google-cloud/storage");
const processFile = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 25 * 1024 * 1024, // no larger than 5mb, you can change as needed.
    },
});
exports.processFile = processFile;
const serviceKey = path_1.default.join(__dirname, "../config/google-cloud/justtalk-8402a-5fba89171a09.json");
// const uploadFile = util.promisify(processFile);
const storage = new storage_1.Storage({
    keyFilename: serviceKey,
    projectId: "justtalk-8402a",
});
const bucket = storage.bucket("justtalkstorage");
exports.bucket = bucket;
