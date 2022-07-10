import React, { useState } from 'react'
import { Socket } from 'socket.io-client'

interface ChatProps {
  socket: Socket,
  room: string,
  username: string 
}

const Chat: React.FC<ChatProps> = ({socket, room, username}) =>{

  const [currentMsg, setCurrentMsg] = useState("")

  const sendMessage = async () => {
    if(currentMsg) {
      const msgData = {
        room,
        username,
        message: currentMsg,
        time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
      }

      await socket.emit("send_message", msgData)
    }
  }

  return (
    <div>
      <div className='chat-header'>
        <p>Live Chat</p>
      </div>
      <div className='chat-body'>

      </div>
      <div className='chat-footer'>
        <input type="text" placeholder="type your message here" onChange={(event) => setCurrentMsg(event.target.value)}/>
        <button onClick={sendMessage}>▶️</button>
      </div>
    </div>
  )
}

export default Chat
