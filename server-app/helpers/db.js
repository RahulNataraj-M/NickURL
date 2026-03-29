import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connection = () => {
    const uri = process.env.MONGODB_URI;
    return mongoose.connect(uri);
}