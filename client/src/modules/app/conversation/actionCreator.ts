import { ILocalMessage } from "../../../components/App/CurrentConversation/types";
import {
  IAddNewMessageAction,
  NEW_MESSAGE,
  SYNC_ALL_CONVERSATIONS,
  ISyncAllConversationsAction,
  IUpdateConversation,
  UPDATE_CONVERSATION,
  IUpdateParticipantsAction,
  UPDATE_PARTICIPANTS,
  ISelectConversationAction,
  SELECT_CONVERSATION,
  ISyncmessagesOnSelectionAction,
  SYNC_MESSAGES_ON_SELECTION,
  DUMP_MESSAGES,
  IDumpMessages,
  IUpdateUnreadsAction,
  UPDATE_UNREADS
} from "./types";

export const AddNewMessageAction = (
  payload: ILocalMessage
): IAddNewMessageAction => {
  return {
    type: NEW_MESSAGE,
    payload
  };
};

export const SyncAllConversations = (
  payload: string[]
): ISyncAllConversationsAction => {
  return {
    type: SYNC_ALL_CONVERSATIONS,
    payload
  };
};

export const UpdateConversation = (payload: {
  delete?: true;
  conversation: string;
}): IUpdateConversation => {
  return {
    type: UPDATE_CONVERSATION,
    payload
  };
};

export const UpdateParticipants = (payload: {
  [conversation: string]: string[];
}): IUpdateParticipantsAction => {
  return {
    type: UPDATE_PARTICIPANTS,
    payload
  };
};

export const SelectConversation = (
  payload: string | null
): ISelectConversationAction => {
  return {
    type: SELECT_CONVERSATION,
    payload
  };
};

export const SyncMessagesOnSelection = (
  payload: ILocalMessage[]
): ISyncmessagesOnSelectionAction => {
  return {
    type: SYNC_MESSAGES_ON_SELECTION,
    payload
  };
};
export const DumpMessages = (): IDumpMessages => {
  return {
    type: DUMP_MESSAGES
  };
};

export const UpdateUnreadsAction = (payload: {
  [conv: string]: number;
}): IUpdateUnreadsAction => {
  return {
    type: UPDATE_UNREADS,
    payload
  };
};
