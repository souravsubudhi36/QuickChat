import {
  getMessagesFromCache,
  getMessagesFromQueue,
  updateUnreads
} from "./getMesagesOnStartup";
import { handleMessage } from "./socketRealtime";
import { updateOrderInCache } from "../indexedDB/conversationData";
import { UpdateOrderInCacheTypes } from "../indexedDB/init";

export const handleAppBoot = async () => {
  console.log("Booting app");

  // ensure that we have init
  await updateOrderInCache("Irrelevant", UpdateOrderInCacheTypes.initialize);
  // update unreads
  await updateUnreads();
  // first get all converations from cache
  await getMessagesFromCache();
  // process all messages from queue
  await getMessagesFromQueue();
  // open websocket connection
  handleMessage();
};
