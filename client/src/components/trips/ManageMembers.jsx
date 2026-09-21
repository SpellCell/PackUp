import { useState } from "react";
import toast from "react-hot-toast";
import {
    UserPlus,
    UserMinus,
    Copy,
    Share2,
    Loader2
} from "lucide-react";

import { removeParticipant } from "../../api/tripApi";

const ManageMembers = ({ trip, refreshTrip }) => {

    const [removingUserId, setRemovingUserId] = useState(null);

    const tripCode = trip?.tripCode;

    const inviteLink =
        `${window.location.origin}/join-trip?code=${tripCode}`;

    const handleCopyCode = async () => {

        if (!tripCode) {
            toast.error("Trip Code is not available.");
            return;
        }

        try {

            await navigator.clipboard.writeText(tripCode);

            toast.success("Trip Code copied.");

        } catch (error) {

            console.log(error);

            toast.error("Unable to copy Trip Code.");

        }

    };

    const handleShareLink = async () => {

        if (!tripCode) {
            toast.error("Trip Code is not available.");
            return;
        }

        try {

            if (navigator.share) {

                await navigator.share({
                    title: `Join ${trip.title}`,
                    text: `Join my trip "${trip.title}" on PackUP.`,
                    url: inviteLink
                });

            } else {

                await navigator.clipboard.writeText(inviteLink);

                toast.success(
                    "Invite link copied to clipboard."
                );

            }

        } catch (error) {

            if (error?.name === "AbortError") {
                return;
            }

            console.log(error);

            toast.error("Unable to share invite link.");

        }

    };

    const handleRemove = async (participant) => {

        const participantName =
            participant?.name ||
            participant?.username ||
            "this member";

        const confirmed = window.confirm(
            `Remove ${participantName} from this trip?`
        );

        if (!confirmed) {
            return;
        }

        try {

            setRemovingUserId(participant._id);

            const { data } = await removeParticipant(
                trip._id,
                participant._id
            );

            toast.success(
                data.message ||
                "Member removed successfully."
            );

            await refreshTrip();

        } catch (error) {

            console.log(error);

            toast.error(
                error.response?.data?.message ||
                "Unable to remove member."
            );

        } finally {

            setRemovingUserId(null);

        }

    };

    return (

        <section className="space-y-8">

            <div>

                <div className="flex items-center gap-3 mb-6">

                    <UserPlus
                        size={24}
                        className="text-indigo-400"
                    />

                    <h2 className="text-2xl font-bold">
                        Manage Members
                    </h2>

                </div>

                <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 overflow-hidden">

                    <div className="p-6 border-b border-zinc-800">

                        <div className="flex items-center justify-between">

                            <div>

                                <h3 className="text-lg font-semibold">
                                    Trip Members
                                </h3>

                                <p className="text-sm text-zinc-500 mt-1">
                                    {trip.currentMembers} / {trip.maxMembers} members
                                </p>

                            </div>

                        </div>

                    </div>

                    <div className="divide-y divide-zinc-800">

                        {
                            trip.participants?.map(
                                participant => {

                                    const isOrganizer =
                                        participant._id ===
                                        trip.createdBy?._id;

                                    return (

                                        <div
                                            key={participant._id}
                                            className="
                                                flex
                                                items-center
                                                justify-between
                                                gap-4
                                                p-6
                                            "
                                        >

                                            <div className="flex items-center gap-4">

                                                <img
                                                    src={
                                                        participant.profileImage ||
                                                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                            participant.name || "User"
                                                        )}&background=6366f1&color=fff`
                                                    }
                                                    alt={
                                                        participant.name ||
                                                        "User"
                                                    }
                                                    className="
                                                        w-12
                                                        h-12
                                                        rounded-full
                                                        object-cover
                                                        border
                                                        border-zinc-700
                                                    "
                                                />

                                                <div>

                                                    <h4 className="font-semibold">

                                                        {
                                                            participant.name ||
                                                            "Unknown User"
                                                        }

                                                    </h4>

                                                    <p className="text-sm text-zinc-500">

                                                        {
                                                            participant.username
                                                                ? `@${participant.username}`
                                                                : participant.email || ""
                                                        }

                                                    </p>

                                                </div>

                                            </div>

                                            {
                                                isOrganizer ?

                                                (

                                                    <span
                                                        className="
                                                            px-4
                                                            py-2
                                                            rounded-full
                                                            text-sm
                                                            font-medium
                                                            bg-indigo-500/10
                                                            text-indigo-400
                                                            border
                                                            border-indigo-500/20
                                                        "
                                                    >
                                                        Organizer
                                                    </span>

                                                )

                                                :

                                                (

                                                    <button
                                                        disabled={
                                                            removingUserId ===
                                                            participant._id
                                                        }
                                                        onClick={() =>
                                                            handleRemove(
                                                                participant
                                                            )
                                                        }
                                                        className="
                                                            flex
                                                            items-center
                                                            gap-2
                                                            rounded-xl
                                                            bg-red-500/10
                                                            border
                                                            border-red-500/20
                                                            px-4
                                                            py-2
                                                            text-red-400
                                                            hover:bg-red-500/20
                                                            transition
                                                            disabled:opacity-50
                                                        "
                                                    >

                                                        {
                                                            removingUserId ===
                                                            participant._id ?

                                                            (
                                                                <Loader2
                                                                    size={16}
                                                                    className="animate-spin"
                                                                />
                                                            )

                                                            :

                                                            (
                                                                <UserMinus
                                                                    size={16}
                                                                />
                                                            )
                                                        }

                                                        Remove

                                                    </button>

                                                )

                                            }

                                        </div>

                                    );

                                }
                            )
                        }

                    </div>

                </div>

            </div>


            <div>

                <div className="flex items-center gap-3 mb-6">

                    <Share2
                        size={24}
                        className="text-cyan-400"
                    />

                    <h2 className="text-2xl font-bold">
                        Invite People
                    </h2>

                </div>

                <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6">

                    <p className="text-zinc-400 mb-5">
                        Share the Trip Code or invite link.
                        New users will still need organizer approval
                        before becoming participants.
                    </p>

                    <div className="flex flex-col md:flex-row gap-4">

                        <div className="flex-1 rounded-2xl bg-zinc-950 border border-zinc-800 px-5 py-4">

                            <p className="text-xs text-zinc-500 mb-1">
                                Trip Code
                            </p>

                            <p className="font-bold tracking-widest text-lg">
                                {tripCode || "Unavailable"}
                            </p>

                        </div>

                        <button
                            onClick={handleCopyCode}
                            className="
                                flex
                                items-center
                                justify-center
                                gap-2
                                rounded-2xl
                                bg-indigo-600
                                hover:bg-indigo-500
                                px-6
                                py-4
                                font-semibold
                                transition
                            "
                        >

                            <Copy size={18} />

                            Copy Code

                        </button>

                        <button
                            onClick={handleShareLink}
                            className="
                                flex
                                items-center
                                justify-center
                                gap-2
                                rounded-2xl
                                bg-cyan-600
                                hover:bg-cyan-500
                                px-6
                                py-4
                                font-semibold
                                transition
                            "
                        >

                            <Share2 size={18} />

                            Share Link

                        </button>

                    </div>

                </div>

            </div>

        </section>

    );

};

export default ManageMembers;