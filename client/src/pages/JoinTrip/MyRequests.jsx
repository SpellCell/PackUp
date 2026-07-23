import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";

import GlassCard from "../../components/ui/GlassCard";

import { getMyJoinRequests } from "../../api/joinRequestApi";

const statusColor = {
    Pending: "bg-yellow-500/20 text-yellow-400",
    Accepted: "bg-green-500/20 text-green-400",
    Rejected: "bg-red-500/20 text-red-400"
};

const MyRequests = () => {

    const [requests, setRequests] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchRequests();

    }, []);

    const fetchRequests = async () => {

        try {

            const { data } = await getMyJoinRequests();

            setRequests(data.requests || []);

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

            <GlassCard className="p-8">

                <p className="text-zinc-400">

                    Loading requests...

                </p>

            </GlassCard>

        );

    }

    return (

        <GlassCard className="p-8">

            <div className="flex items-center gap-3 mb-8">

                <Clock3 className="text-indigo-400" />

                <h2 className="text-2xl font-bold">

                    My Join Requests

                </h2>

            </div>

            {

                requests.length === 0 ?

                (

                    <div className="text-center py-12 text-zinc-500">

                        You haven't sent any join requests yet.

                    </div>

                )

                :

                (

                    <div className="space-y-5">

                        {

                            requests.map(request => (

                                <div

                                    key={request._id}

                                    className="
                                        flex
                                        justify-between
                                        items-center
                                        rounded-2xl
                                        border
                                        border-zinc-800
                                        bg-zinc-900
                                        p-5
                                    "

                                >

                                    <div>

                                        <h3 className="font-semibold text-lg">

                                            {request.trip?.title}

                                        </h3>

                                        <p className="text-zinc-500 mt-1">

                                            {request.trip?.source} →

                                            {" "}

                                            {request.trip?.destination}

                                        </p>

                                        <p className="text-xs text-zinc-600 mt-2">

                                            Code:

                                            {" "}

                                            {request.trip?.tripCode}

                                        </p>

                                    </div>

                                    <span

                                        className={`
                                            px-4
                                            py-2
                                            rounded-full
                                            text-sm
                                            font-semibold

                                            ${

                                                statusColor[request.status]

                                            }

                                        `}

                                    >

                                        {request.status}

                                    </span>

                                </div>

                            ))

                        }

                    </div>

                )

            }

        </GlassCard>

    );

};

export default MyRequests;