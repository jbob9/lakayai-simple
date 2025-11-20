"use client";

import { db } from "@/db";
import cx from "classnames";
import { useLiveQuery } from "dexie-react-hooks";
import { AnimatePresence, motion } from "framer-motion";
import { InfoIcon, MenuIcon, PencilIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export const History = () => {
  const { id } = useParams();
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const chats = useLiveQuery(async () => {
    return await db.chats.toArray();
  });

  return (
    <>
      <div
        className="dark:text-zinc-400 text-zinc-500 cursor-pointer border rounded-md p-1"
        onClick={() => {
          setIsHistoryVisible(true);
        }}
      >
        <MenuIcon />
      </div>

      <AnimatePresence>
        {isHistoryVisible && (
          <>
            <motion.div
              className="fixed bg-zinc-900/50 h-dvh w-dvw top-0 left-0 z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsHistoryVisible(false);
              }}
            />

            <motion.div
              className="fixed top-0 left-0 w-80 h-dvh p-3 flex flex-col gap-6 bg-white dark:bg-zinc-800 z-20"
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
            >
              <div className="text-sm flex flex-row items-center justify-between">
                <div className="flex flex-row gap-2">
                  <div className="dark:text-zinc-300">History</div>
                  <div className="dark:text-zinc-500 text-zinc-500">
                    {chats === undefined ? "loading" : chats.length} chats
                  </div>
                </div>

                <Link
                  href="/"
                  className="dark:text-zinc-400 dark:bg-zinc-700 hover:dark:bg-zinc-600 bg-zinc-100 hover:bg-zinc-200 p-1.5 rounded-md cursor-pointer"
                  onClick={() => {
                    setIsHistoryVisible(false);
                  }}
                >
                  <PencilIcon size={14} />
                </Link>
              </div>

              <div className="flex flex-col overflow-y-scroll">
                {chats?.length === 0 ? (
                  <div className="text-zinc-500 h-dvh w-full flex flex-row justify-center items-center text-sm gap-2">
                    <InfoIcon />
                    <div>No chats found</div>
                  </div>
                ) : null}

                {chats &&
                  chats.map((chat) => (
                    <Link
                      href={`/${chat.id}`}
                      key={chat.id}
                      className={cx(
                        "p-2 dark:text-zinc-400 border-b dark:border-zinc-700 text-sm dark:hover:bg-zinc-700 hover:bg-zinc-200 last-of-type:border-b-0",
                        {
                          "dark:bg-zinc-700 bg-zinc-200": id === chat.id,
                        }
                      )}
                    >
                      {chat.title}
                    </Link>
                  ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
