import Dexie from "dexie";

const db = new Dexie('DB');

// Declare tables, IDs and indexes
db.version(1).stores({
  friends: '++id, name, age'
});