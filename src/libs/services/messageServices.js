import { allConversations, createConversations, createNotifications, deleteNotifications, fetchedConversations, findConversation, getConversation, getNotificationIds, moreConversationss, newNotification, updateMessages, updateUserNotification } from "../repositories/message.repositories";
import User from '@/src/models/User';
import Message from '@/src/models/Message';
import Notification from '@/src/models/Notification';

import mongoose from "mongoose";

export async function deleteMessageNotification({ userId, notificationSenderId }) {
  try{
    await User.updateOne({_id:userId},{$pull:{messageNotifications:notificationSenderId}})
    return true
  } catch(err){
    return false
  }
  }
  
  export async function createMessageNotification({userId,notificationSenderId}){
    try{
      await User.updateOne({_id:userId},{$push:{messageNotifications:notificationSenderId}})            
      return true
   }catch(err){
      return false 
   }
   }

   export async function createNotification(type, userID, content) {
    try {
      const notification = await Notification.create({
        type,
        userID,
        content,
      });
  
      await User.updateOne(
        { _id: userID },
        { $push: { messageNotifications: notification } }
      );
  
      return notification;
    } catch (error) {
      throw { status: 500, error: error.message };
    }
  }

  export async function getNotifications(userID) {
    try {
      const notifications = await User.findById(userID)
        .select({
          notifications: 1,
        })
        .populate({
          path: "messageNotifications",
        })
        .sort({ createdAt: -1 })
        .limit(10);
  
      return notifications;
    } catch (error) {
      throw { status: 500, error: error.message };
    }
  }



  export async function seeMessage({ messageIds }) {
    try {
      await Message.updateMany(
        {
          "messages._id": {$in:messageIds},
        },
        {
          $set: { "messages.$.seen": true },
        }
      );
      return true;
    } catch (err) {
      return false;
    }
  }
  
  export async function createMessage({text,file,sender,receiver,originalMessage}) {
    console.log("sender is ",sender);
    try {
      const message = {
        content: {
          text,
          file,
        },
        sender,
        receiver,
        originalMessage,
      };
      const conversations = await Message.find({users:{$all:[sender,receiver]}}).sort({createdAt:-1}).limit(1);
      let conversation
      if(!conversations || conversations.length === 0  ){
        conversation = await createConversation(sender,receiver);
      }
      else{
        conversation = conversations[0];
      }
      let newMessage;
      if (conversation.messages.length < 50) {
        conversation.messages.push(message);
        conversation.lastMessage = {
          text,
          file,
          sender,
        };
        await conversation.save();
        newMessage  = conversation.messages[conversation.messages.length-1];
      } else {
        const newConversation = await createConversation(sender, receiver);
        newConversation.messages.push(message);
        newConversation.lastMessage = {
          text,
          file,
          sender,
        };
        await newConversation.save();
        newMessage  = conversation.messages[conversation.messages.length-1];
      }
      return newMessage._doc;
    } catch (error) {
      throw { status: 500, error: error.message };
    }
  }


export async function createConversation(userID, receiverID) {
  try {
    const users = [userID, receiverID];
    const messages = [];

    const conversation = await Message.create({
      users,
      messages,
    });

    return conversation;
  } catch (error) {
    throw { status: 500, error: error.message };
  }
}


export async function getAllConversationsByUser({userId,receiverID,pageIndex,pageSize = 30}) {
  try {
    console.log(userId + " " + receiverID + " " + pageIndex);
    const objectIdUserId = new mongoose.Types.ObjectId(userId);
    const objectIdReceiverId = new mongoose.Types.ObjectId(receiverID);
    let messages = await Message.aggregate([
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

    let unseenMessages = [];
    messages =
      messages?.map((msg) => {
        if (!msg.seen && msg.sender.toString() === receiverID.toString()) {
          unseenMessages.push(msg._id);
          msg.seen = true;
        }
        return msg;
      }) || [];

    if (unseenMessages.length != 0) {
      seeMessage({ messageIds: unseenMessages });
    }

    console.log("unseen", unseenMessages);

    return messages;
  } catch (error) {
    throw { status: 500, message: error.message };
  }
}

export async function takeAllUsers() {
  try {
    const users = await User.find({isVerified:true}).lean();
    return users;
  } catch (error) {
    console.log("TAke all users error is ", error);
  }
}


export async function getAllConversationsForUser({userId,receiverID,pageIndex,pageSize = 1}) {
  try {
    const fetchedConversations = await Message.findOne({
      users: { $all: [userId, receiverID] },
    }).sort({ createdAt: -1 });

    if (fetchedConversations && fetchedConversations.messages) {
      fetchedConversations?.messages.forEach((message) => {
        if (message.sender.toString() !== userId) {
          message.seen = true;
        }
      });
      await fetchedConversations.save();
    }

    const conversations = await Message.find({
      users: { $all: [userId, receiverID] },
    })
      .select("messages")
      .skip((pageIndex - 1) * pageSize)
      .limit(pageSize)
      .sort({ createdAt: -1 })
      .lean();

    if (conversations[0]?.messages?.length < 20) {
      const moreConversations = await Message.find({
        users: { $all: [userId, receiverID] },
      })
        .select("messages")
        .skip((pageIndex - 1) * (pageSize + 1))
        .limit(pageSize + 1)
        .sort({ createdAt: -1 })
        .lean();

      if (moreConversations.length > 1) {
        const firstConversationMessages =
          moreConversations[1]?.messages?.map((msg) => msg) || [];
        const secondConversationMessages =
          moreConversations[0]?.messages?.map((msg) => msg) || [];
        return [...firstConversationMessages, ...secondConversationMessages];
      } else {
        return conversations[0]?.messages?.map((msg) => msg) || [];
      }

    } else {
      return conversations[0]?.messages?.map((msg) => msg) || [];
    }
  } catch (error) {
    throw { status: 500, message: error.message };
  }
}
