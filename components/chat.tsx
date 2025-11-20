"use client";

import { Message as PreviewMessage } from "@/components/message";
import { createChat, saveMessages } from "@/db";
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";
import { fetchWithErrorHandlers } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, UIMessage } from "ai";
import { motion } from "framer-motion";
import {
  ArrowUpIcon,
  Loader2Icon,
  SendIcon,
  SquareIcon,
  StopCircleIcon,
  XIcon,
} from "lucide-react";
import { nanoid } from "nanoid";
import { FormEvent, useCallback, useState } from "react";

const suggestedActions = [
  {
    title: "What's the summary",
    action: "what's the summary of these documents?",
  },
  {
    title: "Who is the author",
    action: "who is the author of these documents?",
  },
];

export function Chat({
  id,
  initialMessages,
}: {
  id: string;
  initialMessages: Array<UIMessage>;
}) {
  const [input, setInput] = useState("");

  const { messages, setMessages, sendMessage, status } = useChat({
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      fetch: fetchWithErrorHandlers,
      prepareSendMessagesRequest(request) {
        return {
          body: {
            id: request.id,
            message: request.messages.at(-1),
            ...request.body,
          },
        };
      },
    }),
    onFinish: async ({ messages }) => {
      await saveMessages(
        messages.map((message) => ({
          role: message.role,
          chatId: id,
          id: nanoid(),
          createdAt: new Date(),
          parts: message.parts,
        }))
      );
      // window.history.replaceState({}, "", `/chat/${id}`);
    },
  });

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const submitForm = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      console.log("submitForm");
      e.preventDefault();
      window.history.replaceState({}, "", `/${id}`);
      console.log(input, "input");
      if (messages.length <= 0) {
        await createChat({ message: input });
      }

      sendMessage({
        role: "user",
        parts: [
          {
            type: "text",
            text: input,
          },
        ],
      });

      setInput("");
    },
    [id, input, setInput, sendMessage]
  );

  let Icon = <SendIcon className="size-4" />;

  if (status === "submitted") {
    Icon = <Loader2Icon className="size-4 animate-spin" />;
  } else if (status === "streaming") {
    Icon = <SquareIcon className="size-4" />;
  } else if (status === "error") {
    Icon = <XIcon className="size-4" />;
  }

  return (
    <div className="flex flex-row justify-center pb-20 h-dvh bg-white dark:bg-zinc-900">
      <div className="flex flex-col justify-between items-center gap-4">
        <div
          ref={messagesContainerRef}
          className="flex flex-col gap-4 h-full w-dvw items-center overflow-y-scroll"
        >
          {messages.map((message, index) => (
            <PreviewMessage
              key={`${id}-${index}`}
              role={message.role}
              message={message}
            />
          ))}
          <div ref={messagesEndRef} className="shrink-0 min-w-6 min-h-6" />
        </div>

        {messages.length === 0 && (
          <div className="grid sm:grid-cols-2 gap-2 w-full px-4 md:px-0 mx-auto md:max-w-[500px]">
            {suggestedActions.map((suggestedAction, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                key={index}
                className={index > 1 ? "hidden sm:block" : "block"}
              >
                <button
                  onClick={async () => {
                    sendMessage({
                      role: "user",
                      parts: [{ type: "text", text: suggestedAction.action }],
                    });
                  }}
                  className="w-full text-left border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300 rounded-lg p-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex flex-col"
                >
                  <span className="font-medium">{suggestedAction.title}</span>
                </button>
              </motion.div>
            ))}
          </div>
        )}

        <form
          className="flex flex-row gap-2 relative items-center w-full md:max-w-[500px] max-w-[calc(100dvw-32px) px-4 md:px-0"
          onSubmit={submitForm}
        >
          <input
            className="bg-zinc-100 rounded-md px-2 py-1.5 flex-1 outline-none dark:bg-zinc-700 text-zinc-800 dark:text-zinc-300"
            placeholder="Send a message..."
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
            }}
          />

          {status === "submitted" ? (
            <button
              className="relative text-sm bg-zinc-100 rounded-lg size-9 shrink-0 flex flex-row items-center justify-center cursor-pointer hover:bg-zinc-200 dark:text-zinc-50 dark:bg-zinc-700 dark:hover:bg-zinc-800"
              data-testid="stop-button"
              onClick={(event) => {
                event.preventDefault();
                stop();
                setMessages((messages) => messages);
              }}
            >
              <StopCircleIcon size={14} />
            </button>
          ) : (
            <button
              className="relative text-sm bg-zinc-100 rounded-lg size-9 shrink-0 flex flex-row items-center justify-center cursor-pointer hover:bg-zinc-200 dark:text-zinc-50 dark:bg-zinc-700 dark:hover:bg-zinc-800"
              disabled={!input.trim()}
            >
              {status === "streaming" ? (
                <SquareIcon className="size-4" />
              ) : (
                <ArrowUpIcon size={14} />
              )}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
