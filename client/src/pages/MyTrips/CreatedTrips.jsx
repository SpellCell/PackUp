import TripCard from "../../components/trips/TripCard";

const CreatedTrips = ({ trips }) => {

    if (trips.length === 0) {

        return (

            <section>

                <div className="flex items-center justify-between mb-6">

                    <div>

                        <h2 className="text-3xl font-bold">

                            Created Trips

                        </h2>

                        <p className="text-zinc-500 mt-2">

                            Trips you've organized.

                        </p>

                    </div>

                </div>

                <div className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-900 p-10 text-center">

                    <h3 className="text-xl font-semibold">

                        No Created Trips

                    </h3>

                    <p className="mt-3 text-zinc-500">

                        Start your first adventure by creating a new trip.

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

                        Created Trips

                    </h2>

                    <p className="text-zinc-500 mt-2">

                        {trips.length} Trip{trips.length > 1 ? "s" : ""} Organized

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

export default CreatedTrips;