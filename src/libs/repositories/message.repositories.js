import Message from "@/src/models/Message";
import User from "@/src/models/User";

export async function updateMessages({messageIds}){
    await Message.updateMany(
        {
          "messages._id": { $in: messageIds },
        },
        {
          $set: { "messages.$.seen": true },
        }
      );
}

export async function deleteNotifications({ userId, notificationSenderId })
{
    await User.updateOne({ _id: userId }, { $pull: { messageNotifications: notificationSenderId } });
}