"use client";

import { Chat } from "@/components/chat";
import { db } from "@/db";
import { convertToUIMessages } from "@/lib/utils";
import { useLiveQuery } from "dexie-react-hooks";

const SingleChat = ({ chatId }: { chatId: string }) => {
  const chatfromDb = useLiveQuery(async () => {
    const [chat, messages] = await Promise.all([
      db.chats.where("id").equals(chatId).first(),
      db.messages.where("chatId").equals(chatId).toArray(),
    ]);
    return { ...chat, messages };
  });

  const messages = convertToUIMessages(chatfromDb?.messages ?? []);

  return <Chat id={chatId} initialMessages={messages} />;
};

export default SingleChat;
