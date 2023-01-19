import crypto from "crypto";
import { User } from "common/types/user";

export const users: User[] = [
  {
    id: crypto.randomUUID(),
    username: "davidmc971",
    email: "david.pfeiffer971@gmail.com",
    // wilder123
    hashedPassword: "$argon2id$v=19$m=65536,t=3,p=4$dsV71TBi2UuVBiHrraZ8Iw$utTMVAmmFJwPs+Vi4Ev5CM7iPEO3hc9VFA9/V29qlec"
  }
];