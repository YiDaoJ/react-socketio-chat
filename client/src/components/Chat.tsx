import clsx from 'clsx'
import React, { useEffect, useRef, useState } from 'react'
import { Socket } from 'socket.io-client'
import './style.css'

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
  const chatContainer = useRef<HTMLDivElement>(null)

  const sendMessage = async () => {
    if(currentMsg) {
      const msgData: MessageDataProps = {
        room,
        username,
        message: currentMsg,
        time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
      }

      await socket.emit("send_message", msgData)
      setMsgList((list) => [...list, {...msgData}])
      setCurrentMsg("")
      scrollToMyRef()
    }
  }

  // FIXME: twice render
  useEffect(() => {
    socket.on("receive_message", (data: MessageDataProps) => {
      console.log('data: ', data)

      setMsgList((list) => [...list, {...data}])
      scrollToMyRef()
    })
  }, [socket])

  // FIXME: auto scroll
  const scrollToMyRef = () => {
    if(chatContainer.current) {
      const scroll = chatContainer.current.scrollHeight - chatContainer.current.clientHeight;
      chatContainer.current.scrollTo(0, scroll);
    }
  };

  return (
    <div className='chat-page'>
      <div className='chat-window'>
        <div className='chat-header'>
          <h3>{`Live Chat Room ${room}`}</h3>
        </div>

        <div className='chat-body' ref={chatContainer}>
          {
            msgList.map((msg, index) => (
              <div key={index} className={clsx(["message-item", {"message-item--sent": username === msg.username}])}>
                <div className='message-content'>{msg.message}</div>
                <div className='message-state'>
                  <span className='message-state__username'>{msg.username}</span>
                  <span>{msg.time}</span>
                </div>
              </div>
            ))
          }
        </div>

        <div className='chat-footer'>
          <input 
            type="text" 
            placeholder="type your message here" 
            value={currentMsg}
            onChange={(event) => setCurrentMsg(event.target.value)} 
            onKeyDown={(event) => event.key === "Enter" && sendMessage()}/>
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  )
}

export default Chat
