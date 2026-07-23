import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
    Plane,
    Users,
    CalendarDays,
    Wallet
} from "lucide-react";

import AppLayout from "../../components/layout/AppLayout";
import { useAuth } from "../../context/AuthContext";

import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatCard from "../../components/dashboard/StatCard";
import QuickActions from "../../components/dashboard/QuickActions";
import RecentTrips from "../../components/dashboard/RecentTrips";

import { getMyTrips } from "../../api/tripApi";

const Dashboard = () => {

    const { user } = useAuth();

    const [createdTrips, setCreatedTrips] = useState([]);
    const [joinedTrips, setJoinedTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchTrips();

    }, []);

    const fetchTrips = async () => {

        try {

            const { data } = await getMyTrips();

            setCreatedTrips(data.createdTrips);
            setJoinedTrips(data.joinedTrips);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    const stats = useMemo(() => {

        const upcomingTrips = createdTrips.filter(

            trip => new Date(trip.startDate) > new Date()

        ).length;

        const totalBudget = createdTrips.reduce(

            (sum, trip) => sum + trip.budget,

            0

        );

        return {

            created: createdTrips.length,
            joined: joinedTrips.length,
            upcoming: upcomingTrips,
            budget: totalBudget

        };

    }, [createdTrips, joinedTrips]);

    if (loading) {

        return (

            <AppLayout>

                <div className="flex items-center justify-center min-h-[60vh]">

                    <motion.div

                        animate={{
                            opacity: [0.4, 1, 0.4]
                        }}

                        transition={{
                            repeat: Infinity,
                            duration: 1.2
                        }}

                        className="text-lg text-zinc-400"

                    >

                        Loading your dashboard...

                    </motion.div>

                </div>

            </AppLayout>

        );

    }

    return (

        <AppLayout>

            <motion.div

                initial={{
                    opacity: 0,
                    y: 25
                }}

                animate={{
                    opacity: 1,
                    y: 0
                }}

                transition={{
                    duration: 0.45
                }}

                className="
                    w-full
                    space-y-12
                    pb-10
                "

            >

                {/* Hero */}

                <DashboardHeader user={user} />

                {/* Stats */}

                <section>

                    <div className="mb-5">

                        <h2 className="text-xl font-bold">

                            Your Journey

                        </h2>

                        <p className="mt-1 text-zinc-500">

                            A quick overview of your travel activity.

                        </p>

                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-6">

                        <StatCard
                            title="Trips Created"
                            value={stats.created}
                            icon={<Plane size={28} />}
                            color="text-indigo-400"
                        />

                        <StatCard
                            title="Trips Joined"
                            value={stats.joined}
                            icon={<Users size={28} />}
                            color="text-cyan-400"
                        />

                        <StatCard
                            title="Upcoming Trips"
                            value={stats.upcoming}
                            icon={<CalendarDays size={28} />}
                            color="text-green-400"
                        />

                        <StatCard
                            title="Budget Planned"
                            value={`₹${stats.budget}`}
                            icon={<Wallet size={28} />}
                            color="text-yellow-400"
                        />

                    </div>

                </section>

                {/* Quick Actions */}

                <QuickActions />

                {/* Recent Trips */}

                <RecentTrips trips={createdTrips} />

            </motion.div>

        </AppLayout>

    );

};

export default Dashboard;