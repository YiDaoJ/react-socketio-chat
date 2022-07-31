const express = require("express")
const cors = require("cors")
const http = require('http')
const { Server } = require("socket.io")


const app = express()

app.use(cors());

const server = http.createServer(app);

// 1. param server: connect socketio server with the created express server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // react app url
    methods: ["GET", "POST"]
  }
})


// based on events, omit event and listen to it
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`)

  socket.on("join_room", (data) => {
    socket.join(data.room)
    console.log(`User with ID: ${socket.id} joined room: ${data.room}` )
  })

  socket.on("send_message", (data) => {
    console.log("send_message: ", data);
    socket.to(data.room).emit("receive_message", data)
  })

  // disconnect from server
  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id)
  })
})



server.listen(3005, () => {
  console.log("Server is running at 3005")
})