import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "@/styles/message.module.css";
import Header from "@/components/Header/Header";
import Avatar from "@/components/Avatar/Avatar";
import { useRouter } from "next/router";
import Link from "next/link";
import connectToDB from "@/libs/mongooseDB";
import {
  deleteMessageNotification,
  getAllConversationsByUser,
  takeAllUsers,
} from "@/libs/services/messageServices";
import { useSession } from "next-auth/react";
import { messageActions } from "@/actions/message.actions";
import NewMessage from "@/components/Message/NewMessage/NewMessage";
import MessageForm from "@/components/Message/MessageForm/MessageForm";
import { AuthOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { useMessages } from "@/hooks/useMessage";
import ImageUpload from "@/components/ImageUpload/ImageUpload";
import { RxCross2 } from "react-icons/rx";
import { AiOutlineSend } from "react-icons/ai";
import { BiBadge } from "react-icons/bi";
import { BsDot } from "react-icons/bs";
import useLoader from "@/hooks/useLoader";

export async function getServerSideProps(ctx) {
  await connectToDB();
  const { user } = await getServerSession(ctx.req, ctx.res, AuthOptions);
  console.log("Usersssss is ", user);
  console.log("User isss", user);
  const { room } = await ctx.query;
  let receiver;
  let users = takeAllUsers().then((result) => {
    result = result.filter((u) => u._id.toString() !== user?._id.toString());
    if (room) {
      receiver = result.reduce(
        (access, currrent) =>
          currrent._id.toString() === room ? currrent : access,
        undefined
      );
    }

    return Promise.resolve(result);
  });

  let messages = Promise.resolve([]);
  if (room) {
    const receiverId = room;
    deleteMessageNotification({
      userId: user._id,
      notificationSenderId: receiverId,
    });

    messages = getAllConversationsByUser({
      userId: user._id,
      receiverID: receiverId,
      pageIndex: 1,
      pageSize: 14,
    });
  }

  const [usersResult, messagesResult] = await Promise.all([users, messages]);

  const io = ctx.res.socket.server.io;
  if (io && receiver) {
    io.to(room).emit("message_seen", { userId: user._id });
  }

  return {
    props: JSON.parse(
      JSON.stringify({
        users: usersResult,
        previousMessages: messagesResult,
        receiver: receiver,
        currentUser: user,
      })
    ),
  };
}

const MessageView = ({ users, previousMessages, receiver, currentUser }) => {
  const router = useRouter();
  const { room } = router.query;
  const { data: session } = useSession();
  console.log("currentUSersssssssss isss ", currentUser._id);
  const [text, setText] = useState();
  const [image, setImage] = useState();
  //const mainUserss = takeAllUsers();
  // setMainUsers(takeAllUsers());
  const { messages, messageNotifications, chatUsers, dispatch } = useMessages();

  // console.log("messages is "+ messages + "messageNotifications " + messageNotifications, "chatUsers " + chatUsers, "dispatch " + dispatch);

  const loaderRef = useRef();
  const loader = !!useLoader(loaderRef, {})
    ?.isIntersecting;
  
    console.log("loader is ",loader);
  useEffect(() => {
    if (loader) {
      dispatch(messageActions.FETCH_USER_MESSEGES, { userId: receiver._id });
    }
  }, [loader]);

  useEffect(() => {
    (async () => {
      if (receiver?._id) {
        await dispatch(messageActions.SET_USER_MESSAGES, {
          userId: receiver._id,
          messages: previousMessages,
        });
        console.log("previous messages is ", messages);
      }
      await dispatch(messageActions.SET_USERS, users);
    })();
  }, []);

  const sendMessages = () => {
    console.log("Sendd MEssagessss bair theke   ");
    if (text) {
      console.log("Send Messages ");
      dispatch(messageActions.SEND_MESSAGES, {
        message: {
          content: { text },
          sender: currentUser._id,
          receiver: room,
        },
        room: room,
      });
      setText("");
    }
  };
  const firstMessage = messages[room]?.data[0];
  console.log("Message Notification is ", messageNotifications);
  return (
    <div className={styles.messageContainer}>
      <div className={styles.userList}>
        <div className={styles.userBoxHeader}>
          <div className={styles.userBoxHeaderOptionsAndText}>
            <Header showBackArrow label="Your Messages" />
          </div>
        </div>
        {chatUsers?.map((user) => (
          <div
            className={`${styles.user} ${
              room === user._id ? styles.selected : ""
            }`}
            key={user._id}
          >
            <Link
              key={user._id}
              href={{ pathname: "/message", query: { room: user._id } }}
            >
              <div
                key={user._id}
                className={
                  messageNotifications.has(user._id)
                    ? styles.userUser1
                    : styles.userUser
                }
              >
                {messageNotifications.has(user._id) ? (
                  <BsDot size={40} />
                ) : null}
                <Avatar userId={user._id} />
                <div className={styles.userInfoUser}>
                  <p
                    key={user._id}
                    className={
                      messageNotifications.has(user._id)
                        ? styles.useNameUser1
                        : styles.userNameUser
                    }
                  >
                    {user.name}
                  </p>
                  <p
                    className={
                      messageNotifications.has(user._id)
                        ? styles.userHandleUser1
                        : styles.userHandleUser
                    }
                  >
                    @{user.username}
                  </p>
                </div>
              </div>{" "}
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
              <NewMessage message={msg} key={msg._id} isComment={idx === 0} />
            ))}
            <div className={styles.loading}>
              {!messages[room]?.isLastPage && (
                <div ref={loaderRef} className={styles.loader}></div>
              )}
            </div>
          </div>
          <div className={styles.sendMsg}>
            <div className={styles.message}>
              <Avatar userId={currentUser._id} />
              <div className={styles.fields}>
                <textarea
                  placeholder="Type a message..."
                  className={styles.textarea}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                ></textarea>
                {image && image !== "undefined" && (
                  <div className={styles.image}>
                    <img src={image} alt="img" />
                    <button onClick={() => setImage(undefined)}>
                      <RxCross2 />
                    </button>
                  </div>
                )}
              </div>
              <div className={styles.actions}>
                {/* <div className={styles.attachment}>
                    <ImageUpload
                      onChange={(image) => setImage(image)}
                    />
                  </div> */}
                <button onClick={sendMessages}>
                  <AiOutlineSend size={30} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.empty}>
          <h1>Wanna chat?</h1>
          <p>Select a message to keep connected with others...</p>
        </div>
      )}
    </div>
  );
};

export default MessageView;
