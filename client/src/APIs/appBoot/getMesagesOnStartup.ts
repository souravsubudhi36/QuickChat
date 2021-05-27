import {
  getConversationDataFromCache,
  getUnreadsinCache
} from "../indexedDB/conversationData";
import store from "../../store";
import {
  SyncAllConversations,
  UpdateParticipants,
  UpdateUnreadsAction
} from "../../modules/app/conversation/actionCreator";
import Axios from "axios";
import { ISocketMessage } from "../../components/App/CurrentConversation/types";
import { appendMessage } from "../handleRelay/newMessage";
import { createLocalconversation } from "../handleRelay/newConversation";
import {
  addToConversation,
  removeFromConversation,
  removeSelf
} from "../handleRelay/editConversation";

export const updateUnreads = async () => {
  const data = await getUnreadsinCache();
  if (data) {
    const temp: { [x: string]: number } = {};
    data.forEach(dat => {
      temp[dat.keyPath] = dat.unread;
    });
    store.dispatch(UpdateUnreadsAction(temp));
  }
};

export const getMessagesFromCache = async () => {
  const data = await getConversationDataFromCache();
  console.log(data);
  if (data) {
    store.dispatch(SyncAllConversations(data.orderInfo));
    store.dispatch(UpdateParticipants(data.participantInfo));
  } else {
    return;
  }
};

const getToken = () => {
  return store.getState().authenticationState.token as string;
};

export const getMessagesFromQueue = async () => {
  const data = await Axios.get("/api/queue", {
    headers: {
      authorization: getToken()
    }
  });

  let parsedData: any[] = [];
  data.data.forEach((str: string) => {
    parsedData.push(JSON.parse(str));
  });
  parsedData.forEach(
    (
      message:
        | ISocketMessage
        | { conversation: string; participants: string[] }
        | { user: string; conversation: string; add: boolean }
    ) => {
      //@ts-ignore
      if (message && message.participants !== undefined) {
        // handle message
        //@ts-ignore
        createLocalconversation(message.conversation, message.participants);
        //@ts-ignore
      } else if (message && message.add !== undefined) {
        console.log(message);
        //@ts-ignore
        if (message.add) {
          //@ts-ignore
          addToConversation(message.user, message.conversation);
        } else {
          //@ts-ignore
          removeFromConversation(message.user, message.conversation);
        }
        //@ts-ignore
      } else if (message && message.removed != undefined) {
        //@ts-ignore
        removeSelf(message.conversation);
      } else {
        appendMessage(message as ISocketMessage);
      }
    }
  );
};
