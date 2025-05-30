const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());

// Handle WebSocket connections
wss.on("connection", (ws) => {
  console.log("🔌 New client connected");

  ws.on("message", (message) => {
    console.log("📨 Received:", message);

    // Broadcast to other clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on("close", () => {
    console.log("❌ Client disconnected");
  });
});

// Respond to HTTP requests with deployed URLs
app.get("/", (req, res) => {
  res.json({
    message: "WebSocket server is running!",
    frontend: "https://your-frontend-url.com", // ← Replace this
    websocket: "wss://your-backend-name.onrender.com", // ← Replace this
  });
});

// Start server on Render-compatible port
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
