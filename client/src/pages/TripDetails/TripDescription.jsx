import {
    FileText,
    Clock,
    MapPinned
} from "lucide-react";

const TripDescription = ({ trip }) => {

    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);

    const duration = Math.ceil(
        (end - start) / (1000 * 60 * 60 * 24)
    ) + 1;

    return (

        <section className="space-y-6">

            <h2 className="text-2xl font-bold">

                About this Trip

            </h2>

            <div className="
                rounded-3xl
                border
                border-zinc-800
                bg-zinc-900
                p-8
            ">

                <div className="flex items-center gap-3">

                    <div className="
                        w-12
                        h-12
                        rounded-2xl
                        bg-indigo-500/15
                        text-indigo-400
                        flex
                        items-center
                        justify-center
                    ">

                        <FileText size={22} />

                    </div>

                    <div>

                        <h3 className="text-xl font-bold">

                            Trip Description

                        </h3>

                        <p className="text-zinc-500">

                            Everything you need to know

                        </p>

                    </div>

                </div>

                <p className="
                    mt-8
                    leading-8
                    text-zinc-300
                    whitespace-pre-line
                ">

                    {trip.description}

                </p>

                <div className="
                    mt-10
                    grid
                    md:grid-cols-2
                    gap-5
                ">

                    <div className="
                        rounded-2xl
                        bg-zinc-800
                        p-5
                        flex
                        items-center
                        gap-4
                    ">

                        <div className="
                            w-12
                            h-12
                            rounded-xl
                            bg-cyan-500/15
                            text-cyan-400
                            flex
                            items-center
                            justify-center
                        ">

                            <MapPinned size={22} />

                        </div>

                        <div>

                            <p className="text-sm text-zinc-500">

                                Route

                            </p>

                            <h4 className="font-semibold">

                                {trip.source} → {trip.destination}

                            </h4>

                        </div>

                    </div>

                    <div className="
                        rounded-2xl
                        bg-zinc-800
                        p-5
                        flex
                        items-center
                        gap-4
                    ">

                        <div className="
                            w-12
                            h-12
                            rounded-xl
                            bg-green-500/15
                            text-green-400
                            flex
                            items-center
                            justify-center
                        ">

                            <Clock size={22} />

                        </div>

                        <div>

                            <p className="text-sm text-zinc-500">

                                Duration

                            </p>

                            <h4 className="font-semibold">

                                {duration} Days

                            </h4>

                        </div>

                    </div>

                </div>

            </div>

        </section>

    );

};

export default TripDescription;