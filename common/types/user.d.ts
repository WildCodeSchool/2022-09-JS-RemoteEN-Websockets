export declare interface User {
  id: number | string;
  username: string;
  email: string;
  hashedPassword: string;
}

export declare type UserDraft = Omit<User, "hashedPassword" | "id"> & {
  password: string;
};

export declare type UserView = Omit<User, "hashedPassword">;
