import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
    Wallet,
    MapPin,
    CalendarDays
} from "lucide-react";

import AppLayout from "../../components/layout/AppLayout";
import GlassCard from "../../components/ui/GlassCard";

import { getMyTrips } from "../../api/tripApi";

const Expenses = () => {
    const navigate = useNavigate();

    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTrips();
    }, []);

    const fetchTrips = async () => {
        try {
            const { data } = await getMyTrips();

            const createdTrips =
                data.createdTrips || [];

            const joinedTrips =
                data.joinedTrips || [];

            setTrips([
                ...createdTrips,
                ...joinedTrips
            ]);
        } catch (error) {
            console.log(error);

            toast.error(
                error.response?.data?.message ||
                "Unable to load your trips."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout>
            <div className="max-w-6xl mx-auto space-y-8">

                <div>
                    <div className="flex items-center gap-3">

                        <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                            <Wallet
                                size={24}
                                className="text-indigo-400"
                            />
                        </div>

                        <div>
                            <h1 className="text-5xl font-bold">
                                Expenses
                            </h1>

                            <p className="mt-2 text-zinc-500">
                                Select a trip to manage shared expenses.
                            </p>
                        </div>

                    </div>
                </div>

                {loading ? (
                    <GlassCard className="p-8">
                        <p className="text-zinc-500">
                            Loading your trips...
                        </p>
                    </GlassCard>
                ) : trips.length === 0 ? (
                    <GlassCard className="p-12 text-center">

                        <Wallet
                            size={40}
                            className="mx-auto text-zinc-600"
                        />

                        <h2 className="text-2xl font-bold mt-5">
                            No Trips Found
                        </h2>

                        <p className="text-zinc-500 mt-2">
                            Create or join a trip before adding expenses.
                        </p>

                    </GlassCard>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {trips.map(trip => (
                            <button
                                key={trip._id}
                                onClick={() =>
                                    navigate(
                                        `/expenses/${trip._id}`
                                    )
                                }
                                className="text-left"
                            >
                                <GlassCard className="p-6 hover:border-indigo-500/50 transition">

                                    <div className="flex items-start justify-between gap-4">

                                        <div>

                                            <h2 className="text-2xl font-bold">
                                                {trip.title}
                                            </h2>

                                            <div className="flex items-center gap-2 mt-3 text-sm text-zinc-500">

                                                <MapPin size={16} />

                                                <span>
                                                    {trip.source}
                                                    {" → "}
                                                    {trip.destination}
                                                </span>

                                            </div>

                                            <div className="flex items-center gap-2 mt-2 text-sm text-zinc-500">

                                                <CalendarDays size={16} />

                                                <span>
                                                    {new Date(
                                                        trip.startDate
                                                    ).toLocaleDateString()}
                                                    {" - "}
                                                    {new Date(
                                                        trip.endDate
                                                    ).toLocaleDateString()}
                                                </span>

                                            </div>

                                        </div>

                                        <div className="h-10 w-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">

                                            <Wallet size={18} />

                                        </div>

                                    </div>

                                    <div className="mt-6 pt-5 border-t border-zinc-800">

                                        <span className="text-sm text-indigo-400">
                                            Manage Trip Expenses →
                                        </span>

                                    </div>

                                </GlassCard>
                            </button>
                        ))}

                    </div>
                )}

            </div>
        </AppLayout>
    );
};

export default Expenses;