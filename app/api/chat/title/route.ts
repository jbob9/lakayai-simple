import { myProvider } from "@/lib/ai/provider";
import { generateText, UIMessage } from "ai";

export async function POST(request: Request) {
  const {  messages } = await request.json();

  const userMessage = (messages as UIMessage[])[0].parts
    .filter((part) => part.type == "text")
    .map((part) => part.text)
    .join("\n");

  const { text: title } = await generateText({
    model: myProvider.languageModel("chat-model"),
    system: `\n
    - you will generate a short title based on the first message a user begins a conversation with
    - ensure it is not more than 80 characters long
    - the title should be a summary of the user's message
    - do not use quotes or colons`,
    prompt: userMessage,
  });

  return { title };
}
