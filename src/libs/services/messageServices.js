import { allConversations, createConversations, createNotifications, deleteNotifications, fetchedConversations, findConversation, getConversation, getNotificationIds, moreConversationss, newNotification, updateMessages, updateUserNotification } from "../repositories/message.repositories";
import User from '@/src/models/User';
import mongoose from "mongoose";

export async function deleteMessageNotification({ userId, notificationSenderId }) {
    try {
      await deleteNotifications({userId, notificationSenderId});
      return true;
    } catch (err) {
      return false;
    }
  }
  
  export async function createMessageNotification({userId,notificationSenderId}){
    try{
        await createNotifications({userId,notificationSenderId});         
        return true;
     }catch(err){
        return false;
     }
   }

   export async function createNotification(type, userID, content) {
    try {
      const notification = await newNotification({type, userID, content});
  
      await updateUserNotification(userID, notification);
  
      return notification;
    } catch (error) {
      throw { status: 500, error: error.message };
    }
  }

  export async function getNotifications(userID) {
    try {
      const notifications = await getNotificationIds(userID);
      return notifications;
    } catch (error) {
      throw { status: 500, error: error.message };
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
  
  export async function createMessage({text,file,sender,receiver,originalMessage,}) {
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
      const conversations = await findConversation( { sender, receiver });
      let conversation;
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

    const conversation = createConversations({users, messages});

    return conversation;
  } catch (error) {
    throw { status: 500, error: error.message };
  }
}


export async function getAllConversationsByUser({userId,receiverID,pageIndex,pageSize = 30}) {
  try {
    console.log("Message is userId: " + userId + "receiverId is  " + receiverID + "pageIndex is " + pageIndex);
    const objectIdUserId = new mongoose.Types.ObjectId(userId);
    const objectIdReceiverId = new mongoose.Types.ObjectId(receiverID);
    let messages = await getConversation({objectIdUserId, objectIdReceiverId, pageIndex, pageSize});

    let unseenMessages = [];
    messages =
      messages?.map((msg) => {
        if (!msg.seen && msg.sender.toString() === receiverID.toString()) {
          unseenMessages.push(msg._id);
          msg.seen = true;
        }
        return msg;
      }) || [];

    if (unseenMessages.length !== 0) {
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
    const fetchedCoversations = await fetchedConversations({userId, receiverID});

    if (fetchedConversations && fetchedConversations.messages) {
      fetchedConversations?.messages.forEach((message) => {
        if (message.sender.toString() !== userId) {
          message.seen = true;
        }
      });
      await fetchedConversations.save();
    }

    const conversations = await allConversations({ userId, receiverID, pageIndex, pageSize});

    if (conversations[0]?.messages?.length < 20) {
      const moreConversations = await moreConversationss({userId, receiverID, pageIndex, pageSize});

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
