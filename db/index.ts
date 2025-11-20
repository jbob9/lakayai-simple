import Dexie from "dexie";

const db = new Dexie("DB");

export type Chat = {
  id: string;
  title: string;
  createdAt: Date;
};

export type Message = {
  id: string;
  chatId: string;
  content: string;
  createdAt: Date;
};

// Declare tables, IDs and indexes
db.version(1).stores({
  chat: "++id, title, createdAt",
  message: "++id, content, chatId, createdAt",
});

export const createChat = ({
  id,
  message,
}: {
  id: string;
  message: string;
}) => {
  
};
