import JoinRequest from "../models/JoinRequest.js";
import Trip from "../models/Trip.js";
import { createNotification } from "../services/notificationService.js";

export const sendJoinRequest = async (req, res) => {
    try {
        const { tripCode } = req.body;

        if (!tripCode || !tripCode.trim()) {
            return res.status(400).json({
                success: false,
                message: "Trip code is required."
            });
        }

        const normalizedTripCode = tripCode.trim().toUpperCase();

        const trip = await Trip.findOne({
            tripCode: normalizedTripCode
        });

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Invalid Trip Code."
            });
        }

        const userId = req.user._id.toString();
        const organizerId = trip.createdBy.toString();

        if (organizerId === userId) {
            return res.status(400).json({
                success: false,
                message: "You are the organizer of this trip."
            });
        }

        const alreadyParticipant = trip.participants.some(
            participant => participant.toString() === userId
        );

        if (alreadyParticipant) {
            return res.status(400).json({
                success: false,
                message: "You are already a participant."
            });
        }

        const actualMemberCount = trip.participants.length + 1;

        if (actualMemberCount >= trip.maxMembers) {
            return res.status(400).json({
                success: false,
                message: "Trip is already full."
            });
        }

        const existingRequest = await JoinRequest.findOne({
            trip: trip._id,
            requester: req.user._id,
            status: "Pending"
        });

        if (existingRequest) {
            return res.status(400).json({
                success: false,
                message: "Join request already sent."
            });
        }

        const joinRequest = await JoinRequest.create({
            trip: trip._id,
            requester: req.user._id
        });

        await createNotification({
            recipient: trip.createdBy,
            sender: req.user._id,
            trip: trip._id,
            type: "JOIN_REQUEST",
            title: "New join request",
            message: `${req.user.name} wants to join "${trip.title}".`
        });

        res.status(201).json({
            success: true,
            message: "Join request sent successfully.",
            joinRequest
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const getMyJoinRequests = async (req, res) => {
    try {
        const requests = await JoinRequest.find({
            requester: req.user._id
        })
            .populate(
                "trip",
                "title source destination tripCode currentMembers maxMembers status"
            )
            .sort({
                createdAt: -1
            });

        res.status(200).json({
            success: true,
            requests
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const getPendingJoinRequests = async (req, res) => {
    try {
        const requests = await JoinRequest.find({
            status: "Pending"
        })
            .populate({
                path: "trip",
                select:
                    "title source destination tripCode createdBy currentMembers maxMembers status"
            })
            .populate(
                "requester",
                "name username email profileImage"
            )
            .sort({
                createdAt: -1
            });

        const pending = requests.filter(
            request =>
                request.trip &&
                request.trip.createdBy.toString() ===
                    req.user._id.toString()
        );

        res.status(200).json({
            success: true,
            requests: pending
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const acceptJoinRequest = async (req, res) => {
    try {
        const request = await JoinRequest.findById(
            req.params.id
        ).populate("trip");

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Request not found."
            });
        }

        if (!request.trip) {
            return res.status(404).json({
                success: false,
                message:
                    "The trip associated with this request no longer exists."
            });
        }

        const userId = req.user._id.toString();

        if (
            request.trip.createdBy.toString() !==
            userId
        ) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized."
            });
        }

        if (request.status !== "Pending") {
            return res.status(400).json({
                success: false,
                message: "Request already processed."
            });
        }

        if (
            request.requester.toString() ===
            request.trip.createdBy.toString()
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Organizer cannot be added as a participant."
            });
        }

        const alreadyParticipant =
            request.trip.participants.some(
                participant =>
                    participant.toString() ===
                    request.requester.toString()
            );

        if (alreadyParticipant) {
            request.status = "Accepted";
            await request.save();

            await createNotification({
                recipient: request.requester,
                sender: req.user._id,
                trip: request.trip._id,
                type: "REQUEST_ACCEPTED",
                title: "Join request accepted",
                message: `Your request to join "${request.trip.title}" was accepted.`
            });

            return res.status(200).json({
                success: true,
                message: "User is already a participant."
            });
        }

        const actualMemberCount =
            request.trip.participants.length + 1;

        if (
            actualMemberCount >
            request.trip.maxMembers
        ) {
            return res.status(400).json({
                success: false,
                message: "Trip is already full."
            });
        }

        request.trip.participants.push(
            request.requester
        );

        await request.trip.save();

        request.status = "Accepted";
        await request.save();

        await createNotification({
            recipient: request.requester,
            sender: req.user._id,
            trip: request.trip._id,
            type: "REQUEST_ACCEPTED",
            title: "Join request accepted",
            message: `Your request to join "${request.trip.title}" was accepted.`
        });

        res.status(200).json({
            success: true,
            message: "Request Accepted."
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const rejectJoinRequest = async (req, res) => {
    try {
        const request = await JoinRequest.findById(
            req.params.id
        ).populate("trip");

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Request not found."
            });
        }

        if (!request.trip) {
            return res.status(404).json({
                success: false,
                message:
                    "The trip associated with this request no longer exists."
            });
        }

        if (
            request.trip.createdBy.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized."
            });
        }

        if (request.status !== "Pending") {
            return res.status(400).json({
                success: false,
                message: "Request already processed."
            });
        }

        request.status = "Rejected";
        await request.save();

        await createNotification({
            recipient: request.requester,
            sender: req.user._id,
            trip: request.trip._id,
            type: "REQUEST_REJECTED",
            title: "Join request rejected",
            message: `Your request to join "${request.trip.title}" was rejected.`
        });

        res.status(200).json({
            success: true,
            message: "Request Rejected."
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
