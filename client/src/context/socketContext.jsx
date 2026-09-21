import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import socket from "../socket/socket";
import { useAuth } from "./AuthContext";

const SocketContext = createContext({
    socket,
    connected: false,
    notifications: [],
    onlineUsers: [],
    setNotifications: () => {},
    clearNotifications: () => {}
});

export const SocketProvider = ({ children }) => {
    const { user } = useAuth();

    const [connected, setConnected] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        if (!user) {
            socket.disconnect();
            setConnected(false);
            setNotifications([]);
            setOnlineUsers([]);
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            socket.disconnect();
            setConnected(false);
            setOnlineUsers([]);
            return;
        }

        socket.auth = {
            token
        };

        const handleConnect = () => {
            console.log(
                "✅ Socket connected:",
                socket.id
            );

            setConnected(true);
        };

        const handleDisconnect = () => {
            console.log(
                "❌ Socket disconnected"
            );

            setConnected(false);
            setOnlineUsers([]);
        };

        const handleConnectError = (error) => {
            console.log(
                "❌ Socket connection error:",
                error.message
            );

            setConnected(false);
        };

        const handleNewNotification = (
            notification
        ) => {
            console.log(
                "🔔 New notification:",
                notification
            );

            setNotifications(
                (previous) => [
                    notification,
                    ...previous
                ]
            );
        };

        const handleOnlineUsers = (users) => {
            console.log(
                "🟢 Online users:",
                users
            );

            setOnlineUsers(users || []);
        };

        socket.on(
            "connect",
            handleConnect
        );

        socket.on(
            "disconnect",
            handleDisconnect
        );

        socket.on(
            "connect_error",
            handleConnectError
        );

        socket.on(
            "newNotification",
            handleNewNotification
        );

        socket.on(
            "onlineUsers",
            handleOnlineUsers
        );

        socket.connect();

        return () => {
            socket.off(
                "connect",
                handleConnect
            );

            socket.off(
                "disconnect",
                handleDisconnect
            );

            socket.off(
                "connect_error",
                handleConnectError
            );

            socket.off(
                "newNotification",
                handleNewNotification
            );

            socket.off(
                "onlineUsers",
                handleOnlineUsers
            );

            socket.disconnect();
        };
    }, [user]);

    const clearNotifications = () => {
        setNotifications([]);
    };

    return (
        <SocketContext.Provider
            value={{
                socket,
                connected,
                notifications,
                setNotifications,
                clearNotifications,
                onlineUsers
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () =>
    useContext(SocketContext);