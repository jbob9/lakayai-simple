"use client";

import { Chat } from "@/components/chat";
import { db } from "@/db";
import { convertToUIMessages } from "@/lib/utils";
import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";

const SingleChat = ({ chatId }: { chatId: string }) => {
  const [loadedChat, setLoadedChat] = useState(false);

  const messages = useLiveQuery(async () => {
    const messages = await db.messages.where("chatId").equals(chatId).toArray();
    setLoadedChat(true);
    return messages;
  });

  if (!loadedChat) {
    return <div>Loading...</div>;
  }
  const Uimessages = convertToUIMessages(messages ?? []);
  return <Chat id={chatId} initialMessages={Uimessages} />;
};

export default SingleChat;
