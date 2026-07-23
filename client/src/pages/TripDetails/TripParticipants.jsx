import { Users, Crown } from "lucide-react";

const TripParticipants = ({ trip }) => {

    return (

        <section>

            <div className="flex items-center gap-3 mb-6">

                <div className="
                    w-12
                    h-12
                    rounded-2xl
                    bg-cyan-500/15
                    text-cyan-400
                    flex
                    items-center
                    justify-center
                ">

                    <Users size={22} />

                </div>

                <div>

                    <h2 className="text-2xl font-bold">

                        Participants

                    </h2>

                    <p className="text-zinc-500">

                        {trip.participants.length} Traveler{trip.participants.length !== 1 && "s"}

                    </p>

                </div>

            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                {

                    trip.participants.map((participant) => {

                        const isOrganizer =
                            participant._id === trip.createdBy._id;

                        return (

                            <div

                                key={participant._id}

                                className="
                                    rounded-3xl
                                    border
                                    border-zinc-800
                                    bg-zinc-900
                                    p-5
                                    hover:border-indigo-500/40
                                    transition
                                "

                            >

                                <div className="flex items-center gap-4">

                                    <img

                                        src={
                                            participant.profileImage ||

                                            `https://ui-avatars.com/api/?name=${participant.name}&background=6366f1&color=fff`
                                        }

                                        alt={participant.name}

                                        className="
                                            w-14
                                            h-14
                                            rounded-full
                                            object-cover
                                            border-2
                                            border-indigo-500
                                        "

                                    />

                                    <div className="flex-1">

                                        <h3 className="font-bold text-lg">

                                            {participant.name}

                                        </h3>

                                        <p className="text-zinc-500 text-sm">

                                            @{participant.username}

                                        </p>

                                    </div>

                                    {

                                        isOrganizer && (

                                            <div className="
                                                flex
                                                items-center
                                                gap-2
                                                rounded-full
                                                bg-yellow-500/15
                                                text-yellow-400
                                                px-3
                                                py-1
                                                text-xs
                                                font-semibold
                                            ">

                                                <Crown size={14} />

                                                Organizer

                                            </div>

                                        )

                                    }

                                </div>

                            </div>

                        );

                    })

                }

            </div>

        </section>

    );

};

export default TripParticipants;