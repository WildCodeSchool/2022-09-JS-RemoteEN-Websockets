import { FormEventHandler, useEffect, useRef, useState } from "react";
import socketIOclient, { Socket } from "socket.io-client";
import axios from "axios";
import { Message, MessageDraft } from "common/types/message";
import "./App.css";
import MessageList from "./components/MessageList";
import MessageEditor from "./components/MessageEditor";
import { SocketIOContext } from "./context/SocketIOContext";
import Login from "./components/Login";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5050";

const socket = socketIOclient(API_URL, {
  autoConnect: false,
  auth: (cb) => {
    console.log("auth callback");
    cb({ token: localStorage.getItem("auth_token") });
  },
});

type LoginState = "LOADING" | "LOGGED_IN" | "LOGGED_OUT";

function App() {
  const [loginState, setLoginState] = useState<LoginState>("LOADING");

  const [authToken, setAuthToken] = useState(
    localStorage.getItem("auth_token")
  );

  useEffect(() => {
    if (authToken == null) {
      setLoginState("LOGGED_OUT");
      return;
    }
    if (localStorage.getItem("auth_token") !== authToken) {
      console.log("Setting token in localStorage");
      localStorage.setItem("auth_token", authToken);
    }
    setLoginState("LOGGED_IN");
    console.log("Connecting socket");
    socket.connect();
    return () => {
      console.log("Disconnecting socket");
      socket.disconnect();
    };
  }, [authToken]);

  useEffect(() => {
    if (socket == null) return;
    // Next we register our listeners on the newly created socket
    console.log("App: Registering listeners...");
    socket.on("errorInvalidToken", () => {
      handleLogout();
    });
    return () => {
      console.log("App: Deregistering listeners...");
      socket.off("errorInvalidToken");
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    setAuthToken(null);
  };

  return (
    <SocketIOContext.Provider value={socket}>
      <div className="App">
        {loginState === "LOADING" ? (
          <p>Loading...</p>
        ) : loginState === "LOGGED_OUT" ? (
          <Login setAuthToken={setAuthToken} />
        ) : (
          <>
            <MessageList />
            <MessageEditor />
            <br />
            <button
              style={{ backgroundColor: "transparent", color: "#222222" }}
              type="button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </SocketIOContext.Provider>
  );
}

export default App;
