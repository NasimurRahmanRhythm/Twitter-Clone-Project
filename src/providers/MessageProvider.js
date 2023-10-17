import { useRouter } from "next/router";
import { useSocket } from "./SocketProvider";
import { useSession } from "next-auth/react";
import { createContext, useCallback, useEffect, useState } from "react";

export const MessageContext = createContext();
export function MessageProvider ({ children }){
    const {socket} = useSocket();
    const router = useRouter();
    const {room} = router.query;
    const {session} = useSession();
    const [state, setState] = useState({
        messages: [],
        messageNotifications: new Set(),
        users: [],
        chatUsers: [],
        room,
        socket,
    });

    const dispatch = useCallback(
      (action, payload) => {
        if(!action) {
            return;
        }
        let newState = state;
        if(action.constructor.name === 'AsyncFunction') {
            newState = action(state, payload, dispatch);
        }else if(action.constructor.name === 'Function') {
            newState = action(state, payload);
        }

        setState(newState);
      },
      [state],
    );
    
    const [newMessage, setNewMessage] = useState();
    const [messageSeen, setMessageSeen] = useState();


    const SET_ROOM = (_, room) => {
        return (state) => ({...state, room });
    };

    const SET_SOCKET = (_,socket) => {
        return (state) => ({...state, socket});
    };
    
    const ADD_MESSAGE = (state, {message, room}) => {
        let roomMessages = state.messages[room]?.data;
        if(!roomMessages) roomMessages=[];
        roomMessages.unshift(message);
        return (currentState) => {
            if(!currentState.messages[room]) {
                currentState.messages[room] = {data: []};
            }
            currentState.messages[room].data = roomMessages;
            return {...currentState};
        }
    };

    const CLEAR_USER_NOTIFICATION = (state, userId) => {
        const newState = {...state};
        newState.messageNotifications.delete(userId);
        return newState;
    };

    const MESSAGE_SEEN = async (state, userId) => {
        const newState = { ...state };
        const messages = newState.messages[userId]?.data;
        if (messages && messages.length > 0) {
          for (let i = 0; i < messages.length; i++) {
            if (messages[i].seen) {
              break;
            }
            messages[i].seen = true;
          }
        }
        return newState;
      };

    const FETCH_MESSAGE_NOTIFICATION = async () => {
        let { data: notifications } = await axios.get(
          "/api/notification?type=message"
        );
        return (state) => ({
          ...state,
          messageNotifications: new Set(notifications.data),
        });
      };
    
      const ADD_MESSAGE_NOTIFICATION = (state, { message, room }) => {
        const messageNotifications = state.messageNotifications;
        if (message.sender !== room) {
          messageNotifications.add(message.sender);
        } else {
          state.socket?.emit("see_message", message);
        }
        return (currentState) => {
          currentState.messageNotifications = messageNotifications;
          return { ...currentState };
        };
      };
    
      useEffect(() => {
        if (messageSeen) {
          dispatch(MESSAGE_SEEN, messageSeen.userId);
        }
      }, [messageSeen]);
    
      useEffect(() => {
        if (newMessage) {
          dispatch(ADD_MESSAGE, {
            message: {...newMessage,seen:true},
            room: newMessage.sender,
          });
          dispatch(ADD_MESSAGE_NOTIFICATION,{message:newMessage,room:room})
        }
      }, [newMessage]);
    
      useEffect(() => {
        if (socket) {
            const result = dispatch(SET_SOCKET, socket);
            if (result instanceof Promise) {
              result.then(() => {
                socket.on("new_message", setNewMessage);
                socket.on("message_seen", setMessageSeen);
              });
            } else {
              socket.on("new_message", setNewMessage);
              socket.on("message_seen", setMessageSeen);
            }
          }
      }, [socket]);
    
      useEffect(() => {
        if (session) {
          dispatch(FETCH_MESSAGE_NOTIFICATION);
        }
      }, [session]);
    
      useEffect(() => {
        if (room) {
          dispatch(SET_ROOM, room);
          dispatch(CLEAR_USER_NOTIFICATION, room);
        }
      }, [room]);
    
      return (
        <MessageContext.Provider value={{ ...state, dispatch }}>
          {children}
        </MessageContext.Provider>
      );
    
}