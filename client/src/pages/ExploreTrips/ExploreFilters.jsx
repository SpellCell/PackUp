import { Search } from "lucide-react";

const tripTypes = [
    "",
    "Adventure",
    "Road Trip",
    "Backpacking",
    "Camping",
    "Trekking",
    "Beach",
    "Family",
    "Business",
    "Solo",
    "Other"
];

const ExploreFilters = ({
    filters,
    setFilters,
    onSearch
}) => {

    const handleChange = (e) => {

        setFilters(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));

    };

    return (

        <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">

            <div className="grid gap-5 lg:grid-cols-6">

                {/* Destination */}

                <input
                    type="text"
                    name="destination"
                    placeholder="Destination"
                    value={filters.destination}
                    onChange={handleChange}
                    className="
                        w-full
                        rounded-2xl
                        bg-zinc-800
                        border
                        border-zinc-700
                        px-5
                        py-3
                        outline-none
                        transition
                        focus:border-indigo-500
                    "
                />

                {/* Source */}

                <input
                    type="text"
                    name="source"
                    placeholder="Source"
                    value={filters.source}
                    onChange={handleChange}
                    className="
                        w-full
                        rounded-2xl
                        bg-zinc-800
                        border
                        border-zinc-700
                        px-5
                        py-3
                        outline-none
                        transition
                        focus:border-indigo-500
                    "
                />

                {/* Trip Type */}

                <select
                    name="tripType"
                    value={filters.tripType}
                    onChange={handleChange}
                    className="
                        w-full
                        rounded-2xl
                        bg-zinc-800
                        border
                        border-zinc-700
                        px-5
                        py-3
                        outline-none
                        transition
                        focus:border-indigo-500
                    "
                >

                    {tripTypes.map(type => (

                        <option
                            key={type}
                            value={type}
                        >

                            {type || "All Types"}

                        </option>

                    ))}

                </select>

                {/* Min Budget */}
                {/* Min Budget */}

<div className="relative">

    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-semibold">

        ₹

    </span>

    <input
        type="number"
        name="minBudget"
        placeholder="Min Budget"
        value={filters.minBudget}
        onChange={handleChange}
        className="
            w-full
            rounded-2xl
            bg-zinc-800
            border
            border-zinc-700
            pl-10
            pr-4
            py-3
            text-sm
            placeholder:text-xs
            placeholder:text-zinc-500
            outline-none
            transition
            focus:border-indigo-500
        "
    />

</div>

                

                {/* Max Budget */}

                {/* Max Budget */}

<div className="relative">

    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-semibold">

        ₹

    </span>

    <input
        type="number"
        name="maxBudget"
        placeholder="Max Budget"
        value={filters.maxBudget}
        onChange={handleChange}
        className="
            w-full
            rounded-2xl
            bg-zinc-800
            border
            border-zinc-700
            pl-10
            pr-4
            py-3
            text-sm
            placeholder:text-xs
            placeholder:text-zinc-500
            outline-none
            transition
            focus:border-indigo-500
        "
    />

</div>

                {/* Search Button */}

                <button

                    onClick={() => onSearch(filters)}

                    className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        rounded-2xl
                        bg-indigo-600
                        hover:bg-indigo-500
                        px-6
                        py-3
                        font-semibold
                        transition
                    "

                >

                    <Search size={18} />

                    Search

                </button>

            </div>

        </section>

    );

};

export default ExploreFilters;