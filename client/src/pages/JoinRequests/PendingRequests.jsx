import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import GlassCard from "../../components/ui/GlassCard";
import Button from "../../components/ui/Button";

import {
    getPendingRequests,
    acceptRequest,
    rejectRequest
} from "../../api/joinRequestApi";

const PendingRequests = () => {

    const [requests, setRequests] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchRequests();

    }, []);

    const fetchRequests = async () => {

        try {

            const { data } = await getPendingRequests();

            setRequests(data.requests || []);

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };

    const handleAccept = async (id) => {

        try {

            const { data } = await acceptRequest(id);

            toast.success(data.message);

            fetchRequests();

        }

        catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Unable to accept request."

            );

        }

    };

    const handleReject = async (id) => {

        try {

            const { data } = await rejectRequest(id);

            toast.success(data.message);

            fetchRequests();

        }

        catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Unable to reject request."

            );

        }

    };

    if (loading) {

        return (

            <GlassCard className="p-8">

                Loading Requests...

            </GlassCard>

        );

    }

    return (

        <GlassCard className="p-8">

            <h2 className="text-3xl font-bold mb-8">

                Pending Join Requests

            </h2>

            {

                requests.length === 0 ?

                (

                    <div className="text-center py-12 text-zinc-500">

                        No pending requests.

                    </div>

                )

                :

                (

                    <div className="space-y-6">

                        {

                            requests.map(request => (

                                <div

                                    key={request._id}

                                    className="
                                        rounded-2xl
                                        border
                                        border-zinc-800
                                        bg-zinc-900
                                        p-6
                                    "

                                >

                                    <div className="flex justify-between items-start">

                                        <div>

                                            <h3 className="text-xl font-bold">

                                                {request.requester?.name}

                                            </h3>

                                            <p className="text-zinc-500">

                                                @{request.requester?.username}

                                            </p>

                                            <p className="mt-4">

                                                wants to join

                                            </p>

                                            <h4 className="font-semibold mt-2">

                                                {request.trip?.title}

                                            </h4>

                                            <p className="text-sm text-zinc-500">

                                                Code: {request.trip?.tripCode}

                                            </p>

                                        </div>

                                        <div className="flex gap-3">

                                            <Button

                                                onClick={() =>

                                                    handleAccept(request._id)

                                                }

                                            >

                                                Accept

                                            </Button>

                                            <Button

                                                variant="danger"

                                                onClick={() =>

                                                    handleReject(request._id)

                                                }

                                            >

                                                Reject

                                            </Button>

                                        </div>

                                    </div>

                                </div>

                            ))

                        }

                    </div>

                )

            }

        </GlassCard>

    );

};

export default PendingRequests;