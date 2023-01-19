import { createContext } from "react";
import { Socket } from "socket.io-client";

export const SocketIOContext = createContext<Socket | null>(null);
