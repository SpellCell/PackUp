import "dotenv/config";

import http from "http";
import app from "./app.js";
import connectDB from "./config/db.js";
import { initializeSocket } from "./socket/socket.js";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const startServer = async () => {

    try {

        await connectDB();

        initializeSocket(server);

        server.listen(PORT, () => {

            console.log(`🚀 Server running on http://localhost:${PORT}`);

        });

    } catch (error) {

        console.error("Unable to start server.");

        console.error(error);

        process.exit(1);

    }

};

startServer();