import Notification from "@/main/models/notification.schema";
import UserModel from "@/main/models/user.schema";

export async function createNotification(type, userID, content) {
  try {
    const notification = await Notification.create({
      type,
      userID,
      content,
    });

    await UserModel.updateOne(
      { _id: userID },
      { $push: { notifications: notification } }
    );

    return notification;
  } catch (error) {
    throw { status: 500, error: error.message };
  }
}
