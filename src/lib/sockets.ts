import { io, Socket } from "socket.io-client";
import { getToken } from "./config";

const URL = process.env.NEXT_PUBLIC_SOCKET_URL;

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
