import { ILocalMessage } from "../../../components/App/CurrentConversation/types";

export const NEW_MESSAGE = "new_message";
export const SYNC_ALL_CONVERSATIONS = "sync_all_convs_from_cache";
export const UPDATE_CONVERSATION = "updateConversations";
export const UPDATE_PARTICIPANTS = "updateParticipants";
export const SELECT_CONVERSATION = "select_conversation";
export const SYNC_MESSAGES_ON_SELECTION = "sync_messages_on_selection";
export const DUMP_MESSAGES = "dumpMessages";
export const UPDATE_UNREADS = "updateUnreads";

export interface IConversationState {
  conversationArray: ConversationMap;
  activeConversation: string | null;
  allConversations: string[] | null;
  participantInfo: { [conversation: string]: string[] };
  unreads: { [x: string]: number };
}

export type ConversationMap = ILocalMessage[];

export interface ISyncAllConversationsAction {
  type: typeof SYNC_ALL_CONVERSATIONS;
  payload: string[];
}

export interface IUpdateConversation {
  type: typeof UPDATE_CONVERSATION;
  payload: {
    delete?: true;
    conversation: string;
  };
}

export interface IUpdateParticipantsAction {
  type: typeof UPDATE_PARTICIPANTS;
  payload: { [conversation: string]: string[] };
}

export interface IUpdateUnreadsAction {
  type: typeof UPDATE_UNREADS;
  payload: { [conversation: string]: number };
}

export interface IAddNewMessageAction {
  type: typeof NEW_MESSAGE;
  payload: ILocalMessage;
}

export interface ISelectConversationAction {
  type: typeof SELECT_CONVERSATION;
  payload: string | null;
}

export interface ISyncmessagesOnSelectionAction {
  type: typeof SYNC_MESSAGES_ON_SELECTION;
  payload: ILocalMessage[];
}

export interface IDumpMessages {
  type: typeof DUMP_MESSAGES;
}
