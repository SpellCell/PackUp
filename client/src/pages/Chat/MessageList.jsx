import { useEffect, useRef, useState } from "react";
import { MessageCircle, Plane } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { getChatHistory } from "../../api/chatApi";

import MessageBubble from "./MessageBubble";

const MessageList = ({ trip, socket }) => {
    const { user } = useAuth();

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    const bottomRef = useRef(null);

    useEffect(() => {
        if (!trip?._id) return;

        fetchMessages();
    }, [trip]);

    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (message) => {
            setMessages((prev) => [
                ...prev,
                message
            ]);
        };

        socket.on(
            "receiveMessage",
            handleReceiveMessage
        );

        return () => {
            socket.off(
                "receiveMessage",
                handleReceiveMessage
            );
        };
    }, [socket]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [messages]);

    const fetchMessages = async () => {
        try {
            setLoading(true);

            const { data } =
                await getChatHistory(trip._id);

            setMessages(data.chats || []);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-1 items-center justify-center">

                <div className="flex items-center gap-2 text-xs text-zinc-600">

                    <Plane
                        size={15}
                        className="animate-pulse text-indigo-400"
                    />

                    Loading conversation...

                </div>

            </div>
        );
    }

    return (
        <div className="relative flex-1 overflow-y-auto">

            {/* Subtle conversation background */}

            <div className="pointer-events-none absolute inset-0 overflow-hidden">

                <div className="absolute left-1/2 top-1/3 h-56 w-56 -translate-x-1/2 rounded-full bg-indigo-500/[0.018] blur-3xl" />

                <MessageCircle
                    size={100}
                    strokeWidth={1}
                    className="absolute right-[8%] top-[20%] rotate-12 text-indigo-300/[0.018]"
                />

            </div>

            <div className="relative flex min-h-full flex-col px-4 py-5 sm:px-6">

                {messages.length === 0 ? (
                    <div className="flex flex-1 items-center justify-center">

                        <div className="text-center">

                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.03] text-zinc-600">
                                <MessageCircle size={21} />
                            </div>

                            <h3 className="mt-4 text-sm font-semibold text-zinc-400">
                                No messages yet
                            </h3>

                            <p className="mt-1 text-[10px] text-zinc-700">
                                Start the conversation with your crew.
                            </p>

                        </div>

                    </div>
                ) : (
                    <div className="mt-auto space-y-3">

                        {messages
                            .filter(
                                (message) =>
                                    message?.sender
                            )
                            .map((message) => (
                                <MessageBubble
                                    key={message._id}
                                    message={message}
                                    isOwn={
                                        message.sender?._id ===
                                        user?._id
                                    }
                                />
                            ))}

                        <div ref={bottomRef} />

                    </div>
                )}

            </div>

        </div>
    );
};

export default MessageList;