import Notification from "../models/Notification.js";
import { getIO } from "../socket/socket.js";

export const createNotification = async ({
    recipient,
    sender = null,
    trip = null,
    type,
    title,
    message
}) => {

    try {

        const notification = await Notification.create({
            recipient,
            sender,
            trip,
            type,
            title,
            message
        });

        const populatedNotification = await Notification.findById(notification._id)
            .populate("sender", "name username profileImage")
            .populate("trip", "title");

        try {

            const io = getIO();

            io.to(recipient.toString()).emit(
                "newNotification",
                populatedNotification
            );

        } catch (error) {

            console.log("Socket notification skipped.");

        }

        return populatedNotification;

    } catch (error) {

        console.log(error);

        return null;

    }

};