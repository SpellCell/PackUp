import { motion } from "framer-motion";
import cn from "../../utils/cn";

const variants = {
    primary:
        "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20",

    secondary:
        "bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/20",

    outline:
        "border border-zinc-700 bg-transparent hover:bg-zinc-900 text-white",

    danger:
        "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20",
};

const Button = ({
    children,
    variant = "primary",
    loading = false,
    disabled = false,
    className = "",
    leftIcon,
    rightIcon,
    type = "button",
    ...props
}) => {

    return (

        <motion.button
            type={type}
            whileHover={!disabled && !loading ? { scale: 1.03 } : {}}
            whileTap={!disabled && !loading ? { scale: 0.97 } : {}}
            transition={{ duration: 0.18 }}
            disabled={disabled || loading}
            className={cn(
                "flex items-center justify-center gap-2",
                "rounded-2xl",
                "px-6 py-3",
                "min-h-[52px]",
                "font-semibold",
                "leading-none",
                "whitespace-nowrap",
                "transition-all duration-300",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                variants[variant],
                className
            )}
            {...props}
        >

            {loading ? (
                <>
                    <svg
                        className="h-5 w-5 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            opacity="0.25"
                        />
                        <path
                            d="M22 12a10 10 0 0 1-10 10"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeLinecap="round"
                        />
                    </svg>

                    <span>Loading...</span>
                </>
            ) : (
                <>
                    {leftIcon && (
                        <span className="flex items-center justify-center">
                            {leftIcon}
                        </span>
                    )}

                    <span>{children}</span>

                    {rightIcon && (
                        <span className="flex items-center justify-center">
                            {rightIcon}
                        </span>
                    )}
                </>
            )}

        </motion.button>

    );

};

export default Button;