import express from "express";
import cors from "cors";
import crypto from "crypto";
import { createServer } from "http";
import { Server as WebSocketServer } from "socket.io";

const app = express();

const corsOrigin = "http://localhost:5173";

app.use(
  cors({
    origin: corsOrigin,
  })
);

const server = createServer(app);

const websocket = new WebSocketServer(server, {
  cors: {
    origin: corsOrigin,
  },
});

const messages = [
  {
    id: crypto.randomUUID(),
    author: "server",
    text: "Welcome to the Wild Chat!",
  },
];

websocket.on("connection", (clientSocket) => {
  console.log("User connected.");
  clientSocket.on("disconnect", () => {
    console.log("User disconnected.");
  });

  clientSocket.emit("initialMessageList", messages);
  clientSocket.on("messageFromClient", (messageTextAndAuthor) => {
    const newMessage = {
      ...messageTextAndAuthor,
      id: crypto.randomUUID(),
    };
    console.log("New message from client:", newMessage);
    messages.push(newMessage);
    websocket.emit("newMessageBroadcast", newMessage);
  });
});

server.listen(5050);
