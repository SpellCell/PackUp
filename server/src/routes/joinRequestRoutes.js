import express from "express";
import protect from "../middleware/authMiddleware.js";

import {

    sendJoinRequest,

    getMyJoinRequests,

    getPendingJoinRequests,

    acceptJoinRequest,

    rejectJoinRequest

} from "../controllers/joinRequestController.js";

const router = express.Router();

router.post("/", protect, sendJoinRequest);

router.get("/my", protect, getMyJoinRequests);

router.get("/pending", protect, getPendingJoinRequests);

router.put("/:id/accept", protect, acceptJoinRequest);

router.put("/:id/reject", protect, rejectJoinRequest);

export default router;