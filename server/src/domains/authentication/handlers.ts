import { RequestHandler } from "express";
import { createUser, findUserByUsername } from "./model";
import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import { UserDraft } from "common/types/user";

export interface LoginUserRequestBody {
  username: string;
  password: string;
}

export const loginUser: RequestHandler<{}, {}, LoginUserRequestBody> = async (
  req,
  res
) => {
  const { username, password } = req.body;

  if (username == null || password == null) {
    res.status(403).send("Incomplete credentials.");
    return;
  }

  const user = await findUserByUsername(username);

  if (user == null) {
    res.status(403).send("Wrong credentials.");
    return;
  }

  argon2
    .verify(user.hashedPassword, password)
    .then((isCorrect) => {
      if (!isCorrect) {
        res.status(403).send("Wrong credentials.");
        return;
      }
      const token = jwt.sign(
        {
          sub: user.username,
        },
        process.env.JWT_SECRET!,
        {
          expiresIn: "2d",
        }
      );
      res.json(token);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

export type RegisterUserRequestBody = UserDraft;

export const registerUser: RequestHandler<{}, {}, RegisterUserRequestBody> = (
  req,
  res
) => {
  createUser(req.body)
    .then((user) => {
      console.log("User created:", user);
      res.sendStatus(201);
    })
    .catch((error) => {
      console.error("Failure while creating user:", error);
      res.sendStatus(500);
    });
};
