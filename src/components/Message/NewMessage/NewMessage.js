import { useSession } from 'next-auth/react';
import React from 'react'

const NewMessage = ({message}) => {
    const {session} = useSession();
  return (
    <div>
        <div className={session?.user._id === message.sender ? styles.myMsg : styles.otherMsg}>
          <div className= {`${styles.msg}`}>{message?.content?.text}</div>
          <div className={`${styles.label}`}>{message.seen? 'seen' : 'sent'}</div>
        </div>
    </div>
  )
}

export default NewMessage;