export declare interface Message {
  id: string;
  author: string;
  text: string;
}

// To read on Omit:
// https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys
export declare type MessageDraft = Omit<Message, "id">;
