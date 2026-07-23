import { MapPin, Users } from "lucide-react";

const ChatHeader = ({ trip, onlineUsers = [] }) => {

    const creatorId = trip.createdBy?._id;

    const isOnline = creatorId
        ? onlineUsers.includes(creatorId)
        : false;

    return (

        <div className="h-20 border-b border-zinc-800 px-6 flex items-center justify-between">

            <div className="flex items-center gap-4">

                {

                    trip.coverImage ?

                        <img
                            src={trip.coverImage}
                            alt={trip.title}
                            className="w-14 h-14 rounded-2xl object-cover"
                        />

                        :

                        <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center">

                            ✈️

                        </div>

                }

                <div>

                    <h2 className="text-xl font-bold">

                        {trip.title}

                    </h2>

                    <div className="flex items-center gap-2 text-sm text-zinc-500 mt-1">

                        <MapPin size={15} />

                        {trip.source} → {trip.destination}

                    </div>

                    <div className="flex items-center gap-2 mt-1">

                        <span

                            className={`

                                w-2.5

                                h-2.5

                                rounded-full

                                ${

                                    isOnline

                                        ? "bg-green-500"

                                        : "bg-zinc-600"

                                }

                            `}

                        />

                        <span className="text-xs text-zinc-500">

                            {

                                isOnline

                                    ? "Organizer Online"

                                    : "Organizer Offline"

                            }

                        </span>

                    </div>

                </div>

            </div>

            <div className="flex items-center gap-2 text-zinc-400">

                <Users size={18} />

                {trip.currentMembers}/{trip.maxMembers}

            </div>

        </div>

    );

};

export default ChatHeader;