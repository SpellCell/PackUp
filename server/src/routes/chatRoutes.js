import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getChatHistory } from "../controllers/chatController.js";

const router = express.Router();

router.get(
    "/:tripId/history",
    protect,
    getChatHistory
);

export default router;