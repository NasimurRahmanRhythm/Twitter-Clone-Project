import Message from "@/models/Message";
import User from "@/models/User";
import Notification from '@/models/Notification';

export async function deleteNotifications({ userId, notificationSenderId }){
    await User.updateOne({ _id: userId }, { $pull: { messageNotifications: notificationSenderId } });
}

export async function createNotifications ({userId,notificationSenderId}) {
  await User.updateOne({_id:userId},{$push:{messageNotifications:notificationSenderId}})
}

export async function newNotification ({type, userID, content}) {
  await Notification.create({
    type,
    userID,
    content,
  });
}

export async function updateUserNotification( {userID, notification}) {
  await User.updateOne(
    { _id: userID },
    { $push: { messageNotifications: notification } }
  );
}

export async function getNotificationIds (userID) {
  await User.findById(userID)
        .select({
          messageNotifications: 1,
        })
        .populate({
          path: "messageNotifications",
        })
        .sort({ createdAt: -1 })
        .limit(10);
}

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


export async function findConversation( { sender, receiver }){
  await Message.find({users:{$all:[sender,receiver]}}).sort({createdAt:-1}).limit(1);
}

export async function createConversations({users, messages}) {
  await Message.create({
    users,
    messages,
  });
}

export async function getConversation( {objectIdUserId, objectIdReceiverId, pageIndex, pageSize}) {
  await Message.aggregate([
    { $match: { users: { $all: [objectIdUserId, objectIdReceiverId] } } },
    { $unwind: "$messages" },
    {
      $project: {
        _id: 0,
        message: "$messages",
      },
    },
    { $sort: { "message.createdAt": -1 } },
    { $skip: (pageIndex - 1) * pageSize },
    { $limit: pageSize },
    { $replaceRoot: { newRoot: "$message" } },
  ]);
}

export async function fetchedConversations({ userId, receiverID}) {
  await Message.findOne({
    users: { $all: [userId, receiverID] },
  }).sort({ createdAt: -1 });

}


export async function allConversations ({ userId, receiverID, pageIndex, pageSize}) {
  await Message.find({
    users: { $all: [userId, receiverID] },
  })
    .select("messages")
    .skip((pageIndex - 1) * pageSize)
    .limit(pageSize)
    .sort({ createdAt: -1 })
    .lean();
}

export async function moreConversationss({ userId, receiverID, pageIndex, pageSize}) {
  await Message.find({
    users: { $all: [userId, receiverID] },
  })
    .select("messages")
    .skip((pageIndex - 1) * pageSize+1)
    .limit(pageSize+1)
    .sort({ createdAt: -1 })
    .lean();
}