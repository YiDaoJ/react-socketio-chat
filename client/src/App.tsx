import React, { useState } from "react";
import "./App.css";
import viteLogo from "/vite.svg";
import io from "socket.io-client";
import Chat from "./components/Chat";
import { RoomEntry } from "./components/RoomEntry";

const socket = io("http://localhost:3005");

const App: React.FC = () => {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username && room) {
      socket.emit("join_room", { room });
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      {!showChat ? (
        <RoomEntry
          joinRoom={joinRoom}
          setRoom={setRoom}
          setUsername={setUsername}
        />
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
};

export default App;
