import { Server } from "socket.io";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import Trip from "../models/Trip.js";
import Chat from "../models/Message.js";

let io;

const onlineUsers = new Map();

export const initializeSocket = (server) => {
    const CLIENT_URL =
        process.env.CLIENT_URL ||
        "http://localhost:5173";

    io = new Server(server, {
        cors: {
            origin: CLIENT_URL,
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    // ===============================
    // JWT Authentication
    // ===============================

    io.use(async (socket, next) => {
        try {
            const token =
                socket.handshake.auth.token;

            if (!token) {
                return next(
                    new Error(
                        "Authentication Error"
                    )
                );
            }

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            const user = await User.findById(
                decoded.id
            ).select("-password");

            if (!user) {
                return next(
                    new Error(
                        "User Not Found"
                    )
                );
            }

            socket.user = user;

            next();

        } catch (error) {
            console.log(
                "Socket authentication error:",
                error.message
            );

            next(
                new Error(
                    "Authentication Error"
                )
            );
        }
    });

    // ===============================
    // Connection
    // ===============================

    io.on("connection", (socket) => {
        console.log(
            `✅ ${socket.user.name} connected (${socket.id})`
        );

        // ===============================
        // Online User
        // ===============================

        onlineUsers.set(
            socket.user._id.toString(),
            socket.id
        );

        io.emit(
            "onlineUsers",
            [...onlineUsers.keys()]
        );

        // ===============================
        // Personal Notification Room
        // ===============================

        socket.join(
            socket.user._id.toString()
        );

        console.log(
            `${socket.user.name} joined personal room`
        );

        // ===============================
        // Join Trip Room
        // ===============================

        socket.on(
            "joinTrip",
            async (tripId) => {
                try {
                    const trip =
                        await Trip.findById(
                            tripId
                        );

                    if (!trip) {
                        socket.emit(
                            "error",
                            "Trip Not Found"
                        );

                        return;
                    }

                    const userId =
                        socket.user._id.toString();

                    const organizerId =
                        trip.createdBy?.toString();

                    const isOrganizer =
                        organizerId === userId;

                    const isParticipant =
                        trip.participants.some(
                            (participant) =>
                                participant.toString() ===
                                userId
                        );

                    const hasChatAccess =
                        isOrganizer ||
                        isParticipant;

                    if (!hasChatAccess) {
                        socket.emit(
                            "error",
                            "You are not allowed to access this chat"
                        );

                        return;
                    }

                    socket.join(tripId);

                    console.log(
                        `${socket.user.name} joined room ${tripId}`
                    );

                } catch (error) {
                    console.log(
                        "Join trip socket error:",
                        error
                    );
                }
            }
        );

        // ===============================
        // Leave Trip
        // ===============================

        socket.on(
            "leaveTrip",
            (tripId) => {
                socket.leave(tripId);

                console.log(
                    `${socket.user.name} left room ${tripId}`
                );
            }
        );

        // ===============================
        // Send Message
        // ===============================

        socket.on(
            "sendMessage",
            async (data) => {
                try {
                    const {
                        tripId,
                        message
                    } = data;

                    if (
                        !tripId ||
                        !message ||
                        !message.trim()
                    ) {
                        return;
                    }

                    const trip =
                        await Trip.findById(
                            tripId
                        );

                    if (!trip) {
                        socket.emit(
                            "error",
                            "Trip Not Found"
                        );

                        return;
                    }

                    const userId =
                        socket.user._id.toString();

                    const organizerId =
                        trip.createdBy?.toString();

                    const isOrganizer =
                        organizerId === userId;

                    const isParticipant =
                        trip.participants.some(
                            (participant) =>
                                participant.toString() ===
                                userId
                        );

                    const hasChatAccess =
                        isOrganizer ||
                        isParticipant;

                    if (!hasChatAccess) {
                        socket.emit(
                            "error",
                            "You are not allowed to send messages"
                        );

                        return;
                    }

                    const chat =
                        await Chat.create({
                            trip: tripId,
                            sender:
                                socket.user._id,
                            message:
                                message.trim()
                        });

                    const populatedMessage =
                        await Chat.findById(
                            chat._id
                        ).populate(
                            "sender",
                            "name username profileImage"
                        );

                    io.to(tripId).emit(
                        "receiveMessage",
                        populatedMessage
                    );

                } catch (error) {
                    console.log(
                        "Send message socket error:",
                        error
                    );

                    socket.emit(
                        "error",
                        "Unable to send message"
                    );
                }
            }
        );

        // ===============================
        // Typing Indicator
        // ===============================

        socket.on(
            "typing",
            (tripId) => {
                socket
                    .to(tripId)
                    .emit(
                        "typing",
                        socket.user.name
                    );
            }
        );

        socket.on(
            "stopTyping",
            (tripId) => {
                socket
                    .to(tripId)
                    .emit(
                        "stopTyping"
                    );
            }
        );

        // ===============================
        // Disconnect
        // ===============================

        socket.on(
            "disconnect",
            () => {
                onlineUsers.delete(
                    socket.user._id.toString()
                );

                io.emit(
                    "onlineUsers",
                    [...onlineUsers.keys()]
                );

                console.log(
                    `❌ ${socket.user.name} disconnected`
                );
            }
        );
    });
};

export const getIO = () => {
    if (!io) {
        throw new Error(
            "Socket.IO has not been initialized"
        );
    }

    return io;
};