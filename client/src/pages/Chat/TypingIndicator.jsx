import { motion } from "framer-motion";
import { MoreHorizontal } from "lucide-react";

const TypingIndicator = ({ typingUser }) => {
    if (!typingUser) return null;

    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 5
            }}
            animate={{
                opacity: 1,
                y: 0
            }}
            exit={{
                opacity: 0,
                y: 5
            }}
            className="shrink-0 px-5 pb-1"
        >
            <div className="flex items-center gap-2">

                <div className="flex h-6 items-center gap-0.5 rounded-lg bg-white/[0.035] px-2.5">

                    <motion.span
                        animate={{
                            y: [0, -2, 0]
                        }}
                        transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            delay: 0
                        }}
                        className="h-1 w-1 rounded-full bg-indigo-400"
                    />

                    <motion.span
                        animate={{
                            y: [0, -2, 0]
                        }}
                        transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            delay: 0.15
                        }}
                        className="h-1 w-1 rounded-full bg-indigo-400"
                    />

                    <motion.span
                        animate={{
                            y: [0, -2, 0]
                        }}
                        transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            delay: 0.3
                        }}
                        className="h-1 w-1 rounded-full bg-indigo-400"
                    />

                </div>

                <span className="text-[9px] text-zinc-600">
                    {typingUser} is typing
                </span>

                <MoreHorizontal
                    size={12}
                    className="text-zinc-700"
                />

            </div>
        </motion.div>
    );
};

export default TypingIndicator;