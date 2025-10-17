// socket.ts
import { io, Socket } from "socket.io-client";

const URL = "wss://dev.crewroomz.com";

export const createSocket = (token: string): Socket => {
  const socket = io(URL, {
    transports: ["websocket"], // ensure WebSocket protocol
    auth: { authorization: `Bearer ${token}` },
    autoConnect: false, // manually connect when ready
  });

  return socket;
};
