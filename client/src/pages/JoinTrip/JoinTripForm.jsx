import { useState } from "react";
import toast from "react-hot-toast";

import GlassCard from "../../components/ui/GlassCard";
import Button from "../../components/ui/Button";

import { sendJoinRequest } from "../../api/joinRequestApi";

const JoinTripForm = () => {

    const [tripCode, setTripCode] = useState("");

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!tripCode.trim()) {

            toast.error("Please enter a Trip Code.");

            return;

        }

        try {

            setLoading(true);

            const { data } = await sendJoinRequest(

                tripCode.trim()

            );

            toast.success(data.message);

            setTripCode("");

        }

        catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Failed to send request."

            );

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <GlassCard className="p-8">

            <form

                onSubmit={handleSubmit}

                className="space-y-6"

            >

                <div>

                    <label className="block mb-2 text-sm">

                        Trip Code

                    </label>

                    <input

                        type="text"

                        value={tripCode}

                        onChange={(e) =>

                            setTripCode(

                                e.target.value.toUpperCase()

                            )

                        }

                        placeholder="PKU-ABC123"

                        className="
                            w-full
                            rounded-2xl
                            bg-zinc-900
                            border
                            border-zinc-800
                            px-5
                            py-4
                            outline-none
                            focus:border-indigo-500
                            uppercase
                            tracking-widest
                        "

                    />

                </div>

                <Button

                    loading={loading}

                    type="submit"

                    className="w-full"

                >

                    Send Join Request

                </Button>

            </form>

        </GlassCard>

    );

};

export default JoinTripForm;