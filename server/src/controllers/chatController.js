import Message from "../models/Message.js";
import Trip from "../models/Trip.js";
import ChatRead from "../models/ChatRead.js";

async function hasChatAccess(tripId, userId) {
    const trip = await Trip.findById(tripId);

    if (!trip) {
        return {
            trip: null,
            hasAccess: false
        };
    }

    const userIdString = userId.toString();

    const isOrganizer =
        trip.createdBy?.toString() === userIdString;

    const isParticipant =
        trip.participants.some(
            (participant) =>
                participant.toString() === userIdString
        );

    return {
        trip,
        hasAccess:
            isOrganizer || isParticipant
    };
}

export const getChatHistory = async (req, res) => {
    try {
        const { tripId } = req.params;

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 30;
        const skip = (page - 1) * limit;

        const { trip, hasAccess } =
            await hasChatAccess(
                tripId,
                req.user._id
            );

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip Not Found"
            });
        }

        if (!hasAccess) {
            return res.status(403).json({
                success: false,
                message:
                    "Only trip members can view messages"
            });
        }

        const totalMessages =
            await Message.countDocuments({
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
        ).filter(
            (chat) => chat.sender
        );

        res.status(200).json({
            success: true,
            currentPage: page,
            totalPages: Math.ceil(
                totalMessages / limit
            ),
            totalMessages,
            chats
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const getChatSummaries = async (req, res) => {
    try {
        const userId = req.user._id;

        const trips = await Trip.find({
            $or: [
                { createdBy: userId },
                { participants: userId }
            ]
        }).select(
            "_id title source destination currentMembers maxMembers"
        );

        const tripIds = trips.map(
            (trip) => trip._id
        );

        const latestMessages =
            await Message.aggregate([
                {
                    $match: {
                        trip: {
                            $in: tripIds
                        }
                    }
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                {
                    $group: {
                        _id: "$trip",
                        message: {
                            $first: "$message"
                        },
                        messageType: {
                            $first: "$messageType"
                        },
                        createdAt: {
                            $first: "$createdAt"
                        },
                        sender: {
                            $first: "$sender"
                        }
                    }
                }
            ]);

        const readStates =
            await ChatRead.find({
                user: userId,
                trip: {
                    $in: tripIds
                }
            });

        const latestByTrip = new Map(
            latestMessages.map(
                (message) => [
                    message._id.toString(),
                    message
                ]
            )
        );

        const readByTrip = new Map(
            readStates.map(
                (read) => [
                    read.trip.toString(),
                    read.lastReadAt
                ]
            )
        );

        const unreadCounts =
            await Message.aggregate([
                {
                    $match: {
                        trip: {
                            $in: tripIds
                        },
                        sender: {
                            $ne: userId
                        }
                    }
                },
                {
                    $group: {
                        _id: "$trip",
                        count: {
                            $sum: 1
                        }
                    }
                }
            ]);

        const unreadByTrip = new Map(
            unreadCounts.map(
                (item) => [
                    item._id.toString(),
                    item.count
                ]
            )
        );

        const summaries = trips.map(
            (trip) => {
                const latest =
                    latestByTrip.get(
                        trip._id.toString()
                    );

                const lastReadAt =
                    readByTrip.get(
                        trip._id.toString()
                    );

                const unread =
                    unreadByTrip.get(
                        trip._id.toString()
                    ) || 0;

                return {
                    trip,
                    latestMessage:
                        latest
                            ? {
                                  message:
                                      latest.message,
                                  messageType:
                                      latest.messageType,
                                  createdAt:
                                      latest.createdAt,
                                  sender:
                                      latest.sender
                              }
                            : null,
                    unreadCount:
                        lastReadAt
                            ? unreadByTrip.get(
                                  trip._id.toString()
                              ) || 0
                            : unread
                };
            }
        );

        for (const summary of summaries) {
            const lastReadAt =
                readByTrip.get(
                    summary.trip._id.toString()
                );

            if (!lastReadAt) {
                continue;
            }

            const count =
                await Message.countDocuments({
                    trip: summary.trip._id,
                    sender: {
                        $ne: userId
                    },
                    createdAt: {
                        $gt: lastReadAt
                    }
                });

            summary.unreadCount = count;
        }

        res.status(200).json({
            success: true,
            summaries
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const markChatAsRead = async (req, res) => {
    try {
        const { tripId } = req.params;

        const { trip, hasAccess } =
            await hasChatAccess(
                tripId,
                req.user._id
            );

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip Not Found"
            });
        }

        if (!hasAccess) {
            return res.status(403).json({
                success: false,
                message:
                    "Only trip members can mark chat as read"
            });
        }

        const readState =
            await ChatRead.findOneAndUpdate(
                {
                    trip: tripId,
                    user: req.user._id
                },
                {
                    lastReadAt: new Date()
                },
                {
                    new: true,
                    upsert: true,
                    setDefaultsOnInsert: true
                }
            );

        res.status(200).json({
            success: true,
            readState
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
