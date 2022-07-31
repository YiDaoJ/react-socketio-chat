import React from 'react'
import './style.css'


interface RoomEntryProps {
  joinRoom(): void
  setRoom(roomNr: string): void
  setUsername(name: string): void
}

export const RoomEntry: React.FC<RoomEntryProps> = ({setRoom, setUsername, joinRoom}) => {
  return (
    <div className='room-entry__container'>
      <h2>Join Chat</h2>
      <div className='room-entry__form'>
        <input type="text" placeholder="Please enter your username" onChange={event => setUsername(event.target.value)} />
        <input type="text" placeholder="Please enter Room-ID" onChange={event => setRoom(event.target.value)} />
        <button onClick={joinRoom}>Join a room</button>
      </div>
    </div>
  )
}