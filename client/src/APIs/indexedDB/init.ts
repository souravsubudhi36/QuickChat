import store from "../../store";

export const DBNumber = 1;
export const messagesToGet = 25;
export const orderObjectStore = "____ConversationData____";
export const unreadsObjectStore = "__unreads__";
export const CONVERSATION = "conversation";
export const ORDER = "orderInfo";
export const PARTICIPANTS = "participantInfo";
export const UNREADS = "unreads";

export enum UpdateOrderInCacheTypes {
  sendToFront = 1,
  delete = -1,
  add = 2,
  initialize = 3
}

export const getUsername = () => {
  const state = store.getState();
  return state.authenticationState.userName;
};
