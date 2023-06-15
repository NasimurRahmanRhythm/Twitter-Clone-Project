import { createContext, useContext, useEffect, useState } from "react";
import { getSocket } from "../libs/getSocket";
import { useSession } from "next-auth/react";
import { JOIN } from "@/constants";
const SocketContext = createContext();
export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(undefined);
  const { data: session } = useSession();
  const socketInitializer = async () => {
    if (!socket) {
      const socketClient = await getSocket();
      setSocket(socketClient);
    }
  };
  useEffect(() => {
    socketInitializer();
    return () => socket?.removeAllListeners();
  }, [session]);

  useEffect(() => {
    if (session && session.user) socket?.emit(JOIN, session.user.id);
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
