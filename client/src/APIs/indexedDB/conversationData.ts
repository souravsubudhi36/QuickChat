import {
  DBNumber,
  orderObjectStore,
  getUsername,
  UpdateOrderInCacheTypes,
  ORDER,
  PARTICIPANTS,
  UNREADS,
  unreadsObjectStore
} from "./init";
import store from "../../store";
import { SyncAllConversations } from "../../modules/app/conversation/actionCreator";

export const getConversationDataFromCache = () => {
  const promise: Promise<
    | false
    | {
        orderInfo: string[];
        participantInfo: { [conversation: string]: string[] };
      }
  > = new Promise((resolve, reject) => {
    if (!window.indexedDB) return resolve(false);
    const userName = getUsername();
    if (!userName) return resolve(false);
    const dbName = userName + orderObjectStore + "DB";
    const keyPath = "keyPath";

    let db: IDBDatabase;
    let request = window.indexedDB.open(dbName, DBNumber);

    request.onerror = event => {
      return resolve(false);
    };

    request.onupgradeneeded = async event => {
      db = request.result;
      if (!db.objectStoreNames.contains(unreadsObjectStore))
        db.createObjectStore(unreadsObjectStore, {
          keyPath
        });
      if (!db.objectStoreNames.contains(orderObjectStore)) {
        db.createObjectStore(orderObjectStore, {
          keyPath
        });
        await updateOrderInCache("Welcome", UpdateOrderInCacheTypes.initialize);
        return resolve({
          orderInfo: [],
          participantInfo: {}
        });
      }
    };

    request.onsuccess = event => {
      db = request.result;

      db.onerror = event => {
        return resolve(false);
      };

      getData();
    };

    const getData = () => {
      const data: {
        orderInfo: string[];
        participantInfo: { [conversation: string]: string[] };
      } = {
        orderInfo: [],
        participantInfo: {}
      };

      let transaction = db
        .transaction([orderObjectStore], "readonly")
        .objectStore(orderObjectStore);

      let req = transaction.openCursor();

      req.onerror = e => {
        return resolve(false);
      };

      req.onsuccess = e => {
        if (req.result) {
          const cursor = req.result;

          if (cursor) {
            if (cursor.value[keyPath] === ORDER) {
              data.orderInfo = cursor.value.data;
            } else {
              data.participantInfo = cursor.value.data;
            }
            cursor.continue();
          }
        } else {
          return resolve(data);
        }
      };
    };
  });

  return promise;
};

export const updateOrderInCache = (
  conversation: string,
  type: UpdateOrderInCacheTypes
) => {
  const promise: Promise<boolean> = new Promise((resolve, reject) => {
    if (!window.indexedDB) return resolve(false);
    const userName = getUsername();
    if (!userName) return resolve(false);
    const dbName = userName + orderObjectStore + "DB";
    const keyPath = "keyPath";

    let db: IDBDatabase;
    let request = window.indexedDB.open(dbName, DBNumber);

    request.onerror = event => {
      return resolve(false);
    };

    request.onupgradeneeded = event => {
      db = request.result;
      if (!db.objectStoreNames.contains(unreadsObjectStore))
        db.createObjectStore(unreadsObjectStore, {
          keyPath
        });
      if (!db.objectStoreNames.contains(orderObjectStore))
        db.createObjectStore(orderObjectStore, {
          keyPath
        });
    };

    request.onsuccess = event => {
      db = request.result;

      db.onerror = event => {
        return resolve(false);
      };
      console.log(2);
      updateData();
    };

    const updateData = () => {
      let transaction = db
        .transaction([orderObjectStore], "readwrite")
        .objectStore(orderObjectStore);

      let req = transaction.get(ORDER);

      req.onerror = e => {
        console.log(1);
        return resolve(false);
      };

      req.onsuccess = e => {
        if (req.result) {
          const order: string[] = req.result.data;
          console.log("RETREICED ORDER", order);
          handleOrdering(order, transaction);
        } else {
          // if (type === UpdateOrderInCacheTypes.initialize) {
          let req = transaction.put({
            [keyPath]: ORDER,
            data: []
          });
          req.onerror = e => {
            return resolve(false);
          };
          req.onsuccess = e => {
            let req2 = transaction.put({
              [keyPath]: PARTICIPANTS,
              data: {}
            });
            return resolve(true);
          };

          // no data present, and not initialize command
          return resolve(false);
        }
      };
    };

    const handleOrdering = (order: string[], transaction: IDBObjectStore) => {
      switch (type) {
        case UpdateOrderInCacheTypes.add:
          order.push(conversation);
          break;
        case UpdateOrderInCacheTypes.delete:
          order.splice(order.indexOf(conversation), 1);
          break;
        case UpdateOrderInCacheTypes.sendToFront:
          order.splice(order.indexOf(conversation), 1);
          order.unshift(conversation);
          break;
        case UpdateOrderInCacheTypes.initialize:
          break;
      }
      if (type === UpdateOrderInCacheTypes.initialize) {
        return resolve(true);
      }
      // updated the order array
      console.log("Updated order", order);
      let req = transaction.put({
        [keyPath]: ORDER,
        data: order
      });
      // update order in redux
      store.dispatch(SyncAllConversations(order));

      req.onerror = e => {
        return resolve(false);
      };

      req.onsuccess = e => {
        return resolve(true);
      };
    };
  });

  return promise;
};

export const updateParticipantInfoInCache = (
  conversation: string,
  participantInfo?: string[]
) => {
  const promise: Promise<boolean> = new Promise((resolve, reject) => {
    if (!window.indexedDB) return resolve(false);
    const userName = getUsername();
    if (!userName) return resolve(false);
    const dbName = userName + orderObjectStore + "DB";
    const keyPath = "keyPath";

    let db: IDBDatabase;
    let request = window.indexedDB.open(dbName, DBNumber);

    request.onerror = event => {
      return resolve(false);
    };

    request.onupgradeneeded = event => {
      db = request.result;
      if (!db.objectStoreNames.contains(unreadsObjectStore))
        db.createObjectStore(unreadsObjectStore, {
          keyPath
        });
      if (!db.objectStoreNames.contains(orderObjectStore))
        db.createObjectStore(orderObjectStore, {
          keyPath
        });
    };

    request.onsuccess = event => {
      db = request.result;

      db.onerror = event => {
        return resolve(false);
      };

      updateData();
    };

    const updateData = () => {
      let transaction = db
        .transaction([orderObjectStore], "readwrite")
        .objectStore(orderObjectStore);

      let req = transaction.get(PARTICIPANTS);

      req.onerror = e => {
        return resolve(false);
      };

      req.onsuccess = e => {
        if (req.result) {
          const partInfo = req.result.data;
          if (participantInfo) {
            partInfo[conversation] = participantInfo;
          } else {
            delete partInfo[conversation];
          }

          let req2 = transaction.put({
            [keyPath]: PARTICIPANTS,
            data: partInfo
          });

          return resolve(true);
        } else {
          updateOrderInCache("Irrelevant", UpdateOrderInCacheTypes.initialize);
        }
      };
    };
  });

  return promise;
};

export const updateUnreadsinCache = (conversation: string, unread: number) => {
  const promise: Promise<boolean> = new Promise((resolve, reject) => {
    if (!window.indexedDB) return resolve(false);
    const userName = getUsername();
    if (!userName) return resolve(false);
    const dbName = userName + orderObjectStore + "DB";
    const keyPath = "keyPath";

    let db: IDBDatabase;
    let request = window.indexedDB.open(dbName, DBNumber);

    request.onerror = event => {
      return resolve(false);
    };

    request.onupgradeneeded = event => {
      db = request.result;
      if (!db.objectStoreNames.contains(unreadsObjectStore))
        db.createObjectStore(unreadsObjectStore, {
          keyPath
        });
      if (!db.objectStoreNames.contains(orderObjectStore))
        db.createObjectStore(orderObjectStore, {
          keyPath
        });
    };

    request.onsuccess = event => {
      db = request.result;

      db.onerror = event => {
        return resolve(false);
      };

      updateData();
    };

    const updateData = () => {
      let transaction = db
        .transaction([unreadsObjectStore], "readwrite")
        .objectStore(unreadsObjectStore);

      let req = transaction.put({
        [keyPath]: conversation,
        unread
      });

      req.onerror = e => {
        return resolve(false);
      };

      req.onsuccess = e => {
        return resolve(true);
      };
    };
  });

  return promise;
};

export const getUnreadsinCache = () => {
  const promise: Promise<
    { keyPath: string; unread: number }[] | false
  > = new Promise((resolve, reject) => {
    if (!window.indexedDB) return resolve(false);
    const userName = getUsername();
    if (!userName) return resolve(false);
    const dbName = userName + orderObjectStore + "DB";
    const keyPath = "keyPath";

    let db: IDBDatabase;
    let request = window.indexedDB.open(dbName, DBNumber);

    request.onerror = event => {
      return resolve(false);
    };

    request.onupgradeneeded = event => {
      db = request.result;
      if (!db.objectStoreNames.contains(unreadsObjectStore))
        db.createObjectStore(unreadsObjectStore, {
          keyPath
        });
    };

    request.onsuccess = event => {
      db = request.result;

      db.onerror = event => {
        return resolve(false);
      };

      updateData();
    };

    const updateData = () => {
      let transaction = db
        .transaction([unreadsObjectStore], "readwrite")
        .objectStore(unreadsObjectStore);

      let req = transaction.getAll();

      req.onerror = e => {
        return resolve(false);
      };

      req.onsuccess = e => {
        if (req.result) {
          return resolve(req.result);
        }
        return resolve(false);
      };
    };
  });

  return promise;
};
