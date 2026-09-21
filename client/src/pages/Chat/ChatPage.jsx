import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MessageCircle,
    Plane,
    Sparkles,
    Compass,
    Navigation,
    ArrowLeft
} from "lucide-react";

import AppLayout from "../../components/layout/AppLayout";

import ChatSidebar from "./ChatSidebar";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";

import { useSocket } from "../../context/socketContext";

const ChatPage = () => {
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [typingUser, setTypingUser] = useState("");

    const {
        socket,
        connected,
        onlineUsers
    } = useSocket();

    useEffect(() => {
        if (
            !socket ||
            !connected ||
            !selectedTrip
        ) {
            return;
        }

        socket.emit(
            "joinTrip",
            selectedTrip._id
        );

        return () => {
            socket.emit(
                "leaveTrip",
                selectedTrip._id
            );
        };
    }, [
        socket,
        connected,
        selectedTrip
    ]);

    useEffect(() => {
        if (!socket) return;

        const handleTyping = (name) => {
            setTypingUser(name);
        };

        const handleStopTyping = () => {
            setTypingUser("");
        };

        socket.on(
            "typing",
            handleTyping
        );

        socket.on(
            "stopTyping",
            handleStopTyping
        );

        return () => {
            socket.off(
                "typing",
                handleTyping
            );

            socket.off(
                "stopTyping",
                handleStopTyping
            );
        };
    }, [socket]);

    const handleSelectTrip = (trip) => {
        setTypingUser("");
        setSelectedTrip(trip);
    };

    const handleBackToTrips = () => {
        setTypingUser("");
        setSelectedTrip(null);
    };

    return (
        <AppLayout>
            <div className="relative mx-auto w-full max-w-[1600px] overflow-hidden pb-4">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <motion.div
                        animate={{
                            x: [0, 16, 0],
                            y: [0, -10, 0],
                            rotate: [-4, 2, -4]
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute right-[4%] top-[3%] text-indigo-300/[0.035]"
                    >
                        <Plane
                            size={120}
                            strokeWidth={1}
                        />
                    </motion.div>

                    <motion.div
                        animate={{
                            rotate: [0, 360]
                        }}
                        transition={{
                            duration: 45,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute bottom-[12%] left-[2%] text-cyan-300/[0.025]"
                    >
                        <Compass
                            size={110}
                            strokeWidth={1}
                        />
                    </motion.div>

                    <Navigation
                        size={22}
                        className="absolute right-[25%] top-[20%] text-indigo-300/[0.055]"
                    />

                    <Sparkles
                        size={17}
                        className="absolute bottom-[18%] left-[28%] text-cyan-300/[0.06]"
                    />
                </div>

                <div className="relative z-10">
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 10
                        }}
                        animate={{
                            opacity: 1,
                            y: 0
                        }}
                        transition={{
                            duration: 0.35
                        }}
                        className="mb-4 flex items-end justify-between"
                    >
                        <div>
                            <div className="mb-1.5 flex items-center gap-2">
                                <span className="h-px w-5 bg-indigo-500" />

                                <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-indigo-400">
                                    Travel Conversations
                                </span>
                            </div>

                            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                                Chats
                            </h1>

                            <p className="mt-1 text-xs text-zinc-600">
                                Stay connected with your travel crew.
                            </p>
                        </div>

                        <div className="hidden items-center gap-2 text-[10px] sm:flex">
                            <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                    connected
                                        ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]"
                                        : "bg-zinc-700"
                                }`}
                            />

                            <span className="text-zinc-700">
                                {connected
                                    ? "Real-time connected"
                                    : "Connecting..."}
                            </span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 12
                        }}
                        animate={{
                            opacity: 1,
                            y: 0
                        }}
                        transition={{
                            duration: 0.45,
                            delay: 0.05
                        }}
                        className="
                            relative
                            flex
                            h-[calc(100vh-190px)]
                            min-h-[520px]
                            overflow-hidden
                            rounded-[22px]
                            border
                            border-white/[0.07]
                            bg-[#0F0F14]/95
                            shadow-[0_20px_70px_rgba(0,0,0,0.25)]
                        "
                    >
                        <div className="hidden w-[280px] shrink-0 border-r border-white/[0.07] md:block">
                            <ChatSidebar
                                selectedTrip={selectedTrip}
                                onSelectTrip={handleSelectTrip}
                            />
                        </div>

                        {!selectedTrip && (
                            <div className="w-full md:hidden">
                                <ChatSidebar
                                    selectedTrip={selectedTrip}
                                    onSelectTrip={handleSelectTrip}
                                />
                            </div>
                        )}

                        {selectedTrip && (
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    x: 10
                                }}
                                animate={{
                                    opacity: 1,
                                    x: 0
                                }}
                                transition={{
                                    duration: 0.2
                                }}
                                className="flex min-w-0 flex-1 flex-col"
                            >
                                <div className="flex h-10 shrink-0 items-center border-b border-white/[0.05] px-3 md:hidden">
                                    <button
                                        onClick={handleBackToTrips}
                                        className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[10px] font-medium text-zinc-500 transition hover:bg-white/[0.04] hover:text-white"
                                    >
                                        <ArrowLeft size={13} />
                                        All chats
                                    </button>
                                </div>

                                <ChatHeader
                                    trip={selectedTrip}
                                    onlineUsers={onlineUsers}
                                />

                                <MessageList
                                    trip={selectedTrip}
                                    socket={socket}
                                />

                                <AnimatePresence>
                                    {typingUser && (
                                        <TypingIndicator
                                            typingUser={typingUser}
                                        />
                                    )}
                                </AnimatePresence>

                                {socket && connected && (
                                    <ChatInput
                                        socket={socket}
                                        tripId={selectedTrip._id}
                                    />
                                )}
                            </motion.div>
                        )}

                        {!selectedTrip && (
                            <div className="hidden min-w-0 flex-1 items-center justify-center md:flex">
                                <motion.div
                                    initial={{
                                        opacity: 0,
                                        scale: 0.96
                                    }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1
                                    }}
                                    transition={{
                                        duration: 0.3
                                    }}
                                    className="relative text-center"
                                >
                                    <div className="pointer-events-none absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/[0.07] blur-3xl" />

                                    <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] border border-white/[0.07] bg-indigo-500/10 text-indigo-300">
                                        <MessageCircle size={27} />
                                    </div>

                                    <h2 className="relative mt-5 text-lg font-bold text-white">
                                        Select a trip
                                    </h2>

                                    <p className="relative mx-auto mt-2 max-w-sm text-xs leading-5 text-zinc-600">
                                        Choose a trip from your journeys to start chatting with your travel crew.
                                    </p>
                                </motion.div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </AppLayout>
    );
};

export default ChatPage;