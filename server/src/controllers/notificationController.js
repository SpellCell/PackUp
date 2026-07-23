import Notification from "../models/Notification.js";

export const getNotifications = async (req, res) => {

    try {

        const notifications = await Notification.find({

            recipient: req.user._id

        })
        .populate("sender", "name username profileImage")
        .populate("trip", "title")
        .sort({
            createdAt: -1
        });

        res.status(200).json({

            success: true,

            notifications

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};