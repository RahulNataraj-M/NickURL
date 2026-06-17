import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connection = () => {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL;

    if (!uri) {
        throw new Error("Missing MongoDB connection string. Set MONGODB_URI, MONGO_URI, or DATABASE_URL.");
    }

    mongoose.set("bufferCommands", false);

    return mongoose.connect(uri, {
        serverSelectionTimeoutMS: 30000,
    });
};