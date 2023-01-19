import { MessageDraft } from 'common/types/message';
import React, { FormEventHandler, useContext, useState } from 'react'
import { SocketIOContext } from '../context/SocketIOContext';

export default function MessageEditor() {
  const [nickName, setNickName] = useState("");
  const [newMessageText, setNewMessageText] = useState("");

  const socket = useContext(SocketIOContext);

  // Handle submission of a new message
  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (socket == null) return;
    // Send new message to the websocket server
    const newMessage: MessageDraft = {
      text: newMessageText,
      author: nickName,
    };
    socket.emit("messageFromClient", newMessage);
    // Clear out message input box after sending
    setNewMessageText("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>New Message</h2>
        <input
          type="text"
          name="author"
          placeholder="nickname"
          value={nickName}
          required
          onChange={(e) => setNickName(e.target.value)}
        />
        <input
          type="text"
          name="messageContent"
          placeholder="message"
          value={newMessageText}
          required
          onChange={(e) => setNewMessageText(e.target.value)}
        />
        <input type="submit" value="send" />
      </form>
    </div>
  )
}
