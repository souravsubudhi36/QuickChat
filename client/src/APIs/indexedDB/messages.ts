import {
  ISocketMessage,
  ILocalMessage
} from "../../components/App/CurrentConversation/types";
import { getUsername, DBNumber, messagesToGet, CONVERSATION } from "./init";

export const getDataFromCache = (conversation: string, cursor?: number) => {
  const promise: Promise<
    false | { messages: ILocalMessage[]; cursor: number }
  > = new Promise((resolve, reject) => {
    if (!window.indexedDB) return resolve(false);
    const userName = getUsername();
    if (!userName) return resolve(false);
    const dbName = userName + conversation + "DB";

    let db: IDBDatabase;
    let request = window.indexedDB.open(dbName, DBNumber);

    request.onerror = event => {
      return resolve(false);
    };

    request.onupgradeneeded = event => {
      db = request.result;
      if (!db.objectStoreNames.contains(CONVERSATION))
        db.createObjectStore(CONVERSATION, {
          autoIncrement: true
        });
    };

    request.onsuccess = event => {
      db = request.result;

      db.onerror = event => {
        return resolve(false);
      };

      getData();
    };

    const getData = () => {
      let transaction = db
        .transaction([CONVERSATION], "readonly")
        .objectStore(CONVERSATION);
      let req: IDBRequest<IDBCursorWithValue | null>;

      if (cursor) {
        // continue cursor
        req = transaction.openCursor(
          IDBKeyRange.upperBound(cursor, true),
          "prev"
        );
      } else {
        // start from newest entries
        req = transaction.openCursor(undefined, "prev");
      }

      req.onerror = e => {
        return resolve(false);
      };
      let count = 0;
      const messages: ILocalMessage[] = [];
      let Icursor = 0;
      req.onsuccess = e => {
        if (req.result && count < messagesToGet) {
          const cursor = req.result;

          messages.push({
            from: cursor.value.from,
            payload: cursor.value.payload,
            to: cursor.value.to
          });
          Icursor = cursor.key as number;
          count++;
          cursor.continue();
        } else {
          return resolve({ messages, cursor: Icursor });
        }
      };
    };
  });

  return promise;
};

export const addMessageToCache = (
  message: ISocketMessage
): Promise<boolean> => {
  const promise: Promise<boolean> = new Promise((resolve, reject) => {
    if (!window.indexedDB) return resolve(false);
    const userName = getUsername();
    if (!userName) return resolve(false);

    const dbName = userName + message.to + "DB";
    let request = window.indexedDB.open(dbName, DBNumber);
    let db: IDBDatabase;

    request.onerror = event => {
      return resolve(false);
    };

    request.onupgradeneeded = event => {
      db = request.result;
      if (!db.objectStoreNames.contains(CONVERSATION))
        db.createObjectStore(CONVERSATION, {
          autoIncrement: true
        });
    };

    request.onsuccess = event => {
      db = request.result;

      db.onerror = event => {
        return resolve(false);
      };

      addData();
    };

    const addData = () => {
      const transaction = db
        .transaction([CONVERSATION], "readwrite")
        .objectStore(CONVERSATION);

      const req = transaction.put({
        from: message.from,
        payload: message.payload
      });

      req.onerror = event => {
        return resolve(false);
      };

      req.onsuccess = event => {
        return resolve(true);
      };
    };
  });

  return promise;
};
