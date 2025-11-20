"use client";

import { Chat } from "@/components/chat";
import { db } from "@/db";
import { convertToUIMessages } from "@/lib/utils";
import { useLiveQuery, useDocument } from "dexie-react-hooks";

const SingleChat = ({ chatId }: { chatId: string }) => {
  const messages = useLiveQuery(async () => {
    return await db.messages.where("chatId").equals(chatId).toArray();
  });

  const Uimessages = convertToUIMessages(messages ?? []);

  console.log(messages, 'messages')
  console.log(Uimessages, 'Uimessages')

  return <Chat id={chatId} initialMessages={Uimessages} />;
};

export default SingleChat;
