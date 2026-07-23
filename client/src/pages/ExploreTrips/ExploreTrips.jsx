import { useEffect, useState } from "react";

import AppLayout from "../../components/layout/AppLayout";
import TripCard from "../../components/trips/TripCard";

import ExploreHeader from "./ExploreHeader";
import ExploreFilters from "./ExploreFilters";
import ExploreGrid from "./ExploreGrid";
import ExploreSkeleton from "./ExploreSkeleton";

import { getAllTrips } from "../../api/tripApi";

const ExploreTrips = () => {

    const [trips, setTrips] = useState([]);

    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);

    const [totalPages, setTotalPages] = useState(1);

    const [filters, setFilters] = useState({

        destination: "",
        source: "",
        tripType: "",
        minBudget: "",
        maxBudget: ""

    });

    useEffect(() => {

        fetchTrips();

    }, [currentPage]);

    const fetchTrips = async (customFilters = filters) => {

        try {

            setLoading(true);

            const { data } = await getAllTrips({

                ...customFilters,

                page: currentPage,

                limit: 9

            });

            setTrips(data.trips || []);

            setCurrentPage(data.currentPage);

            setTotalPages(data.totalPages);

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <AppLayout>

            <div className="space-y-10">

                <ExploreHeader />

                <ExploreFilters

                    filters={filters}

                    setFilters={setFilters}

                    onSearch={fetchTrips}

                />

                {

                    loading ?

                        (

                            <ExploreSkeleton />

                        )

                        :

                        (

                            <>

                                <ExploreGrid>

                                    {

                                        trips.length ?

                                            (

                                                trips.map(trip => (

                                                    <TripCard

                                                        key={trip._id}

                                                        trip={trip}

                                                    />

                                                ))

                                            )

                                            :

                                            (

                                                <div className="col-span-full py-24 text-center">

                                                    <h2 className="text-3xl font-bold">

                                                        No Trips Found

                                                    </h2>

                                                    <p className="mt-3 text-zinc-500">

                                                        Try changing your search filters.

                                                    </p>

                                                </div>

                                            )

                                    }

                                </ExploreGrid>

                                {/* Pagination Placeholder */}

                                {

                                    totalPages > 1 && (

                                        <div className="flex justify-center pt-4">

                                            <p className="text-zinc-500">

                                                Page {currentPage} of {totalPages}

                                            </p>

                                        </div>

                                    )

                                }

                            </>

                        )

                }

            </div>

        </AppLayout>

    );

};

export default ExploreTrips;