const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // you can restrict this to your frontend URL later
    methods: ["GET", "POST"]
  }
});

app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "Socket.IO server is running!" });
});

io.on("connection", (socket) => {
  console.log("✅ A user connected:", socket.id);

  socket.on("message", (data) => {
    console.log("📨 Message received:", data);

    // Broadcast to all other clients
    socket.broadcast.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ A user disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
