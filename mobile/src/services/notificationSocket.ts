import { io, Socket } from "socket.io-client";

const SOCKET_URL =
  "https://packup-c2lk.onrender.com";

let socket: Socket | null = null;

export function connectNotificationSocket(
  token: string
) {
  if (socket?.connected) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    transports: ["websocket"],
    auth: {
      token,
    },
  });

  socket.on("connect", () => {
    console.log(
      "Notification socket connected:",
      socket?.id
    );
  });

  socket.on("connect_error", (error) => {
    console.log(
      "Notification socket error:",
      error.message
    );
  });

  socket.on("disconnect", (reason) => {
    console.log(
      "Notification socket disconnected:",
      reason
    );
  });

  return socket;
}

export function getNotificationSocket() {
  return socket;
}

export function disconnectNotificationSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}