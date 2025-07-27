import { io, Socket } from "socket.io-client";

const URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000"; // Adjust this to your backend's origin

let socket: Socket | null = null;

export const getSocket = (): Socket => {
    if (!socket) {
        socket = io(URL, {
            transports: ["websocket"], // optional, ensures a websocket connection
            withCredentials: true,
        });
    }
    return socket;
};
