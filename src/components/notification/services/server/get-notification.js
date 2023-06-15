import UserModel from "@/main/models/user.schema";

export async function getNotifications(userID) {
  try {
    const notifications = await UserModel.findById(userID)
      .select({
        notifications: 1,
      })
      .populate({
        path: "notifications",
      })
      .sort({ createdAt: -1 })
      .limit(10);

    return notifications;
  } catch (error) {
    throw { status: 500, error: error.message };
  }
}
