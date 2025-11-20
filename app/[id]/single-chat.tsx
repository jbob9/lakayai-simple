"use client";

import { Chat } from "@/components/chat";
import { db } from "@/db";
import { convertToUIMessages } from "@/lib/utils";
import { use, useState } from "react";

const SingleChat = ({ chatId }: { chatId: string }) => {
  const [loadedChat, setLoadedChat] = useState(false);
  const getMessages = async () => {
    const messages = await db.messages.where("chatId").equals(chatId).toArray();
    setLoadedChat(true);
    return messages;
  };
  const messages = use(getMessages());

  const Uimessages = convertToUIMessages(messages ?? []);
  
  if (!loadedChat) {
    return <div>Loading...</div>;
  }
  console.log(messages, "messages");
  console.log(Uimessages, "Uimessages");

  return <Chat id={chatId} initialMessages={Uimessages} />;
};

export default SingleChat;
