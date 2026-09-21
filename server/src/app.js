import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";
import joinRequestRoutes from "./routes/joinRequestRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import settlementRoutes from "./routes/settlementRoutes.js";

import errorHandler from "./middleware/errorMiddleware.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE"
        ],
        allowedHeaders: [
            "Content-Type",
            "Authorization"
        ]
    })
);

app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));

// Auth
app.use(
    "/api/auth",
    authRoutes
);

// User routes
app.use(
    "/api/users",
    userRoutes
);

// Trip routes
app.use(
    "/api/trips",
    tripRoutes
);

// Join request routes
app.use(
    "/api/join-request",
    joinRequestRoutes
);

// Chat routes
app.use(
    "/api/chat",
    chatRoutes
);

// Expense routes
app.use(
    "/api/expenses",
    expenseRoutes
);

// Notification routes
app.use(
    "/api/notifications",
    notificationRoutes
);

// Settlement routes
app.use(
    "/api/settlements",
    settlementRoutes
);

// Error handling middleware
app.use(errorHandler);

// Test Route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to PackUP API 🚀"
    });
});

export default app;