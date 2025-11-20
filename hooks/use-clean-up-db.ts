import { db } from "@/db";
import { useCallback, useEffect } from "react";

const DB_TIMESTAMP_KEY = "userDBTimestamp";
const CHECK_INTERVAL = 15 * 24 * 60 * 60 * 1000; // 15 days in milliseconds

export const useCleanUpDb = () => {
  const checkDateAndClear = useCallback(async () => {
    const lastCheck = localStorage.getItem(DB_TIMESTAMP_KEY);
    const now = Date.now();
    const chatCount = await db.chats.count();

    if (!lastCheck || now - parseInt(lastCheck) > CHECK_INTERVAL) {
      try {
        if (chatCount >= 1) {
          await db.chats.clear();
          await db.messages.clear();
        }
        localStorage.setItem(DB_TIMESTAMP_KEY, Date.now().toString());
      } catch (err) {
        console.error("Error:", err);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    checkDateAndClear();

    // Set up periodic checks every 15 days
    const intervalId = setInterval(checkDateAndClear, CHECK_INTERVAL);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [checkDateAndClear]);

  if (typeof window === "undefined") return null;
};
