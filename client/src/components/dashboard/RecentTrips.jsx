import TripCard from "../trips/TripCard";

const RecentTrips = ({ trips = [] }) => {

    if (!trips.length) {

        return (

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-10 text-center">

                <h2 className="text-3xl font-bold">

                    No Trips Yet

                </h2>

                <p className="text-zinc-500 mt-3">

                    Your created trips will appear here.

                </p>

            </div>

        );

    }

    return (

        <section>

            <div className="flex items-center justify-between mb-8">

                <h2 className="text-3xl font-bold">

                    Recent Trips

                </h2>

            </div>

            <div className="grid xl:grid-cols-2 gap-8">

                {

                    trips

                        .slice(0, 4)

                        .map(trip => (

                            <TripCard

                                key={trip._id}

                                trip={trip}

                            />

                        ))

                }

            </div>

        </section>

    );

};

export default RecentTrips;