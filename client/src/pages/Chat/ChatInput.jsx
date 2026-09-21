import { useState } from "react";
import { motion } from "framer-motion";
import {
    SendHorizontal,
    Smile
} from "lucide-react";

const ChatInput = ({ socket, tripId }) => {
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setMessage(e.target.value);

        socket.emit(
            "typing",
            tripId
        );
    };

    const sendMessage = () => {
        if (!message.trim()) return;

        socket.emit("sendMessage", {
            tripId,
            message
        });

        socket.emit(
            "stopTyping",
            tripId
        );

        setMessage("");
    };

    const handleKeyDown = (e) => {
        if (
            e.key === "Enter" &&
            !e.shiftKey
        ) {
            e.preventDefault();

            sendMessage();
        }
    };

    const handleBlur = () => {
        socket.emit(
            "stopTyping",
            tripId
        );
    };

    return (
        <div className="shrink-0 border-t border-white/[0.07] bg-[#0F0F14]/95 p-3 sm:p-4">

            <div className="flex items-end gap-2 rounded-[17px] border border-white/[0.07] bg-[#141419] p-1.5 transition focus-within:border-indigo-500/25">

                <button
                    type="button"
                    className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-zinc-600 transition hover:bg-white/[0.04] hover:text-zinc-300"
                >
                    <Smile size={17} />
                </button>

                <textarea
                    rows={1}
                    value={message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    placeholder="Write a message..."
                    className="
                        max-h-28
                        min-h-[38px]
                        flex-1
                        resize-none
                        bg-transparent
                        px-2
                        py-2.5
                        text-xs
                        leading-5
                        text-white
                        outline-none
                        placeholder:text-zinc-700
                    "
                />

                <motion.button
                    whileHover={{
                        y: -1
                    }}
                    whileTap={{
                        scale: 0.94
                    }}
                    onClick={sendMessage}
                    disabled={!message.trim()}
                    className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-indigo-500
                        text-white
                        shadow-lg
                        shadow-indigo-500/10
                        transition
                        hover:bg-indigo-400
                        disabled:cursor-not-allowed
                        disabled:bg-white/[0.04]
                        disabled:text-zinc-700
                        disabled:shadow-none
                    "
                >
                    <SendHorizontal size={17} />
                </motion.button>

            </div>

            <p className="mt-1.5 hidden px-1 text-[8px] text-zinc-700 sm:block">
                Press Enter to send · Shift + Enter for a new line
            </p>

        </div>
    );
};

export default ChatInput;