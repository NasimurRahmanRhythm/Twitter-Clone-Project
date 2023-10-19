import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { findSocket } from "../libs/findSocket";

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(undefined);
  const { data: session } = useSession();

  const socketInitializer = async () => {
    if (!socket) {
      const socketClient = await findSocket();
      setSocket(socketClient);
    }
  };

  useEffect(() => {
    socketInitializer();
    return () => {
      socket?.removeAllListeners();
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
