import Dexie, { EntityTable } from "dexie";

export type Chat = {
  id: string;
  title: string;
  createdAt: Date;
};

export type Message = {
  id: string;
  chatId: string;
  role: string;
  parts: unknown;
  createdAt: Date;
};

export const db = new Dexie("DB") as Dexie & {
  chats: EntityTable<Chat, "id">;
  messages: EntityTable<Message, "id">;
};

// Declare tables, IDs and indexes
db.version(1).stores({
  chats: "id, title, createdAt",
  messages: "id, role, parts, chatId, createdAt",
});

export const createChat = async ({ message }: { message: string }) => {
  const res = await fetch("/api/chat/title", {
    method: "POST",
    body: JSON.stringify({ message }),
  });
  const title = res.ok ? (await res.json()).title : "Unknown title";
  await db.chats.add({ title, createdAt: new Date() });

  return title;
};

export const getChat = async (chatId: string) => {
  const [chat, messages] = await Promise.all([
    db.chats.where("id").equals(chatId).first(),
    db.messages.where("chatId").equals(chatId).toArray(),
  ]);
  return { ...chat, messages };
};

export const saveMessages = async (messages: Message[]) => {
  await db.messages.bulkAdd(messages);
};
