import API from "./axios";

/**
 * Create Trip
 */
export const createTrip = (tripData) =>
    API.post("/trips", tripData);

/**
 * Get All Trips
 */
export const getAllTrips = (params) =>
    API.get("/trips", { params });

/**
 * Get Single Trip
 */
export const getTripById = (id) =>
    API.get(`/trips/${id}`);

/**
 * My Trips
 */
export const getMyTrips = () =>
    API.get("/trips/my-trips");


/**
 * Leave Trip
 */
export const leaveTrip = (id) =>
    API.put(`/trips/${id}/leave`);

/**
 * Update Trip
 */
export const updateTrip = (id, data) =>
    API.put(`/trips/${id}`, data);

/**
 * Delete Trip
 */
export const deleteTrip = (id) =>
    API.delete(`/trips/${id}`);

/**
 * Upload Cover
 */
export const uploadTripCover = (id, formData) =>
    API.put(
        `/trips/${id}/upload-cover`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );