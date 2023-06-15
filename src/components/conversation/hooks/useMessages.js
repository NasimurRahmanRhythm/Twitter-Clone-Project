import { useContext } from "react";
import { MessageContext } from "../providers/message-provider";
export const useMessages = () => {
  const { messages, messageNotifications, chatUsers, dispatch } =
    useContext(MessageContext);
  return { messages, messageNotifications, chatUsers, dispatch };
};
