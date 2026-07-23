import { useEffect, useRef, useState } from "react";

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

            setMessages(prev => [...prev, message]);

        };

        socket.on("receiveMessage", handleReceiveMessage);

        return () => {

            socket.off("receiveMessage", handleReceiveMessage);

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

            const { data } = await getChatHistory(trip._id);

            setMessages(data.chats || []);

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (

            <div className="flex-1 flex items-center justify-center">

                Loading...

            </div>

        );

    }

    return (

        <div className="flex-1 overflow-y-auto p-6 space-y-5">

            {

                messages
                    .filter(message => message?.sender)
                    .map(message => (

                        <MessageBubble

                            key={message._id}

                            message={message}

                            isOwn={
                                message.sender?._id === user?._id
                            }

                        />

                    ))

            }

            <div ref={bottomRef} />

        </div>

    );

};

export default MessageList;