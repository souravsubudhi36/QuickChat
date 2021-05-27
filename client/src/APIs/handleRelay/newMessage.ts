import {
  ISocketMessage,
  ILocalMessage
} from "../../components/App/CurrentConversation/types";
import socket from "../../socket";
import { TRANSFER_MESSAGE } from "../../Constants/socketTypes";
import store from "../../store";
import {
  AddNewMessageAction,
  UpdateUnreadsAction,
  UpdateParticipants
} from "../../modules/app/conversation/actionCreator";
import { addMessageToCache } from "../indexedDB/messages";
import {
  updateOrderInCache,
  updateParticipantInfoInCache,
  updateUnreadsinCache
} from "../indexedDB/conversationData";
import { UpdateOrderInCacheTypes } from "../indexedDB/init";

const getAllConv = () => {
  return store.getState().app.conversation.allConversations;
};

const getParticipants = () => {
  return store.getState().app.conversation.participantInfo;
};

const handleUnreadIncrement = (conv: string) => {
  const state = store.getState();
  if (state.app.conversation.activeConversation === conv) return;
  const currentCount = state.app.conversation.unreads[conv] || 0;
  console.log("UODATING", currentCount + 1);
  store.dispatch(
    UpdateUnreadsAction({
      [conv]: currentCount + 1
    })
  );
  updateUnreadsinCache(conv, currentCount + 1);
};

export const appendMessage = async (data: ISocketMessage) => {
  //sync to cache
  const allConv = getAllConv();
  if (!allConv || (allConv && allConv.indexOf(data.to) === -1)) {
    await updateOrderInCache(data.to, UpdateOrderInCacheTypes.add);
    await updateParticipantInfoInCache(data.to, data.recipients);
    // update in redux
    const newPart = {
      ...getParticipants()
    };
    newPart[data.to] = data.recipients;
    store.dispatch(UpdateParticipants(newPart));
  }

  console.log(data);
  addMessageToCache(data);

  updateOrderInCache(data.to, UpdateOrderInCacheTypes.sendToFront);
  handleUnreadIncrement(data.to);

  // sync to state
  const payload: ILocalMessage = {
    from: data.from,
    payload: data.payload,
    to: data.to
  };
  store.dispatch(AddNewMessageAction(payload));
};

export const sendMessage = (data: ISocketMessage) => {
  if (!socket) return;

  socket.emit(TRANSFER_MESSAGE, data);
  appendMessage(data);
};
