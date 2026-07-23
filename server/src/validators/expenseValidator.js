import { body } from "express-validator";

export const expenseValidator = [

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required"),

    body("amount")
        .isFloat({ gt: 0 })
        .withMessage("Amount must be greater than 0"),

    body("participants")
        .isArray({ min: 1 })
        .withMessage("At least one participant is required")

];