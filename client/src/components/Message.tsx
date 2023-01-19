import { Message as MessageType } from "common/types/message";
import React from "react";

export default function Message({ message }: { message: MessageType }) {
  return (
    <div key={message.id}>
      <span>{message.author}: </span>
      <span dangerouslySetInnerHTML={{ __html: message.text }}></span>
    </div>
  );
}
