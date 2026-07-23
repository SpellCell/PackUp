import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";

import { getMyTrips } from "../../api/tripApi";

const ChatSidebar = ({ selectedTrip, onSelectTrip }) => {

    const [trips, setTrips] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchTrips();

    }, []);

    const fetchTrips = async () => {

        try {

            const { data } = await getMyTrips();

            const allTrips = [

                ...(data.createdTrips || []),

                ...(data.joinedTrips || [])

            ];

            setTrips(allTrips);

            // Auto-select first trip
            if (allTrips.length > 0 && !selectedTrip) {

                onSelectTrip(allTrips[0]);

            }

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

            <div className="p-6">

                <p className="text-zinc-500">

                    Loading chats...

                </p>

            </div>

        );

    }

    return (

        <div className="h-full overflow-y-auto">

            <div className="p-6 border-b border-zinc-800">

                <h2 className="text-2xl font-bold">

                    Chats

                </h2>

                <p className="text-zinc-500 mt-1">

                    {trips.length} Trip{trips.length !== 1 && "s"}

                </p>

            </div>

            {

                trips.length === 0 ? (

                    <div className="p-6 text-center">

                        <MessageCircle
                            className="mx-auto text-zinc-600"
                            size={42}
                        />

                        <p className="mt-4 text-zinc-500">

                            Join a trip to start chatting.

                        </p>

                    </div>

                ) : (

                    trips.map((trip) => (

                        <button

                            key={trip._id}

                            onClick={() => onSelectTrip(trip)}

                            className={`
                                w-full
                                flex
                                items-center
                                gap-4
                                px-5
                                py-4
                                border-b
                                border-zinc-800
                                transition

                                ${
                                    selectedTrip?._id === trip._id

                                    ? "bg-indigo-600/20 border-l-4 border-l-indigo-500"

                                    : "hover:bg-zinc-800"
                                }
                            `}

                        >

                            {

                                trip.coverImage ?

                                (

                                    <img

                                        src={trip.coverImage}

                                        alt={trip.title}

                                        className="w-14 h-14 rounded-2xl object-cover"

                                    />

                                )

                                :

                                (

                                    <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center">

                                        ✈️

                                    </div>

                                )

                            }

                            <div className="text-left flex-1">

                                <h3 className="font-semibold">

                                    {trip.title}

                                </h3>

                                <p className="text-sm text-zinc-500">

                                    {trip.source} → {trip.destination}

                                </p>

                            </div>

                        </button>

                    ))

                )

            }

        </div>

    );

};

export default ChatSidebar;