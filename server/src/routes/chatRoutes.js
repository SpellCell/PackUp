import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
    getChatHistory,
    getChatSummaries,
    markChatAsRead
} from "../controllers/chatController.js";

const router = express.Router();

router.get(
    "/summaries",
    protect,
    getChatSummaries
);

router.patch(
    "/:tripId/read",
    protect,
    markChatAsRead
);

router.get(
    "/:tripId/history",
    protect,
    getChatHistory
);

export default router;
