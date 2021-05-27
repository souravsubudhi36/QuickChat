import {
  updateOrderInCache,
  updateParticipantInfoInCache
} from "../indexedDB/conversationData";
import { UpdateOrderInCacheTypes } from "../indexedDB/init";
import store from "../../store";
import { UpdateParticipants } from "../../modules/app/conversation/actionCreator";
import socket from "../../socket";
import { appendMessage } from "./newMessage";

const getParticipants = (conversation?: string) => {
  if (conversation)
    return store.getState().app.conversation.participantInfo[conversation];

  return store.getState().app.conversation.participantInfo;
};

export const addToConversation = (user: string, conversation: string) => {
  appendMessage({
    from: "__Admin__",
    payload: `${user} was added to the chat`,
    to: conversation,
    recipients: []
  });

  const newParticipants = [
    ...(getParticipants(conversation) as string[]),
    user
  ];

  updateOrderInCache(conversation, UpdateOrderInCacheTypes.sendToFront);
  updateParticipantInfoInCache(conversation, newParticipants);

  const newPart = {
    ...(getParticipants() as { [conversation: string]: string[] })
  };
  newPart[conversation] = newParticipants;
  store.dispatch(UpdateParticipants(newPart));
};

export const emitAdditionToConversation = (
  conversation: string,
  user: string,
  recipients: string[]
) => {
  if (!socket) return;

  socket.emit("add to conversation", {
    conversation,
    user,
    recipients
  });
};

export const removeFromConversation = (user: string, conversation: string) => {
  appendMessage({
    from: "__Admin__",
    payload: `${user} was removed from the chat`,
    to: conversation,
    recipients: []
  });

  const newParticipants = [...(getParticipants(conversation) as string[])];

  newParticipants.splice(newParticipants.indexOf(user), 1);

  updateOrderInCache(conversation, UpdateOrderInCacheTypes.sendToFront);
  updateParticipantInfoInCache(conversation, newParticipants);

  const newPart = {
    ...(getParticipants() as { [conversation: string]: string[] })
  };
  newPart[conversation] = newParticipants;
  store.dispatch(UpdateParticipants(newPart));
};

export const emitRemovalFromConversation = (
  conversation: string,
  user: string,
  recipients: string[]
) => {
  if (!socket) return;

  socket.emit("remove from conversation", {
    conversation,
    user,
    recipients
  });
};

export const removeSelf = (conversation: string) => {
  appendMessage({
    from: "__Admin__",
    payload: `you were removed from the chat, any messages to the chat will not be sent`,
    to: conversation,
    recipients: []
  });

  const newParticipants: string[] = [];

  updateOrderInCache(conversation, UpdateOrderInCacheTypes.sendToFront);
  updateParticipantInfoInCache(conversation, newParticipants);

  const newPart = {
    ...(getParticipants() as { [conversation: string]: string[] })
  };
  newPart[conversation] = newParticipants;
  store.dispatch(UpdateParticipants(newPart));
};
