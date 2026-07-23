import TripCard from "../../components/trips/TripCard";

const JoinedTrips = ({ trips }) => {

    if (trips.length === 0) {

        return (

            <section>

                <div className="flex items-center justify-between mb-6">

                    <div>

                        <h2 className="text-3xl font-bold">

                            Joined Trips

                        </h2>

                        <p className="text-zinc-500 mt-2">

                            Adventures you're participating in.

                        </p>

                    </div>

                </div>

                <div className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-900 p-10 text-center">

                    <h3 className="text-xl font-semibold">

                        No Joined Trips

                    </h3>

                    <p className="mt-3 text-zinc-500">

                        Explore trips and join your next adventure.

                    </p>

                </div>

            </section>

        );

    }

    return (

        <section>

            <div className="flex items-center justify-between mb-8">

                <div>

                    <h2 className="text-3xl font-bold">

                        Joined Trips

                    </h2>

                    <p className="text-zinc-500 mt-2">

                        {trips.length} Trip{trips.length > 1 ? "s" : ""} Joined

                    </p>

                </div>

            </div>

            <div className="grid gap-8">

                {

                    trips.map((trip) => (

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

export default JoinedTrips;