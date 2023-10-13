import { deleteNotifications, updateMessages } from "../repositories/message.repositories";

export async function deleteMessageNotification({ userId, notificationSenderId }) {
    try {
      await deleteNotifications({userId, notificationSenderId});
      return true;
    } catch (err) {
      return false;
    }
  }
  
  export async function seeMessage({ messageIds }) {
    try {
      await updateMessages({messageIds});
      return true;
    } catch (err) {
      return false;
    }
  }
  