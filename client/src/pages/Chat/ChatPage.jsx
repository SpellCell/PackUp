import { useEffect, useState } from "react";

import AppLayout from "../../components/layout/AppLayout";

import ChatSidebar from "./ChatSidebar";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";

import {
    connectSocket,
    disconnectSocket
} from "./socket";

const ChatPage = () => {

    const [selectedTrip, setSelectedTrip] = useState(null);

    const [socket, setSocket] = useState(null);

    const [typingUser, setTypingUser] = useState("");

    const [onlineUsers, setOnlineUsers] = useState([]);

    // =====================================
    // Connect Socket
    // =====================================

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) return;

        const newSocket = connectSocket(token);

        setSocket(newSocket);

        return () => {

            disconnectSocket();

        };

    }, []);

    // =====================================
    // Join / Leave Trip Room
    // =====================================

    useEffect(() => {

        if (!socket || !selectedTrip) return;

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

        selectedTrip

    ]);

    // =====================================
    // Socket Events
    // =====================================

    useEffect(() => {

        if (!socket) return;

        socket.on("typing", (name) => {

            setTypingUser(name);

        });

        socket.on("stopTyping", () => {

            setTypingUser("");

        });

        socket.on("onlineUsers", (users) => {

            setOnlineUsers(users);

        });

        return () => {

            socket.off("typing");

            socket.off("stopTyping");

            socket.off("onlineUsers");

        };

    }, [socket]);

    return (

        <AppLayout>

            <div
                className="
                    h-[calc(100vh-140px)]
                    rounded-3xl
                    border
                    border-zinc-800
                    bg-zinc-900
                    overflow-hidden
                    flex
                "
            >

                {/* Sidebar */}

                <div className="w-80 border-r border-zinc-800">

                    <ChatSidebar

                        selectedTrip={selectedTrip}

                        onSelectTrip={setSelectedTrip}

                    />

                </div>

                {/* Chat Area */}

                <div className="flex-1 flex flex-col">

                    {

                        selectedTrip ?

                        (

                            <>

                                <ChatHeader

                                    trip={selectedTrip}

                                    onlineUsers={onlineUsers}

                                />

                                <MessageList

                                    trip={selectedTrip}

                                    socket={socket}

                                />

                                <TypingIndicator

                                    typingUser={typingUser}

                                />

                                {

                                    socket && (

                                        <ChatInput

                                            socket={socket}

                                            tripId={selectedTrip._id}

                                        />

                                    )

                                }

                            </>

                        )

                        :

                        (

                            <div className="flex-1 flex items-center justify-center">

                                <div className="text-center">

                                    <h2 className="text-3xl font-bold">

                                        Select a Trip

                                    </h2>

                                    <p className="mt-3 text-zinc-500">

                                        Choose a trip from the sidebar to start chatting.

                                    </p>

                                </div>

                            </div>

                        )

                    }

                </div>

            </div>

        </AppLayout>

    );

};

export default ChatPage;