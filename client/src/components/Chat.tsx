import React, { useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'

interface ChatProps {
  socket: Socket,
  room: string,
  username: string 
}

interface MessageDataProps {
  room: string,
  username: string,
  message: string,
  time: string
}

const Chat: React.FC<ChatProps> = ({socket, room, username}) =>{

  const [currentMsg, setCurrentMsg] = useState("")
  const [msgList, setMsgList] = useState<MessageDataProps[]>([])

  const sendMessage = async () => {
    if(currentMsg) {
      const msgData: MessageDataProps = {
        room,
        username,
        message: currentMsg,
        time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
      }

      await socket.emit("send_message", msgData)
    }
  }

  useEffect(() => {
    socket.on("receive_message", (data: MessageDataProps) => {
      console.log('data: ', data)
      setMsgList((list) => [...list, data])
    })
  }, [socket])

  return (
    <div>
      <div className='chat-header'>
        <p>{`Live Chat Root ${room}`}</p>
      </div>
      <div className='chat-body'>
        {
          msgList.map((msg, index) => (
            <div key={index}>{msg.message}</div>
          ))
        }
      </div>
      <div className='chat-footer'>
        <input type="text" placeholder="type your message here" onChange={(event) => setCurrentMsg(event.target.value)}/>
        <button onClick={sendMessage}>▶️</button>
      </div>
    </div>
  )
}

export default Chat
