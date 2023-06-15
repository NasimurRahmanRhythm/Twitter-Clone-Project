import { useSession } from "next-auth/react";
import styles from "./MessageBubble.module.css";
import { getDateFormatString } from "@/participated/libs/getDateString";
export function MessageBubble({ classname, style, message }) {
  const { data: session } = useSession();
  return (
    <div
      className={`${classname} ${styles.msgBubble} MessageBubble`}
      style={style}
    >
      <div
        className={
          session?.user.id === message.sender ? styles.myMsg : styles.otherMsg
        }
      >
        <div className={`${styles.msg}`}>{message?.content?.text}</div>
        <div className={`${styles.label}`}>
          {getDateFormatString(message.createdAt || Date.now())} |{" "}
          {message.seen ? "seen" : "sent"}
        </div>
      </div>
    </div>
  );
}
