import Trip from "../models/Trip.js";
import cloudinary from "../config/cloudinary.js";
import { createNotification } from "../services/notificationService.js";

export const createTrip = async (req, res) => {
    try {

        const {
            title,
            source,
            destination,
            description,
            startDate,
            endDate,
            budget,
            maxMembers,
            tripType
        } = req.body;

        const trip = await Trip.create({
            title,
            source,
            destination,
            description,
            startDate,
            endDate,
            budget,
            maxMembers,
            tripType,
            createdBy: req.user._id,
            participants: [req.user._id]
        });

        res.status(201).json({
            success: true,
            message: "Trip Created Successfully",
            trip
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};


// Get all trips

export const getAllTrips = async (req, res) => {
    try {

        const {
            destination,
            source,
            tripType,
            minBudget,
            maxBudget,
            page = 1,
            limit = 10
        } = req.query;

        const query = {
            status: "Open"
        };

        if (destination) {
            query.destination = {
                $regex: destination,
                $options: "i"
            };
        }

        if (source) {
            query.source = {
                $regex: source,
                $options: "i"
            };
        }

        if (tripType) {
            query.tripType = tripType;
        }

        if (minBudget || maxBudget) {
            query.budget = {};

            if (minBudget) {
                query.budget.$gte = Number(minBudget);
            }

            if (maxBudget) {
                query.budget.$lte = Number(maxBudget);
            }
        }

        const skip = (page - 1) * limit;

        const totalTrips = await Trip.countDocuments(query);

        const trips = await Trip.find(query)
            .select("-tripCode")
            .populate(
                "createdBy",
                "name username profileImage"
            )
            .sort({
                createdAt: -1
            })
            .skip(skip)
            .limit(Number(limit));

        res.status(200).json({
            success: true,
            currentPage: Number(page),
            totalPages: Math.ceil(totalTrips / limit),
            totalTrips,
            trips
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};


// Get single trip

export const getTripById = async (req, res) => {
    try {

        const trip = await Trip.findById(req.params.id)
            .populate(
                "createdBy",
                "name username email profileImage"
            )
            .populate(
                "participants",
                "name username profileImage"
            );

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip Not Found"
            });
        }

        const tripData = trip.toObject();

        const isOwner =
            trip.createdBy._id.toString() ===
            req.user._id.toString();

        if (!isOwner) {
            delete tripData.tripCode;
        }

        res.status(200).json({
            success: true,
            trip: tripData
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};


// Update trip

export const updateTrip = async (req, res) => {
    try {

        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip Not Found"
            });
        }

        if (
            trip.createdBy.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this trip"
            });
        }

        const updatedTrip = await Trip.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            message: "Trip Updated Successfully",
            trip: updatedTrip
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};


// Delete trip

export const deleteTrip = async (req, res) => {
    try {

        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip Not Found"
            });
        }

        if (
            trip.createdBy.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this trip"
            });
        }

        await trip.deleteOne();

        res.status(200).json({
            success: true,
            message: "Trip Deleted Successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};


// Leave trip

export const leaveTrip = async (req, res) => {

    try {

        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip Not Found"
            });
        }

        if (
            trip.createdBy.toString() ===
            req.user._id.toString()
        ) {
            return res.status(400).json({
                success: false,
                message: "Trip Owner Cannot Leave Their Own Trip"
            });
        }

        const participantIndex =
            trip.participants.findIndex(
                participant =>
                    participant.toString() ===
                    req.user._id.toString()
            );

        if (participantIndex === -1) {
            return res.status(400).json({
                success: false,
                message: "You are not a participant of this trip"
            });
        }

        trip.participants.splice(
            participantIndex,
            1
        );

        trip.currentMembers -= 1;

        if (trip.status === "Full") {
            trip.status = "Open";
        }

        await trip.save();

        res.status(200).json({
            success: true,
            message: "Trip Left Successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};


// Remove participant

export const removeParticipant = async (req, res) => {

    try {

        const { id, userId } = req.params;

        const trip = await Trip.findById(id);

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip Not Found"
            });
        }

        if (
            trip.createdBy.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Only the trip organizer can remove members"
            });
        }

        if (
            trip.createdBy.toString() ===
            userId.toString()
        ) {
            return res.status(400).json({
                success: false,
                message: "Organizer cannot be removed from the trip"
            });
        }

        const participantIndex =
            trip.participants.findIndex(
                participant =>
                    participant.toString() ===
                    userId.toString()
            );

        if (participantIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "User is not a participant of this trip"
            });
        }

        trip.participants.splice(
            participantIndex,
            1
        );

        trip.currentMembers -= 1;

        if (trip.currentMembers < 1) {
            trip.currentMembers = 1;
        }

        if (trip.status === "Full") {
            trip.status = "Open";
        }

        await trip.save();

        await createNotification({
            recipient: userId,
            sender: req.user._id,
            trip: trip._id,
            type: "MEMBER_REMOVED",
            title: "Removed from Trip",
            message: `You have been removed from "${trip.title}".`
        });

        res.status(200).json({
            success: true,
            message: "Member removed successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};


// Get trips user has participated in

export const getMyTrips = async (req, res) => {
    try {

        const createdTrips = await Trip.find({
            createdBy: req.user._id
        })
        .populate(
            "participants",
            "name username email profileImage"
        );

        const joinedTrips = await Trip.find({
            participants: req.user._id,
            createdBy: {
                $ne: req.user._id
            }
        })
        .populate(
            "createdBy",
            "name username profileImage"
        );

        res.status(200).json({
            success: true,
            createdTrips,
            joinedTrips
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};


// Upload trip cover

export const uploadTripCover = async (req, res) => {

    try {

        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip Not Found"
            });
        }

        if (
            trip.createdBy.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Not Authorized"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload an image"
            });
        }

        if (trip.coverImagePublicId) {
            await cloudinary.uploader.destroy(
                trip.coverImagePublicId
            );
        }

        trip.coverImage = req.file.path;
        trip.coverImagePublicId = req.file.filename;

        await trip.save();

        res.status(200).json({
            success: true,
            message: "Trip Cover Uploaded Successfully",
            trip
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};