import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "@/src/styles/message.module.css";
import Header from "@/src/components/Header/Header";
import Avatar from "@/src/components/Avatar/Avatar";
import { useRouter } from "next/router";
import Link from "next/link";
import connectToDB from "@/src/libs/mongooseDB";
import { deleteMessageNotification, getAllConversationsByUser, takeAllUsers } from "@/src/libs/services/messageServices";
import { useSession } from "next-auth/react";
import { messageActions } from "@/src/actions/message.actions";
import NewMessage from "@/src/components/Message/NewMessage/NewMessage";
import MessageForm from "@/src/components/Message/MessageForm/MessageForm";
import { AuthOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { useMessages } from "@/src/hooks/useMessage";

export async function getServerSideProps(ctx) {
  await connectToDB();
  const { user } = await getServerSession( ctx.req, ctx.res, AuthOptions);
  console.log("User isss", user);
  const { room } = await ctx.query;
  let receiver;
  let users = takeAllUsers().then((result) => {
    result = result.filter((u)=> u._id.toString() !== user?._id.toString());
    if(room) {
      receiver = result.reduce((access,currrent) => (currrent._id.toString() === room ? currrent : access), undefined);
    }

    return Promise.resolve(result);
  });

  let messages = Promise.resolve([]);
  if(room) {
    const receiverId = room;
    deleteMessageNotification({
      userId: user._id,
      notificationSenderId: receiverId,
    });

    messages = getAllConversationsByUser({
      userId: user._id,
      receiverID: receiverId,
      pageIndex: 1,
      pageSize: 50,
    });
  }

  const [usersResult, messagesResult] = await Promise.all([users,messages]);

  const io= ctx.res.socket.server.io;
  if(io && receiver){
    io.to(room).emit("message_seen", {userId: user._id});
  }

  return {
    props: JSON.parse(JSON.stringify({
      users: usersResult,
      previousMessages: messagesResult,
      receiver: receiver,
    })),
  };
}


const MessageView = ({ users, previousMessages, receiver }) => {
  const router = useRouter();
  const {room} = router.query;
  const {data: session} = useSession();
  //const mainUserss = takeAllUsers();
 // setMainUsers(takeAllUsers());
  const { messages, messageNotifications, chatUsers, dispatch } = useMessages();

 // console.log("messages is "+ messages + "messageNotifications " + messageNotifications, "chatUsers " + chatUsers, "dispatch " + dispatch);

  useEffect(()=> {
    if(receiver){
      dispatch(messageActions.FETCH_USER_MESSEGES, {userId: receiver?._id});
    }
  },[]);

  useEffect(()=> {
    (async () => {
      if(receiver?._id){
        await dispatch(messageActions.SET_USER_MESSAGES, {
          userId: receiver._id,
          messages: previousMessages,
        });
      }
      await dispatch(messageActions.SET_USERS, users);
    })();
  },[]);

  const sendMessages = ({text}) => {
    if(text){
      dispatch(messageActions.SEND_MESSAGES, {
        message: {
          content : {text},
          sender: session.user._id,
          receiver: room,
        },
        room: room,
      });
    }
  }

  return (
    <div className={styles.messageContainer}>
      <div className={styles.userList}>
        <div className={styles.userBoxHeader}>
          <div className={styles.userBoxHeaderOptionsAndText}>
            <Header showBackArrow label="Your Messages" /> 
          </div>
        </div>
        {chatUsers?.map((user) => (
          <div className={`${styles.user} ${room === user._id ? styles.selected : ""}`} key={user._id}>
            <Link 
            key={user._id}
            href={{ pathname: "/message", query: {room: user._id}}}>
              <div key={user._id} className={styles.userUser}>
              <Avatar userId={user._id} />
              <div className={styles.userInfoUser}>
                <p className={styles.userNameUser}>{user.name}</p>
                <p className={styles.userHandleUser}>@{user.username}</p>
              </div>
            </div>{" "}
              {messageNotifications.has(user._id) && (
                <span className="notification=badge"></span>
              )}
            </Link>
          </div>
        ))}
      </div>

      {receiver ? (
          <div className={styles.chatBox}>
            <div key={receiver._id} className={styles.userUser}>
              <Avatar userId={receiver._id} />
              <div className={styles.userInfoUser}>
                <p className={styles.userNameUser}>{receiver.name}</p>
                <p className={styles.userHandleUser}>@{receiver.username}</p>
              </div>
            </div>
            <div>
              {messages[room]?.data.map((msg, idx) => (
                <NewMessage message={msg} key={msg._id}/>
              ))}
            </div>
            <div className={styles.sendMsg}>
              <MessageForm 
                placeholder="Type a message..."
                onSubmit = {sendMessages}
              />
            </div>
          </div>
        ) : (
          <div className={styles.empty}>
            <h1>Wanna chat?</h1>
            <p>
              Select a message to keep connected with others...
            </p>
          </div>
        )}
    </div>
  );
};

export default MessageView;
