import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import crypto from "crypto";
import { createServer } from "http";
import { Server as WebSocketServer } from "socket.io";
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import jwt from "jsonwebtoken";

import { Message, MessageDraft } from "common/types/message";
import { User, UserDraft, UserView } from "common/types/user";
import MainRouter from "./mainRouter";
import { users } from "./domains/authentication/model";

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window as any);

const app = express();

const corsOrigin = "http://localhost:5173";

app.use(
  cors({
    origin: corsOrigin,
  })
);

app.use(express.json());

app.use("/", MainRouter);

const server = createServer(app);

const websocket = new WebSocketServer(server, {
  cors: {
    origin: corsOrigin,
  },
});

const messages: Message[] = [];

websocket.on("connection", (clientSocket) => {
  console.log("User connected.");
  clientSocket.on("disconnect", () => {
    console.log("User disconnected.");
  });

  const token: string | undefined = clientSocket.handshake.auth.token;
  if (token == null) {
    console.log("User not authenticated.");
    clientSocket.emit("errorUnauthorized");
    clientSocket.disconnect();
    return;
  }

  const payload = jwt.verify(token, process.env.JWT_SECRET!);
  const user = users.find(
    (user) => user.username.toLowerCase() === payload.sub
  );
  if (user == null) {
    console.log("Invalid credentials.");
    clientSocket.emit("errorUnauthorized");
    clientSocket.disconnect();
    return;
  }

  websocket.emit("newMessageBroadcast", {
    id: crypto.randomUUID(),
    author: "Server",
    text: `<i>${user.username} joined the chat!</i>`,
  });

  clientSocket.on("disconnect", () => {
    websocket.emit("newMessageBroadcast", {
      id: crypto.randomUUID(),
      author: "Server",
      text: `<i>${user.username} disconnected from the chat!</i>`,
    });
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

server.listen(5050, () => console.log("Server listening on port 5050"));
