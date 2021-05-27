import socket from "../../socket";
import { ISocketMessage } from "../../components/App/CurrentConversation/types";
import { appendMessage } from "../handleRelay/newMessage";
import { createLocalconversation } from "../handleRelay/newConversation";
import {
  addToConversation,
  removeFromConversation,
  removeSelf
} from "../handleRelay/editConversation";

export const handleMessage = () => {
  if (!socket) return;

  socket.on("message", (data: ISocketMessage) => {
    appendMessage(data);
  });

  socket.on(
    "new conversation",
    (data: { conversation: string; participants: string[] }) => {
      console.log(data);
      createLocalconversation(data.conversation, data.participants);
    }
  );

  socket.on(
    "add to conversation",
    (data: { conversation: string; user: string }) => {
      addToConversation(data.user, data.conversation);
    }
  );

  socket.on(
    "remove from conversation",
    (data: { conversation: string; user: string }) => {
      removeFromConversation(data.user, data.conversation);
    }
  );

  socket.on("you are removed", (data: { conversation: string }) => {
    removeSelf(data.conversation);
  });
  console.log("opened sockets");
};
