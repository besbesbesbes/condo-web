import { io } from "socket.io-client";

const socketUrl = import.meta.env.VITE_API_BASE_URL_SOCKET;

export const socket = io(socketUrl, {
  transports: ["websocket", "polling"],
});
