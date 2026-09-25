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
        ).filter(
            (chat) => chat.sender
        );

        res.status(200).json({
            success: true,
            currentPage: 1,
            totalPages: 1,
            totalMessages: chats.length,
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

        if (tripIds.length === 0) {
            return res.status(200).json({
                success: true,
                summaries: []
            });
        }

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

        const latestByTrip = new Map(
            latestMessages.map(
                (message) => [
                    message._id.toString(),
                    message
                ]
            )
        );

        const existingReadStates =
            await ChatRead.find({
                user: userId,
                trip: {
                    $in: tripIds
                }
            });

        const readByTrip = new Map(
            existingReadStates.map(
                (read) => [
                    read.trip.toString(),
                    read.lastReadAt
                ]
            )
        );

        const missingReadStates =
            trips
                .filter(
                    (trip) =>
                        !readByTrip.has(
                            trip._id.toString()
                        )
                )
                .map((trip) => {
                    const latest =
                        latestByTrip.get(
                            trip._id.toString()
                        );

                    return {
                        updateOne: {
                            filter: {
                                trip: trip._id,
                                user: userId
                            },
                            update: {
                                $setOnInsert: {
                                    lastReadAt:
                                        latest?.createdAt ||
                                        new Date()
                                }
                            },
                            upsert: true
                        }
                    };
                });

        if (missingReadStates.length > 0) {
            await ChatRead.bulkWrite(
                missingReadStates
            );
        }

        const readStates =
            await ChatRead.find({
                user: userId,
                trip: {
                    $in: tripIds
                }
            });

        const updatedReadByTrip = new Map(
            readStates.map(
                (read) => [
                    read.trip.toString(),
                    read.lastReadAt
                ]
            )
        );

        const summaries = await Promise.all(
            trips.map(async (trip) => {
                const tripKey =
                    trip._id.toString();

                const latest =
                    latestByTrip.get(
                        tripKey
                    );

                const lastReadAt =
                    updatedReadByTrip.get(
                        tripKey
                    );

                const unreadCount =
                    lastReadAt
                        ? await Message.countDocuments({
                              trip: trip._id,
                              sender: {
                                  $ne: userId
                              },
                              createdAt: {
                                  $gt: lastReadAt
                              }
                          })
                        : 0;

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
                    unreadCount
                };
            })
        );

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
