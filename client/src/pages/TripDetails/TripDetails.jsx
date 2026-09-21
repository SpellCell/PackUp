import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import AppLayout from "../../components/layout/AppLayout";

import { getTripById } from "../../api/tripApi";

import { useAuth } from "../../context/AuthContext";

import TripHero from "./TripHero";
import TripStats from "./TripStats";
import TripParticipants from "./TripParticipants";
import TripDescription from "./TripDescription";
import TripActions from "./TripActions";

import ManageMembers from "../../components/trips/ManageMembers";

const TripDetails = () => {

    const { id } = useParams();

    const { user } = useAuth();

    const [trip, setTrip] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchTrip();

    }, [id]);

    const fetchTrip = async () => {

        try {

            const { data } = await getTripById(id);

            setTrip(data.trip);

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (

            <AppLayout>

                <div className="flex justify-center py-40">

                    <p className="text-zinc-400 text-xl">
                        Loading Trip...
                    </p>

                </div>

            </AppLayout>

        );

    }

    if (!trip) {

        return (

            <AppLayout>

                <div className="flex justify-center py-40">

                    <p className="text-red-400 text-xl">
                        Trip Not Found
                    </p>

                </div>

            </AppLayout>

        );

    }

    const isOwner =
        trip.createdBy?._id === user?._id;

    return (

        <AppLayout>

            <div className="space-y-8">

                <TripHero trip={trip} />

                <TripStats trip={trip} />

                <TripDescription trip={trip} />

                <TripParticipants trip={trip} />

                <TripActions
                    trip={trip}
                    refreshTrip={fetchTrip}
                />

                {
                    isOwner && (

                        <ManageMembers
                            trip={trip}
                            refreshTrip={fetchTrip}
                        />

                    )
                }

            </div>

        </AppLayout>

    );

};

export default TripDetails;