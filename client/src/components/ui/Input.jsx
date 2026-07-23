import { forwardRef } from "react";

const Input = forwardRef(({

    icon,

    label,

    error,

    className = "",

    ...props

}, ref) => {

    return (

        <div className="space-y-2">

            {label && (

                <label className="text-sm text-zinc-400">

                    {label}

                </label>

            )}

            <div
                className={`
                    flex
                    items-center
                    rounded-2xl
                    border
                    px-4
                    bg-zinc-900/70
                    backdrop-blur-xl
                    transition-all
                    duration-300

                    ${error
                        ? "border-red-500"
                        : "border-zinc-700 focus-within:border-indigo-500"}

                    ${className}
                `}
            >

                {icon && (

                    <span className="text-zinc-500 mr-3">

                        {icon}

                    </span>

                )}

                <input

                    ref={ref}

                    className="
                        flex-1
                        h-14
                        bg-transparent
                        outline-none
                        text-white
                        placeholder:text-zinc-500
                    "

                    {...props}

                />

            </div>

            {error && (

                <p className="text-red-500 text-sm">

                    {error}

                </p>

            )}

        </div>

    );

});

export default Input;