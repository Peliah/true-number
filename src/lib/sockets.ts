import { io, Socket } from "socket.io-client";
import { getToken } from "./config";

const URL = "http://localhost:3000";

let socket: Socket | null = null;

export const getSocket = async (): Promise<Socket> => {
    if (!socket) {
        socket = io(URL, {
            auth: {
                token: await getToken(),
            }
        });
    }
    return socket;
};
