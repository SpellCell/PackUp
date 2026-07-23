import { body } from "express-validator";

export const updateProfileValidator = [

    body("name")
        .optional()
        .isLength({ min: 3 })
        .withMessage("Name must be at least 3 characters"),

    body("username")
        .optional()
        .isLength({ min: 3 })
        .withMessage("Username must be at least 3 characters"),

    body("bio")
        .optional()
        .isLength({ max: 300 })
        .withMessage("Bio cannot exceed 300 characters")

];