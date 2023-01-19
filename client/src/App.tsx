import { FormEventHandler, useEffect, useRef, useState } from "react";
import socketIOclient, { Socket } from "socket.io-client";
import "./App.css";

function App() {
  const [messageList, setMessageList] = useState<any[]>([]);
  const [nickName, setNickName] = useState("");
  const [newMessageText, setNewMessageText] = useState("");

  // Keeping a mutable reference to our socket available
  const socketRef = useRef<Socket | null>(null);

  // We make sure to initialize that socket and listeners for it once.
  useEffect(() => {
    // If our socket exists we don't do anything
    if (socketRef.current != null) return;
    // If it does not exist we initialize it to a new socket.io client
    socketRef.current = socketIOclient("http://localhost:5050");
    // Next we register our listeners on the newly created socket
    console.log("Registering listeners...");
    socketRef.current.on("initialMessageList", (messages: any[]) => {
      setMessageList(messages);
    });
    socketRef.current.on("newMessageBroadcast", (message: any) => {
      setMessageList((prevState) => [...prevState, message]);
    });
  }, []);

  // Handle submission of a new message
  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (socketRef.current == null) return;
    // Send new message to the websocket server
    socketRef.current.emit("messageFromClient", {
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
