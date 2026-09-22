import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import GlassCard from "../../components/ui/GlassCard";

import TripTypeSelector from "./TripTypeSelector";
import TripImageUpload from "./TripImageUpload";

import {
    createTrip,
    uploadTripCover
} from "../../api/tripApi";

const TripForm = () => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [tripType, setTripType] = useState("Adventure");

    const [image, setImage] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const onSubmit = async (values) => {

        try {

            setLoading(true);

            const payload = {
                ...values,
                tripType
            };

            const { data } = await createTrip(payload);

            if (image) {

                const formData = new FormData();

                formData.append("cover", image);

                await uploadTripCover(
                    data.trip._id,
                    formData
                );

            }

            toast.success("Trip Created Successfully 🚀");

            navigate("/dashboard");

        } catch (error) {

            const validationError =
                error.response?.data?.errors?.[0]?.msg;

            toast.error(
                validationError ||
                error.response?.data?.message ||
                "Failed to create trip"
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <GlassCard className="p-10">

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-8"
            >

                {/* Trip Title */}

                <Input
                    label="Trip Title"
                    placeholder="Manali Backpacking"
                    error={errors.title?.message}
                    {...register("title", {
                        required: "Trip title is required"
                    })}
                />

                {/* Source & Destination */}

                <div className="grid md:grid-cols-2 gap-6">

                    <Input
                        label="From"
                        placeholder="Delhi"
                        error={errors.source?.message}
                        {...register("source", {
                            required: "Source is required"
                        })}
                    />

                    <Input
                        label="Destination"
                        placeholder="Manali"
                        error={errors.destination?.message}
                        {...register("destination", {
                            required: "Destination is required"
                        })}
                    />

                </div>

                {/* Description */}

                <div>

                    <label className="block text-sm mb-2">
                        Description
                    </label>

                    <textarea
                        rows={5}
                        className="w-full rounded-2xl bg-zinc-900 border border-zinc-800 p-4"
                        placeholder="Tell travel partners about your trip..."
                        {...register("description", {
                            required: "Description is required",
                            minLength: {
                                value: 20,
                                message:
                                    "Description must be at least 20 characters"
                            }
                        })}
                    />

                    {errors.description?.message && (

                        <p className="text-red-400 text-sm mt-2">

                            {errors.description.message}

                        </p>

                    )}

                </div>

                {/* Dates */}

                <div className="grid md:grid-cols-2 gap-6">

                    <Input
                        type="date"
                        label="Start Date"
                        error={errors.startDate?.message}
                        {...register("startDate", {
                            required: "Start date is required"
                        })}
                    />

                    <Input
                        type="date"
                        label="End Date"
                        error={errors.endDate?.message}
                        {...register("endDate", {
                            required: "End date is required"
                        })}
                    />

                </div>

                {/* Budget */}

                <div className="grid md:grid-cols-2 gap-6">

                    <Input
                        type="number"
                        label="Budget"
                        error={errors.budget?.message}
                        {...register("budget", {
                            required: "Budget is required",
                            min: {
                                value: 1,
                                message: "Budget must be at least 1"
                            }
                        })}
                    />

                    <Input
                        type="number"
                        label="Max Members"
                        error={errors.maxMembers?.message}
                        {...register("maxMembers", {
                            required: "Maximum members is required",
                            min: {
                                value: 2,
                                message:
                                    "Maximum members must be at least 2"
                            }
                        })}
                    />

                </div>

                <TripTypeSelector
                    value={tripType}
                    onChange={setTripType}
                />

                <TripImageUpload
                    image={image}
                    setImage={setImage}
                />

                <div className="flex justify-end gap-4">

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/dashboard")}
                    >
                        Cancel
                    </Button>

                    <Button
                        loading={loading}
                        type="submit"
                    >
                        Create Trip
                    </Button>

                </div>

            </form>

        </GlassCard>

    );

};

export default TripForm;