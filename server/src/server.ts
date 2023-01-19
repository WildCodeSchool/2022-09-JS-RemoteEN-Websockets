import express from "express";
import cors from "cors";
import crypto from "crypto";
import { createServer } from "http";
import { Server as WebSocketServer } from "socket.io";
import { Message, MessageDraft } from "common/types/message";
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window as any);

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

const messages: Message[] = [
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
  clientSocket.on("messageFromClient", (messageTextAndAuthor: MessageDraft) => {
    const newMessage: Message = {
      author: DOMPurify.sanitize(messageTextAndAuthor.author, {
        ALLOWED_TAGS: [],
      }),
      text: DOMPurify.sanitize(messageTextAndAuthor.text, {
        ALLOWED_TAGS: ["b"],
      }),
      id: crypto.randomUUID(),
    };
    console.log("New message from client:", newMessage);
    messages.push(newMessage);
    websocket.emit("newMessageBroadcast", newMessage);
  });
});

server.listen(5050);
