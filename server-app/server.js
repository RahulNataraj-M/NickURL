import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connection as dbConnection } from "./helpers/db.js";
import shortUrl from "./routes/shortUrl.js";
import { redirectShortUrl } from "./controllers/shortUrl.js";
dotenv.config();

const port = process.env.PORT || 5001;
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

const isAllowedOrigin = (origin) => {
    if (!origin) return true;
    if (allowedOrigins.includes(origin)) return true;

    try {
        const { hostname } = new URL(origin);
        return hostname.endsWith(".vercel.app");
    } catch {
        return false;
    }
};

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: (origin, callback) => {
        if (isAllowedOrigin(origin)) {
            return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
}));

app.get("/api/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
});

app.use("/api/",shortUrl);
app.get("/:shortUrl", redirectShortUrl);

const startServer = () => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });

    const connectToDatabase = async () => {
        try {
            await dbConnection();
            console.log("Connected to MongoDB");
        } catch (err) {
            console.error("Error connecting to MongoDB", err?.message || err);
            console.error("Startup check: ensure MONGODB_URI is set correctly in hosting environment variables.");
            setTimeout(connectToDatabase, 15000);
        }
    };

    void connectToDatabase();
};

startServer();