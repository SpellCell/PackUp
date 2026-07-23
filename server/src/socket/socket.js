import { Server } from "socket.io";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import Trip from "../models/Trip.js";
import Chat from "../models/Message.js";

let io;

const onlineUsers = new Map();

export const initializeSocket = (server) => {

    io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"]
        }
    });

    // ===============================
    // JWT Authentication
    // ===============================

    io.use(async (socket, next) => {

        try {

            const token = socket.handshake.auth.token;

            if (!token) {
                return next(new Error("Authentication Error"));
            }

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            const user = await User.findById(decoded.id).select("-password");

            if (!user) {
                return next(new Error("User Not Found"));
            }

            socket.user = user;

            next();

        } catch (error) {

            next(new Error("Authentication Error"));

        }

    });

    // ===============================
    // Connection
    // ===============================

    io.on("connection", (socket) => {

        console.log(
            `✅ ${socket.user.name} connected (${socket.id})`
        );

        // online user
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

socket.join(socket.user._id.toString());

console.log(
    `${socket.user.name} joined personal room`
);

        // ===============================
        // Join Trip Room
        // ===============================

        socket.on("joinTrip", async (tripId) => {

            try {

                const trip = await Trip.findById(tripId);

                if (!trip) {

                    socket.emit("error", "Trip Not Found");

                    return;

                }

                const isParticipant = trip.participants.some(

                    participant =>

                        participant.toString() ===
                        socket.user._id.toString()

                );

                if (!isParticipant) {

                    socket.emit(
                        "error",
                        "You are not a participant of this trip"
                    );

                    return;

                }

                socket.join(tripId);

                console.log(
                    `${socket.user.name} joined room ${tripId}`
                );

            } catch (error) {

                console.log(error);

            }

        });

        // ===============================
        // Leave Trip
        // ===============================

        socket.on("leaveTrip", (tripId) => {

            socket.leave(tripId);

            console.log(
                `${socket.user.name} left room ${tripId}`
            );

        });

        // ===============================
        // Send Message
        // ===============================

        socket.on("sendMessage", async (data) => {

            try {

                const {

                    tripId,

                    message

                } = data;

                const trip = await Trip.findById(tripId);

                if (!trip) {

                    socket.emit("error", "Trip Not Found");

                    return;

                }

                const isParticipant = trip.participants.some(

                    participant =>

                        participant.toString() ===
                        socket.user._id.toString()

                );

                if (!isParticipant) {

                    socket.emit(
                        "error",
                        "You are not allowed to send messages"
                    );

                    return;

                }

                const chat = await Chat.create({

                    trip: tripId,

                    sender: socket.user._id,

                    message

                });

                const populatedMessage = await Chat.findById(chat._id)

                    .populate(
                        "sender",
                        "name username profileImage"
                    );

                io.to(tripId).emit(

                    "receiveMessage",

                    populatedMessage

                );

            } catch (error) {

                console.log(error);

            }

        });

        // ===============================
        // Typing Indicator
        // ===============================

        socket.on("typing", (tripId) => {

            socket.to(tripId).emit(

                "typing",

                socket.user.name

            );

        });

        socket.on("stopTyping", (tripId) => {

            socket.to(tripId).emit(

                "stopTyping"

            );

        });

        // ===============================
        // Disconnect
        // ===============================

        socket.on("disconnect", () => {

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

});

    });

};

export const getIO = () => {

    if (!io) {

        throw new Error("Socket.IO has not been initialized");

    }

    return io;

};