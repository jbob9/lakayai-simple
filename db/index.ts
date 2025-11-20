import Dexie from "dexie";

const db = new Dexie('DB');

export type Chat = {
  id: string;
  title: string;
  messages: unknown;
  createdAt: Date
}

// Declare tables, IDs and indexes
db.version(1).stores({
  friends: '++id, name, age'
});