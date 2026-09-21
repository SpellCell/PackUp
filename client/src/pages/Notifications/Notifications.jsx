import { useEffect, useState } from "react";
import {
    Bell,
    UserMinus,
    UserPlus,
    Check,
    X,
    MessageCircle,
    Plane
} from "lucide-react";

import AppLayout from "../../components/layout/AppLayout";

import { getNotifications } from "../../api/notificationApi";

const Notifications = () => {

    const [notifications, setNotifications] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        fetchNotifications();

    }, []);

    const fetchNotifications = async () => {

        try {

            const { data } =
                await getNotifications();

            setNotifications(
                data.notifications || []
            );

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };

    const getIcon = (type) => {

        switch (type) {

            case "MEMBER_REMOVED":
                return (
                    <UserMinus
                        size={20}
                        className="text-red-400"
                    />
                );

            case "JOIN_REQUEST":
                return (
                    <UserPlus
                        size={20}
                        className="text-cyan-400"
                    />
                );

            case "REQUEST_ACCEPTED":
                return (
                    <Check
                        size={20}
                        className="text-green-400"
                    />
                );

            case "REQUEST_REJECTED":
                return (
                    <X
                        size={20}
                        className="text-red-400"
                    />
                );

            case "NEW_MESSAGE":
                return (
                    <MessageCircle
                        size={20}
                        className="text-indigo-400"
                    />
                );

            default:
                return (
                    <Plane
                        size={20}
                        className="text-indigo-400"
                    />
                );

        }

    };

    if (loading) {

        return (

            <AppLayout>

                <div className="max-w-5xl mx-auto">

                    <div className="flex justify-center py-40">

                        <p className="text-zinc-400">
                            Loading Notifications...
                        </p>

                    </div>

                </div>

            </AppLayout>

        );

    }

    return (

        <AppLayout>

            <div className="max-w-5xl mx-auto">

                <div className="flex items-center gap-4 mb-10">

                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">

                        <Bell
                            size={26}
                            className="text-indigo-400"
                        />

                    </div>

                    <div>

                        <h1 className="text-4xl font-bold">
                            Notifications
                        </h1>

                        <p className="text-zinc-500 mt-2">
                            Stay updated about your trips.
                        </p>

                    </div>

                </div>

                {
                    notifications.length === 0 ?

                    (

                        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-16 text-center">

                            <Bell
                                size={40}
                                className="mx-auto text-zinc-600 mb-4"
                            />

                            <h2 className="text-xl font-semibold">
                                No notifications
                            </h2>

                            <p className="text-zinc-500 mt-2">
                                You're all caught up.
                            </p>

                        </div>

                    )

                    :

                    (

                        <div className="space-y-4">

                            {
                                notifications.map(
                                    notification => (

                                        <div
                                            key={
                                                notification._id
                                            }
                                            className={`
                                                rounded-3xl
                                                border
                                                p-6
                                                transition
                                                ${
                                                    notification.isRead
                                                    ? "border-zinc-800 bg-zinc-900/50"
                                                    : "border-indigo-500/20 bg-indigo-500/5"
                                                }
                                            `}
                                        >

                                            <div className="flex gap-4">

                                                <div className="w-11 h-11 shrink-0 rounded-2xl bg-zinc-800 flex items-center justify-center">

                                                    {
                                                        getIcon(
                                                            notification.type
                                                        )
                                                    }

                                                </div>

                                                <div className="flex-1 min-w-0">

                                                    <div className="flex items-start justify-between gap-4">

                                                        <h3 className="font-semibold">

                                                            {
                                                                notification.title
                                                            }

                                                        </h3>

                                                        <span className="text-xs text-zinc-600 whitespace-nowrap">

                                                            {
                                                                new Date(
                                                                    notification.createdAt
                                                                ).toLocaleString()
                                                            }

                                                        </span>

                                                    </div>

                                                    <p className="text-zinc-400 mt-2">

                                                        {
                                                            notification.message
                                                        }

                                                    </p>

                                                    {
                                                        notification.trip?.title && (

                                                            <p className="text-sm text-indigo-400 mt-3">

                                                                Trip:{" "}
                                                                {
                                                                    notification.trip.title
                                                                }

                                                            </p>

                                                        )
                                                    }

                                                </div>

                                            </div>

                                        </div>

                                    )
                                )
                            }

                        </div>

                    )
                }

            </div>

        </AppLayout>

    );

};

export default Notifications;