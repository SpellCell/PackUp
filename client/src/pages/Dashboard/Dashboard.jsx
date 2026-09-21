import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
    Plane,
    Users,
    CalendarDays,
    Wallet,
    Compass,
    MapPin,
    Sparkles,
    Navigation,
    Mountain
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

            setCreatedTrips(data.createdTrips || []);
            setJoinedTrips(data.joinedTrips || []);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const stats = useMemo(() => {
        const upcomingTrips = createdTrips.filter(
            (trip) => new Date(trip.startDate) > new Date()
        ).length;

        const totalBudget = createdTrips.reduce(
            (sum, trip) => sum + Number(trip.budget || 0),
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
                <div className="flex min-h-[65vh] items-center justify-center">
                    <motion.div
                        animate={{
                            opacity: [0.35, 1, 0.35]
                        }}
                        transition={{
                            duration: 1.4,
                            repeat: Infinity
                        }}
                        className="flex items-center gap-3 text-sm text-zinc-500"
                    >
                        <Plane
                            size={18}
                            className="text-indigo-400"
                        />

                        Preparing your journey...
                    </motion.div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="relative mx-auto w-full max-w-[1500px] overflow-hidden pb-12">

                {/* Background travel doodles */}

                <div className="pointer-events-none absolute inset-0 overflow-hidden">

                    <motion.div
                        animate={{
                            x: [0, 18, 0],
                            y: [0, -12, 0],
                            rotate: [-5, 2, -5]
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute right-[4%] top-[7%] text-indigo-300/[0.055]"
                    >
                        <Plane
                            size={100}
                            strokeWidth={1}
                        />
                    </motion.div>

                    <motion.div
                        animate={{
                            y: [0, -10, 0]
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute left-[2%] top-[36%] text-indigo-300/[0.035]"
                    >
                        <Mountain
                            size={120}
                            strokeWidth={1}
                        />
                    </motion.div>

                    <motion.div
                        animate={{
                            rotate: [0, 360]
                        }}
                        transition={{
                            duration: 45,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute right-[1%] top-[54%] text-cyan-300/[0.035]"
                    >
                        <Compass
                            size={105}
                            strokeWidth={1}
                        />
                    </motion.div>

                    <motion.div
                        animate={{
                            x: [0, 12, 0],
                            y: [0, 8, 0]
                        }}
                        transition={{
                            duration: 9,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute left-[7%] bottom-[12%] text-indigo-300/[0.035]"
                    >
                        <Navigation
                            size={70}
                            strokeWidth={1}
                        />
                    </motion.div>

                    <Sparkles
                        size={18}
                        className="absolute left-[25%] top-[18%] text-indigo-300/[0.08]"
                    />

                    <MapPin
                        size={18}
                        className="absolute right-[25%] top-[39%] text-cyan-300/[0.07]"
                    />

                </div>

                <div className="relative z-10 space-y-9">

                    <DashboardHeader user={user} />

                    {/* Journey */}

                    <section>

                        <div className="mb-4 flex items-end justify-between">

                            <div>
                                <div className="mb-1.5 flex items-center gap-2">
                                    <span className="h-px w-5 bg-indigo-500" />

                                    <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-indigo-400">
                                        Your Journey
                                    </span>
                                </div>

                                <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                                    Your travel at a glance
                                </h2>

                                <p className="mt-1 text-xs text-zinc-600 sm:text-sm">
                                    Everything happening across your trips.
                                </p>
                            </div>

                            <div className="hidden items-center gap-2 text-[10px] text-zinc-700 sm:flex">
                                <MapPin size={13} />
                                PackUP activity
                            </div>

                        </div>

                        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:gap-4">

                            <StatCard
                                title="Trips Created"
                                value={stats.created}
                                icon={<Plane size={22} />}
                                color="indigo"
                                index={0}
                            />

                            <StatCard
                                title="Trips Joined"
                                value={stats.joined}
                                icon={<Users size={22} />}
                                color="cyan"
                                index={1}
                            />

                            <StatCard
                                title="Upcoming Trips"
                                value={stats.upcoming}
                                icon={<CalendarDays size={22} />}
                                color="green"
                                index={2}
                            />

                            <StatCard
                                title="Budget Planned"
                                value={`₹${stats.budget}`}
                                icon={<Wallet size={22} />}
                                color="yellow"
                                index={3}
                            />

                        </div>

                    </section>

                    <QuickActions />

                    <RecentTrips trips={createdTrips} />

                </div>

            </div>
        </AppLayout>
    );
};

export default Dashboard;