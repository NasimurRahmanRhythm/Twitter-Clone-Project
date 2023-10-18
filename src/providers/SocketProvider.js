import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSession } from "next-auth/react";

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(undefined);
  const { data: session } = useSession();

  const socketInitializer = async () => {
    if (!socket) {
      await fetch("/api/socket");
      const socketClient = io();
      setSocket(socketClient);
    }
  };

  useEffect(() => {
    socketInitializer();
    return () => {
      socket?.removeAllListeners();
      socket?.close();
    };
  }, [session]);

  useEffect(() => {
    if (session && session.user) {
      socket?.emit("join", session.user._id);
    }
  }, [session, socket]);

  return (
    <SocketContext.Provider value={{ socket, setSocket: socketInitializer }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const { socket, setSocket } = useContext(SocketContext);
  return { socket, setSocket };
}
