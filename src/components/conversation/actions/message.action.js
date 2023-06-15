import { NEW_MESSAGE, SEE_MESSAGE, SEND_MESSAGE } from "@/constants";
import { generateVerificationToken } from "@/participated/libs/generateVerificationToken";
import axios from "axios";

export const MessageActions = {
  SET_SESSION: (_, session) => {
    return (state) => ({
      ...state,
      session,
    });
  },

  SET_ROOM: (_, room) => {
    return (state) => ({ ...state, room });
  },

  SET_SOCKET: (_, socket) => {
    return (state) => ({ ...state, socket });
  },

  ADD_MESSAGE: (state, { message, room }) => {
    let roomMessages = state.messages[room]?.data;
    if (!roomMessages) roomMessages = [];
    roomMessages.unshift(message);
    return (currentState) => {
      if (!currentState.messages[room]) {
        currentState.messages[room] = { data: [] };
      }
      currentState.messages[room].data = roomMessages;
      return { ...currentState };
    };
  },

  FETCH_USER_MESSAGES: async (state, { userId, pageSize = 50 }, dispatch) => {
    if (state.messages[userId]?.isLastPage) {
      return state;
    }
    try {
      const { data: response } = await axios.post(
        `/api/conversation/?pageIndex=${
          state.messages[userId].pageIndex + 1
        }&pageSize=${pageSize}`,
        {
          userId: state.session.user?.id,
          receiverID: userId,
        }
      );
      state = await dispatch(MessageActions.ADD_USER_MESSAGES, {
        messages: response.data,
        userId,
      });
      if (response.data && response.data.length < 50) {
        state.messages[userId].isLastPage = true;
      }
      state.messages[userId].pageIndex++;
      return { ...state };
    } catch (error) {
      return state;
    }
  },

  CLEAR_USER_NOTIFICATION: (state, userId) => {
    const newState = { ...state };
    newState.messageNotifications.delete(userId);
    return newState;
  },

  SEND_MESSAGE: async (_, { message, room }, dispatch) => {
    const customId = generateVerificationToken(8);
    await dispatch(MessageActions.ADD_MESSAGE, {
      message: {
        ...message,
        id: customId,
      },
      room: room,
    });

    const { data: response } = await axios.post("/api/message", {
      ...message,
      customId,
    });
    await dispatch(MessageActions.MESSAGE_DELIVERED, response.data);
    return (state) => state;
  },

  MESSAGE_DELIVERED: (state, { message, customId }) => {
    const newState = { ...state };
    const messages = newState.messages[message.receiver]?.data;
    if (messages) {
      for (let i = 0; i < messages.length; i++) {
        if (messages[i].id === customId) {
          messages[i] = message;
          break;
        }
      }
    }
    return (state) => {
      state.messages[message.receiver].data = messages;
      return { ...state };
    };
  },

  MESSAGE_SEEN: async (state, userId) => {
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
  },

  FETCH_MESSAGE_NOTIFICATION: async () => {
    let { data: notifications } = await axios.get(
      "/api/notification?type=message"
    );
    return (state) => ({
      ...state,
      messageNotifications: new Set(notifications.data),
    });
  },

  ADD_MESSAGE_NOTIFICATION: (state, { message, room }) => {
    const messageNotifications = state.messageNotifications;
    if (message.sender !== room) {
      messageNotifications.add(message.sender);
    } else {
      state.socket?.emit(SEE_MESSAGE, message);
    }
    return (currentState) => {
      currentState.messageNotifications = messageNotifications;
      return { ...currentState };
    };
  },

  ADD_USER_MESSAGES: (state, { userId, messages }) => {
    const newState = { ...state };
    if (!newState.messages[userId]) {
      newState.messages[userId] = { data: [], isLastPage: false, pageIndex: 1 };
    }
    newState.messages[userId].data = [
      ...newState.messages[userId].data,
      ...messages,
    ];
    return newState;
  },

  SET_USER_MESSAGES: (_, { userId, messages }) => {
    // let newState = { ...state };
    return (state) => {
      state.messages[userId] = {
        data: messages,
        isLastPage: messages && messages.length < 50,
        pageIndex: 1,
      };
      return { ...state };
    };
  },

  SET_LAST_PAGE: (state, { userId }) => {
    const newState = { ...state };
    newState.messages[userId].isLastPage = true;
    return newState;
  },

  SEARCH_USER: async (_, searchText) => {
    let text = searchText.trim();
    if (text.length === 0) {
      return (state) => ({ ...state, chatUsers: state.users });
    }
    const { data: response } = await axios.post("/api/search", {
      user: text,
    });
    return (state) => ({ ...state, chatUsers: response.data });
  },

  SET_USERS: (_, users) => {
    return (state) => ({ ...state, users: users, chatUsers: users });
  },
};
