import { FormEventHandler, useEffect, useState } from "react";
import socketIOclient, { Socket } from "socket.io-client";
import "./App.css";

function App() {
  const [messageList, setMessageList] = useState<any[]>([]);
  const [nickName, setNickName] = useState("");
  const [newMessageText, setNewMessageText] = useState("");
  const [socket, setSocket] = useState<Socket<any, any>>();

  useEffect(() => {
    console.log("mount");
    setSocket(socketIOclient("http://localhost:5050"));
    return () => {
      console.log("unmount");
      socket?.disconnect();
      setSocket(undefined);
    };
  }, []);

  useEffect(() => {
    if (socket == null) return;
    socket.on("initialMessageList", (messages: any[]) => {
      setMessageList(messages);
    });
    socket.on("newMessageBroadcast", (message: any) => {
      setMessageList((prevState) => [...prevState, message]);
    })
  }, [socket]);

  // Handle submission of a new message
  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (socket == null) return;
    // Send new message to the websocket server
    socket.emit("messageFromClient", {
      text: newMessageText,
      author: nickName,
    });
    // Clear out message input box after sending
    setNewMessageText("");
  };

  return (
    <div className="App">
      <h2>Messages</h2>
      {messageList.map((message) => {
        return (
          <div key={message.id}>
            {message.author} : {message.text}
          </div>
        );
      })}

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
  );
}

export default App;
