import { FormEventHandler, useEffect, useRef, useState } from "react";
import socketIOclient, { Socket } from "socket.io-client";
import axios from "axios";
import { Message, MessageDraft } from "common/types/message";
import "./App.css";
import MessageList from "./components/MessageList";
import MessageEditor from "./components/MessageEditor";
import { SocketIOContext } from "./context/SocketIOContext";

const API_URL = "http://localhost:5050";

const socket = socketIOclient(API_URL, {
  autoConnect: false,
  auth: (cb) => {
    console.log("auth callback");
    cb({ token: localStorage.getItem("auth_token") });
  },
});

function App() {
  const [authToken, setAuthToken] = useState(
    localStorage.getItem("auth_token")
  );

  useEffect(() => {
    if (authToken == null) {
      console.log("Requesting token");
      axios
        .post(API_URL + "/auth/login", {
          username: "davidmc971",
          password: "wilder123",
        })
        .then((response) => response.data)
        .then((data) => {
          console.log("Setting token state");
          setAuthToken(data);
        });
      return;
    }
    if (localStorage.getItem("auth_token") !== authToken) {
      console.log("Setting token in localStorage");
      localStorage.setItem("auth_token", authToken);
    }
    console.log("Connecting socket");
    socket.connect();
    return () => {
      console.log("Disconnecting socket");
      socket.disconnect();
    }
  }, [authToken]);

  return (
    <SocketIOContext.Provider value={socket}>
      <div className="App">
        <MessageList />
        <MessageEditor />
      </div>
    </SocketIOContext.Provider>
  );
}

export default App;
