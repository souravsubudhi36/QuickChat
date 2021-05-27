export type ConversationId = string;

export interface ILocalMessage {
  from: string;
  payload: string;
  to: string;
}

export interface ISocketMessage extends ILocalMessage {
  to: ConversationId;
  recipients: string[];
}
