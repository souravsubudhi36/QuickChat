import {
  IConversationState,
  NEW_MESSAGE,
  IAddNewMessageAction,
  ISyncAllConversationsAction,
  SYNC_ALL_CONVERSATIONS,
  UPDATE_CONVERSATION,
  IUpdateConversation,
  IUpdateParticipantsAction,
  UPDATE_PARTICIPANTS,
  SELECT_CONVERSATION,
  ISelectConversationAction,
  ISyncmessagesOnSelectionAction,
  SYNC_MESSAGES_ON_SELECTION,
  IDumpMessages,
  DUMP_MESSAGES,
  IUpdateUnreadsAction,
  UPDATE_UNREADS
} from "./types";

const initialState: IConversationState = {
  conversationArray: [],
  activeConversation: null,
  allConversations: null,
  participantInfo: {},
  unreads: {}
};

const reducer = (
  state = initialState,
  action:
    | IAddNewMessageAction
    | ISyncAllConversationsAction
    | IUpdateConversation
    | IUpdateParticipantsAction
    | ISelectConversationAction
    | ISyncmessagesOnSelectionAction
    | IDumpMessages
    | IUpdateUnreadsAction
): IConversationState => {
  switch (action.type) {
    case NEW_MESSAGE:
      if (state.activeConversation === action.payload.to)
        return {
          ...state,
          conversationArray: [...state.conversationArray, action.payload]
        };
      break;
    case SYNC_ALL_CONVERSATIONS:
      return { ...state, allConversations: action.payload };

    case UPDATE_CONVERSATION:
      if (action.payload.delete) {
        let temp: string[];
        if (state.allConversations) {
          temp = [...state.allConversations];
          temp.splice(temp.indexOf(action.payload.conversation), 1);
        } else {
          temp = [];
        }
        return { ...state, allConversations: temp };
      } else {
        let temp: string[] = [];
        if (state.allConversations) temp = [...state.allConversations];
        temp.push(action.payload.conversation);
        return { ...state, allConversations: temp };
      }

    case UPDATE_PARTICIPANTS:
      return { ...state, participantInfo: action.payload };

    case SELECT_CONVERSATION:
      return { ...state, activeConversation: action.payload };

    case SYNC_MESSAGES_ON_SELECTION:
      return {
        ...state,
        conversationArray: [
          ...action.payload.reverse(),
          ...state.conversationArray
        ]
      };
    case DUMP_MESSAGES:
      return { ...state, conversationArray: [] };
    case UPDATE_UNREADS:
      return { ...state, unreads: { ...state.unreads, ...action.payload } };
  }

  return state;
};

export default reducer;
