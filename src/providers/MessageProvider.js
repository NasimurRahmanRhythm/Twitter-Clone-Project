import { useRouter } from "next/router";
import { useSocket } from "./SocketProvider";
import { useSession } from "next-auth/react";
import { createContext, useCallback, useEffect, useState } from "react";
import { useActionDispatcher } from "../hooks/useActionDispatcher";
import { messageActions } from "../actions/message.actions";

export const MessageContext = createContext();
export function MessageProvider({ children }) {
  const { socket } = useSocket();
  const router = useRouter();
  const { room } = router.query;
  const { session } = useSession();
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
    if(messageSeen){
      dispatch(messageActions.SEEN_MESSAGES, messageSeen.userId);
    }
  }, [messageSeen]);

  useEffect(()=> {
    if(newMessage){
      dispatch(messageActions.ADD_MESSAGES, {
        message: {...newMessage, seen: true},
        room: newMessage.sender,
      });
      dispatch(messageActions.ADD_MESSAGE_NOTIFICATIONS,{
        message: newMessage,
        room: room,
      });
    }
  },[newMessage]);
  
  useEffect(() => {
    if(socket){
      dispatch(messageActions.SET_SOCKET, socket).then(() => {
        socket.on("new_message", setNewMessage);
        socket.on("message_seen", setMessageSeen);
      });
    }
  
  }, [socket]);

  useEffect(() => {
    if(session) {
      dispatch(messageActions.FETCH_MESSAGE_NOTIFICATIONS);
    }
  }, [session]);

  useEffect(() => {
    if(room) {
      dispatch(messageActions.SET_ROOM, room);
      dispatch(messageActions.CLEAR_USER_NOTIFICATIONS, room);
    }
  }, [room]);
  
  
  return (
    <MessageContext.Provider value={{ ...state, dispatch }}>
      {children}
    </MessageContext.Provider>
  );
}
