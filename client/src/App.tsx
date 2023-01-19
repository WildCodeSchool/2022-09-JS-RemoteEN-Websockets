import { FormEventHandler, useEffect, useRef, useState } from "react";
import socketIOclient, { Socket } from "socket.io-client";
import { Message, MessageDraft } from "common/types/message";
import "./App.css";
import MessageList from "./components/MessageList";
import MessageEditor from "./components/MessageEditor";
import { SocketIOContext } from "./context/SocketIOContext";

const socket = socketIOclient("http://localhost:5050");

function App() {
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
