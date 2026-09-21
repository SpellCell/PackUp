import { motion } from "framer-motion";
import { CheckCheck } from "lucide-react";

const MessageBubble = ({ message, isOwn }) => {
    const senderName =
        message?.sender?.name || "Unknown User";

    const senderImage =
        message?.sender?.profileImage ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
            senderName
        )}&background=27272a&color=fff&bold=true`;

    const time = message?.createdAt
        ? new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
          })
        : "";

    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 6
            }}
            animate={{
                opacity: 1,
                y: 0
            }}
            className={`flex items-end gap-2.5 ${
                isOwn
                    ? "justify-end"
                    : "justify-start"
            }`}
        >

            {!isOwn && (
                <img
                    src={senderImage}
                    alt={senderName}
                    className="mb-1 h-7 w-7 shrink-0 rounded-lg border border-white/[0.07]"
                />
            )}

            <div
                className={`max-w-[75%] sm:max-w-[65%] ${
                    isOwn
                        ? "items-end"
                        : "items-start"
                }`}
            >

                {!isOwn && (
                    <p className="mb-1 ml-1 text-[9px] font-semibold text-indigo-300">
                        {senderName}
                    </p>
                )}

                <div
                    className={`
                        rounded-[17px]
                        border
                        px-3.5
                        py-2.5
                        shadow-sm

                        ${
                            isOwn
                                ? "rounded-br-md border-indigo-400/20 bg-indigo-500 text-white shadow-indigo-500/10"
                                : "rounded-bl-md border-white/[0.07] bg-[#18181E] text-zinc-200"
                        }
                    `}
                >

                    <p className="whitespace-pre-wrap break-words text-[12px] leading-5">
                        {message?.message}
                    </p>

                    <div
                        className={`mt-1.5 flex items-center justify-end gap-1 ${
                            isOwn
                                ? "text-indigo-100/60"
                                : "text-zinc-600"
                        }`}
                    >

                        <span className="text-[8px]">
                            {time}
                        </span>

                        {isOwn && (
                            <CheckCheck size={11} />
                        )}

                    </div>

                </div>

            </div>

        </motion.div>
    );
};

export default MessageBubble;