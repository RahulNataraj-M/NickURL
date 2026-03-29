import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connection as dbConnection } from "./helpers/db.js";
import shortUrl from "./routes/shortUrl.js";
import { redirectShortUrl } from "./controllers/shortUrl.js";
dotenv.config();

const port = process.env.PORT || 5001;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

app.use("/api/",shortUrl);
app.get("/:shortUrl", redirectShortUrl);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    dbConnection().then(() => {
        console.log("Connected to MongoDB");
    }).catch((err) => {
        console.error("Error connecting to MongoDB", err);
    });
});