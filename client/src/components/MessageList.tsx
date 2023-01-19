import { Message } from "common/types/message";
import React, { useContext, useEffect, useState } from "react";
import { SocketIOContext } from "../context/SocketIOContext";
import MessageComponent from "./Message";

export default function MessageList() {
  const [messageList, setMessageList] = useState<Message[]>([]);

  const socket = useContext(SocketIOContext);

  useEffect(() => {
    if (socket == null) return;
    // Next we register our listeners on the newly created socket
    console.log("Registering listeners...");
    socket.on("initialMessageList", (messages: Message[]) => {
      setMessageList(messages);
    });
    socket.on("newMessageBroadcast", (message: Message) => {
      setMessageList((prevState) => [...prevState, message]);
    });
    return () => {
      console.log("Deregistering listeners...");
      socket.off("initialMessageList");
      socket.off("newMessageBroadcast");
    };
  }, []);

  return (
    <div>
      <h2>Messages</h2>
      {messageList.map((message) => (
        <MessageComponent message={message} />
      ))}
    </div>
  );
}
