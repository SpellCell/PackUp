import { useState } from "react";
import { SendHorizontal } from "lucide-react";

const ChatInput = ({ socket, tripId }) => {

    const [message, setMessage] = useState("");

    const handleChange = (e) => {

        setMessage(e.target.value);

        socket.emit("typing", tripId);

    };

    const sendMessage = () => {

        if (!message.trim()) return;

        socket.emit("sendMessage", {

            tripId,

            message

        });

        socket.emit("stopTyping", tripId);

        setMessage("");

    };

    const handleKeyDown = (e) => {

        if (e.key === "Enter" && !e.shiftKey) {

            e.preventDefault();

            sendMessage();

        }

    };

    const handleBlur = () => {

        socket.emit("stopTyping", tripId);

    };

    return (

        <div className="border-t border-zinc-800 p-5">

            <div className="flex items-center gap-4">

                <textarea

                    rows={1}

                    value={message}

                    onChange={handleChange}

                    onBlur={handleBlur}

                    onKeyDown={handleKeyDown}

                    placeholder="Type your message..."

                    className="
                        flex-1
                        resize-none
                        rounded-2xl
                        bg-zinc-800
                        px-5
                        py-4
                        outline-none
                    "

                />

                <button

                    onClick={sendMessage}

                    className="
                        w-14
                        h-14
                        rounded-2xl
                        bg-indigo-600
                        hover:bg-indigo-500
                        flex
                        items-center
                        justify-center
                        transition
                    "

                >

                    <SendHorizontal size={22} />

                </button>

            </div>

        </div>

    );

};

export default ChatInput;