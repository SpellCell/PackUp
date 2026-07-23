import Message from "../models/Message.js";
import Trip from "../models/Trip.js";

export const getChatHistory = async (req, res) => {

    try {

        const { tripId } = req.params;

        const page = Number(req.query.page) || 1;

        const limit = Number(req.query.limit) || 30;

        const skip = (page - 1) * limit;

        const trip = await Trip.findById(tripId);

        if (!trip) {

            return res.status(404).json({
                success: false,
                message: "Trip Not Found"
            });

        }

        const isParticipant = trip.participants.some(

            participant =>

                participant.toString() ===
                req.user._id.toString()

        );

        if (!isParticipant) {

            return res.status(403).json({

                success: false,

                message: "Only Participants Can View Messages"

            });

        }

        const totalMessages = await Message.countDocuments({

            trip: tripId

        });

        const chats = (
            await Message.find({

                trip: tripId

            })
                .populate(

                    "sender",

                    "name username profileImage"

                )
                .sort({

                    createdAt: 1

                })
                .skip(skip)
                .limit(limit)
        ).filter(chat => chat.sender);

        res.status(200).json({

            success: true,

            currentPage: page,

            totalPages: Math.ceil(totalMessages / limit),

            totalMessages,

            chats

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};