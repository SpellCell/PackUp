import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
    createTrip,
    getAllTrips,
    getTripById,
    updateTrip,
    deleteTrip,
    getMyTrips,
    leaveTrip,
    uploadTripCover
} from "../controllers/tripController.js";
import upload from "../middleware/uploadMiddleware.js";
import validate from "../middleware/validate.js";

import {
    createTripValidator
} from "../validators/tripValidator.js";

const router = express.Router();

router.get("/", getAllTrips);
router.get("/my-trips", protect, getMyTrips);
router.get("/:id", getTripById);

router.post(
    "/",
    protect,
    createTripValidator,
    validate,
    createTrip
);


router.put(
    "/:id/upload-cover",
    protect,
    upload.single("cover"),
    uploadTripCover
);

router.put("/:id/leave", protect, leaveTrip);

router.put("/:id", protect, updateTrip);

router.delete("/:id", protect, deleteTrip);






export default router;