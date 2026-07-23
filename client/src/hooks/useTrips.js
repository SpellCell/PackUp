import { useEffect, useState } from "react";
import { getAllTrips } from "../api/tripApi";

const useTrips = () => {

    const [trips, setTrips] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);

    useEffect(() => {

        const fetchTrips = async () => {

            try {

                const { data } = await getAllTrips();

                setTrips(data.trips);

            } catch (err) {

                setError(err);

            } finally {

                setLoading(false);

            }

        };

        fetchTrips();

    }, []);

    return {

        trips,

        loading,

        error

    };

};

export default useTrips;