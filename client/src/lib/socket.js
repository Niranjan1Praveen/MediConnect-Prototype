"use client";

import { createContext, useContext } from "react";
import { io } from "socket.io-client";

// Singleton socket instance (created only once)
const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8000", {
  autoConnect: true,
  reconnectionAttempts: 5,
});

const SocketContext = createContext(socket);

// Hook to use socket in any component
export const useSocket = () => useContext(SocketContext);

// Provider to wrap the app
export const SocketProvider = ({ children }) => {
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
