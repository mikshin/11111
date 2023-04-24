import Dexie from "dexie";
let version = 4;
export const db = new Dexie("myDatabase");
db.version(version).stores({
  stop: "++id, data, file",
  user: "++id, token, data",
  stopCardFields: "++id, data"
});