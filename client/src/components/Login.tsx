import axios from "axios";
import React, { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5050";

export default function Login({
  setAuthToken,
}: {
  setAuthToken: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>();
  const [register, setRegister] = useState<boolean>(false);

  const handleLogin: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    axios
      .post(`${API_URL}/auth/login`, {
        username,
        password,
      })
      .then((response) => {
        const token: string = response.data;
        setAuthToken(token);
      })
      .catch((error) => {
        console.error(error);
        setError(
          "Could not log you in, please make sure you put the correct credentials."
        );
      });
  };

  const handleRegister: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    axios
      .post(`${API_URL}/auth/register`, {
        username,
        password,
        email,
      })
      .then((response) => {
        if (response.status === 201) handleLogin(e);
      })
      .catch((error) => {
        console.error(error);
        setError("Could not register your account.");
      });
  };

  return (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        textAlign: "start",
        alignItems: "center",
      }}
      onSubmit={register ? handleRegister : handleLogin}
    >
      <h1 style={{ fontSize: "1.5rem", textAlign: "center" }}>
        {register ? "Welcome to the Wild Chat!" : "Welcome back!"}
      </h1>
      <label htmlFor="username">Username:</label>
      <input
        type="text"
        name="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      {register && (
        <>
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </>
      )}
      <label htmlFor="password">Password:</label>
      <input
        type="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      {error != null && <p style={{ color: "#EE2222" }}>{error}</p>}

      <button style={{ backgroundColor: "#CCEEFF" }} type="submit">
        {register ? "Register!" : "Login!"}
      </button>
      <button
        style={{
          color: "#222222",
          backgroundColor: "transparent",
          fontSize: ".8rem",
        }}
        type="button"
        onClick={(e) => setRegister(!register)}
      >
        {register ? "Already registered? Login here." : "New? Register here..."}
      </button>
    </form>
  );
}
