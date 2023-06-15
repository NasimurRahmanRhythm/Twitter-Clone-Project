import { createContext, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useSocket } from "@/main/Providers/SocketProvider";
import { useActionDispatcher } from "@/participated/hooks/useAction";
import { MessageActions } from "../actions/message.action";
import { MESSAGE_SEEN, NEW_MESSAGE } from "@/constants";
export const MessageContext = createContext();
export function MessageProvider({ children }) {
  const { socket } = useSocket();
  const router = useRouter();
  const { room } = router.query;
  const { data: session } = useSession();
  const [state, dispatch] = useActionDispatcher({
    messages: {},
    messageNotifications: new Set(),
    users: [],
    chatUsers: [],
    room: room,
    socket: socket,
  });

  const [newMessage, setNewMessage] = useState();
  const [messageSeen, setMessageSeen] = useState();

  useEffect(() => {
    if (messageSeen) {
      dispatch(MessageActions.MESSAGE_SEEN, messageSeen.userId);
    }
  }, [messageSeen]);

  useEffect(() => {
    if (newMessage) {
      dispatch(MessageActions.ADD_MESSAGE, {
        message: { ...newMessage, seen: true },
        room: newMessage.sender,
      });
      dispatch(MessageActions.ADD_MESSAGE_NOTIFICATION, {
        message: newMessage,
        room: room,
      });
    }
  }, [newMessage]);

  useEffect(() => {
    if (socket) {
      dispatch(MessageActions.SET_SOCKET, socket).then(() => {
        socket.on(NEW_MESSAGE, setNewMessage);
        socket.on(MESSAGE_SEEN, setMessageSeen);
      });
    }
  }, [socket]);

  useEffect(() => {
    if (session) {
      dispatch(MessageActions.FETCH_MESSAGE_NOTIFICATION);
    }
  }, [session]);

  useEffect(() => {
    if (room) {
      dispatch(MessageActions.SET_ROOM, room);
      dispatch(MessageActions.CLEAR_USER_NOTIFICATION, room);
    }
  }, [room]);

  return (
    <MessageContext.Provider value={{ ...state, dispatch }}>
      {children}
    </MessageContext.Provider>
  );
}
