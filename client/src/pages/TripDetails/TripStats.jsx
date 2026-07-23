import {
    CalendarDays,
    Users,
    Wallet,
    Flag
} from "lucide-react";

const StatCard = ({
    icon,
    title,
    value,
    color
}) => (

    <div className="
        rounded-3xl
        border
        border-zinc-800
        bg-zinc-900
        p-6
        hover:border-indigo-500/40
        transition
    ">

        <div
            className={`
                w-14
                h-14
                rounded-2xl
                flex
                items-center
                justify-center
                ${color}
            `}
        >

            {icon}

        </div>

        <p className="mt-5 text-sm text-zinc-500">

            {title}

        </p>

        <h3 className="mt-2 text-xl font-bold">

            {value}

        </h3>

    </div>

);

const TripStats = ({ trip }) => {

    const startDate = new Date(
        trip.startDate
    ).toLocaleDateString();

    const endDate = new Date(
        trip.endDate
    ).toLocaleDateString();

    return (

        <section>

            <h2 className="text-2xl font-bold mb-6">

                Trip Overview

            </h2>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                <StatCard

                    title="Trip Dates"

                    value={`${startDate} - ${endDate}`}

                    color="bg-indigo-500/15 text-indigo-400"

                    icon={<CalendarDays size={26} />}

                />

                <StatCard

                    title="Members"

                    value={`${trip.currentMembers}/${trip.maxMembers}`}

                    color="bg-cyan-500/15 text-cyan-400"

                    icon={<Users size={26} />}

                />

                <StatCard

                    title="Budget"

                    value={`₹${trip.budget.toLocaleString()}`}

                    color="bg-green-500/15 text-green-400"

                    icon={<Wallet size={26} />}

                />

                <StatCard

                    title="Status"

                    value={trip.status}

                    color="bg-yellow-500/15 text-yellow-400"

                    icon={<Flag size={26} />}

                />

            </div>

        </section>

    );

};

export default TripStats;