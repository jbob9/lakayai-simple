"use client";

import { sanitizeText } from "@/lib/utils";
import type { UIDataTypes, UIMessage, UITools } from "ai";
import { motion } from "framer-motion";
import { BotIcon, UserIcon } from "lucide-react";
import { Markdown } from "./markdown";

export const Message = ({
  role,
  message,
}: {
  role: string;
  message: UIMessage<unknown, UIDataTypes, UITools>;
}) => {
  return (
    <motion.div
      className={`flex flex-row gap-4 px-4 w-full md:w-[500px] md:px-0 first-of-type:pt-20`}
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="size-6 flex flex-col justify-center items-center shrink-0 text-zinc-400">
        {role === "assistant" ? <BotIcon /> : <UserIcon />}
      </div>

      <div className="flex flex-col gap-6 w-full">
        <div className="text-zinc-800 dark:text-zinc-300 flex flex-col gap-4">
          {message.parts.map((part, i) => {
            if (part.type === "text") {
              return (
                <Markdown key={`${role}-${i}`}>
                  {sanitizeText(part.text)}
                </Markdown>
              );
            }
          })}
        </div>
      </div>
    </motion.div>
  );
};
