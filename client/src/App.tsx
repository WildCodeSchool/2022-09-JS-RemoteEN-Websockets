import { FormEventHandler, useEffect, useState } from "react";
import socketIOclient, { Socket } from "socket.io-client";
import "./App.css";

function App() {
  const [messageList, setMessageList] = useState([]);
  const [nickName, setNickName] = useState("");
  const [newMessageText, setNewMessageText] = useState("");
  const [socket, setSocket] = useState<Socket<any, any>>();

  useEffect(() => {
    setSocket(socketIOclient("http://localhost:5050"));
    return () => {
      socket?.close();
      setSocket(undefined);
    }
  }, [])

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
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
