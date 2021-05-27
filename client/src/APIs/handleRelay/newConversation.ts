import { addMessageToCache } from "../indexedDB/messages";
import {
  updateOrderInCache,
  updateParticipantInfoInCache
} from "../indexedDB/conversationData";
import { UpdateOrderInCacheTypes } from "../indexedDB/init";
import store from "../../store";
import {
  UpdateConversation,
  UpdateParticipants
} from "../../modules/app/conversation/actionCreator";
import socket from "../../socket";

const getParticipants = () => {
  return store.getState().app.conversation.participantInfo;
};

const getOrder = () => {
  return store.getState().app.conversation.allConversations as string[];
};

export const createLocalconversation = (
  conversation: string,
  participants: string[]
) => {
  const order = getOrder();
  if (order.indexOf(conversation) !== -1) {
    addMessageToCache({
      from: "__Admin__",
      payload: "you were added to this conversation",
      to: conversation,
      recipients: []
    });
    updateOrderInCache(conversation, UpdateOrderInCacheTypes.sendToFront);
    updateParticipantInfoInCache(conversation, participants);

    const newPart = { ...getParticipants() };
    newPart[conversation] = participants;
    store.dispatch(UpdateParticipants(newPart));

    return;
  }

  addMessageToCache({
    from: "__Admin__",
    payload: "This is the start of the conversation",
    to: conversation,
    recipients: []
  });
  console.log("trynh here", conversation, participants);
  updateOrderInCache(conversation, UpdateOrderInCacheTypes.add);
  updateParticipantInfoInCache(conversation, participants);

  const newPart = { ...getParticipants() };
  newPart[conversation] = participants;
  store.dispatch(UpdateConversation({ conversation }));
  store.dispatch(UpdateParticipants(newPart));
};

export const EmitNewConversationData = (
  conversation: string,
  participants: string[]
) => {
  if (!socket) return;

  socket.emit("new conversation", {
    conversation,
    participants
  });
};
