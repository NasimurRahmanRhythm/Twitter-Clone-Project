import { useContext } from "react";
import { MessageContext } from "../providers/MessageProvider";
export const useMessages = () => {
  const { messages, messageNotifications, chatUsers, dispatch } =
    useContext(MessageContext);
  return { messages, messageNotifications, chatUsers, dispatch };
};
