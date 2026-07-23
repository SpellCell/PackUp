import { useEffect, useState } from "react";

import AppLayout from "../../components/layout/AppLayout";

import { getMyTrips } from "../../api/tripApi";

import CreatedTrips from "./CreatedTrips";
import JoinedTrips from "./JoinedTrips";
import EmptyState from "./EmptyState";

const MyTrips = () => {

    const [loading, setLoading] = useState(true);

    const [createdTrips, setCreatedTrips] = useState([]);

    const [joinedTrips, setJoinedTrips] = useState([]);

    useEffect(() => {

        fetchTrips();

    }, []);

    const fetchTrips = async () => {

        try {

            const { data } = await getMyTrips();

            setCreatedTrips(data.createdTrips || []);

            setJoinedTrips(data.joinedTrips || []);

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

            <AppLayout>

                <div className="flex justify-center py-40">

                    <p className="text-zinc-400 text-xl">

                        Loading your trips...

                    </p>

                </div>

            </AppLayout>

        );

    }

    return (

        <AppLayout>

            <div className="space-y-12">

                <div>

                    <h1 className="text-5xl font-black">

                        My Trips

                    </h1>

                    <p className="text-zinc-400 mt-3 text-lg">

                        Manage the trips you've created and the adventures you've joined.

                    </p>

                </div>

                {

                    createdTrips.length === 0 && joinedTrips.length === 0 ?

                    (

                        <EmptyState />

                    )

                    :

                    (

                        <>

                            <CreatedTrips

                                trips={createdTrips}

                            />

                            <JoinedTrips

                                trips={joinedTrips}

                            />

                        </>

                    )

                }

            </div>

        </AppLayout>

    );

};

export default MyTrips;