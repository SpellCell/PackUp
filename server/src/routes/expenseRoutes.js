import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
    addExpense,getTripBalances,getSettlementSuggestions
} from "../controllers/expenseController.js";
 import validate from "../middleware/validate.js";
import {
    expenseValidator
} from "../validators/expenseValidator.js";

const router = express.Router();

router.post("/:tripId", protect, addExpense);
router.get(
    "/:tripId/balance",
    protect,
    getTripBalances
);
router.get(
    "/:tripId/settlements",
    protect,
    getSettlementSuggestions
);

router.post(
    "/:tripId",
    protect,
    expenseValidator,
    validate,
    addExpense
);


export default router;