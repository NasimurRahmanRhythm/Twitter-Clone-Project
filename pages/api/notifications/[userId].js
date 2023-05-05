// pages/api/notifications/[userId].jsx
import User from "@/src/models/User";
import Notification from "@/src/models/Notification";
import connectToDB from "@/src/libs/mongooseDB";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  try {
    await connectToDB();

    const { userId } = req.query;

    if (!userId || typeof userId !== "string") {
      throw new Error("Invalid ID");
    }

    const notifications = await Notification.find({
      userId,
    }).sort({ createdAt: "desc" });

    await User.updateOne(
      { _id: userId },
      {
        $set: {
          hasNotification: false,
        },
      }
    );

    return res.status(200).json(notifications);
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
