import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
    markSettlementPaid,
    getTripSettlements
} from "../controllers/settlementController.js";

const router = express.Router();

router.get(
    "/:tripId",
    protect,
    getTripSettlements
);

router.put(
    "/:tripId/:settlementId/pay",
    protect,
    markSettlementPaid
);

export default router;