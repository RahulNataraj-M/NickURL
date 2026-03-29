import express from "express";
import { createUrl, getAllUrl, getUrl, deleteUrl, updateUrlPut, updateUrlPatch } from "../controllers/shortUrl.js";

const router = express.Router();

router.post("/shortUrl",createUrl);
router.get("/shortUrl",getAllUrl);
router.get("/shortUrl/:id",getUrl);
router.delete("/shortUrl/:id",deleteUrl);
router.put("/shortUrl/:id",updateUrlPut);
router.patch("/shortUrl/:id",updateUrlPatch);

export default router;

