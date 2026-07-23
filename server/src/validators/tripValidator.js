import { body } from "express-validator";

export const createTripValidator = [

    body("title")
        .trim()
        .notEmpty()
        .withMessage("Trip title is required")
        .isLength({ min: 3, max: 100 })
        .withMessage("Trip title must be between 3 and 100 characters"),

    body("destination")
        .trim()
        .notEmpty()
        .withMessage("Destination is required"),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required")
        .isLength({ min: 20 })
        .withMessage("Description must be at least 20 characters"),

    body("startDate")
        .notEmpty()
        .withMessage("Start date is required")
        .isISO8601()
        .withMessage("Invalid start date"),

    body("endDate")
        .notEmpty()
        .withMessage("End date is required")
        .isISO8601()
        .withMessage("Invalid end date"),

    body("maxMembers")
        .isInt({ min: 2, max: 100 })
        .withMessage("Max members must be between 2 and 100")

];