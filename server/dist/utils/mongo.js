"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToMongo = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
async function connectToMongo() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error('MONGODB_URI environment variable is not set');
    }
    await mongoose_1.default.connect(uri);
    console.log('Connected to MongoDB');
    mongoose_1.default.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
    });
    mongoose_1.default.connection.on('disconnected', () => {
        console.warn('MongoDB disconnected');
    });
}
exports.connectToMongo = connectToMongo;
exports.default = connectToMongo;
