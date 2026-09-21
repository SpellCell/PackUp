import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
    addExpense,
    getTripExpenses,
    deleteExpense,
    getTripBalances,
    getSettlementSuggestions
} from "../controllers/expenseController.js";

import validate from "../middleware/validate.js";

import {
    expenseValidator
} from "../validators/expenseValidator.js";

const router = express.Router();

router.post(
    "/:tripId",
    protect,
    expenseValidator,
    validate,
    addExpense
);

router.get(
    "/:tripId",
    protect,
    getTripExpenses
);

router.delete(
    "/:tripId/:expenseId",
    protect,
    deleteExpense
);

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

export default router;