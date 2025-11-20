import { google } from "@ai-sdk/google";
import { customProvider } from "ai";

export const myProvider = customProvider({
  languageModels: {
    'chat-model': google("gemini-2.5-flash-lite"),
  },
});
