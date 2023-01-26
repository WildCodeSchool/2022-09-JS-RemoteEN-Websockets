import crypto from "crypto";
import { User, UserDraft } from "common/types/user";
import database from "../../database";
import argon2 from "argon2";
import { OkPacket, RowDataPacket } from "mysql2";

export async function findUserByUsername(
  username: string
): Promise<User | undefined> {
  if (username == null) throw Error("username empty");

  const [result] = await database.query<(User & RowDataPacket)[]>(
    "SELECT * FROM users WHERE username = ?",
    [username]
  );

  if (result.length === 0) return undefined;

  return result[0];
}

export async function createUser(user: UserDraft): Promise<User> {
  const { email, username, password } = user;

  if (email == null || username == null || password == null) {
    throw Error("User has one or more fields missing");
  }

  const hashedPassword = await argon2.hash(password);

  const [result] = await database.query<OkPacket>(
    "INSERT INTO users (email, username, hashedPassword) VALUES (?, ?, ?)",
    [email, username, hashedPassword]
  );

  if (result.affectedRows === 0) {
    throw Error("Inserting into database failed.");
  }

  return {
    email,
    hashedPassword,
    username,
    id: result.insertId,
  };
}
