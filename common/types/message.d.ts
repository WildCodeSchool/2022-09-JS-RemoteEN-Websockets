export declare interface Message {
  id: string;
  author: string;
  text: string;
}

export declare type MessageDraft = Omit<Message, "id">;
