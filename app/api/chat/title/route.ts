import { myProvider } from "@/lib/ai/provider";
import { generateText } from "ai";

export async function POST(request: Request) {
  const { message } = await request.json();

  const { text: title } = await generateText({
    model: myProvider.languageModel("chat-model"),
    system: `\n
    - you will generate a short title based on the first message a user begins a conversation with
    - ensure it is not more than 80 characters long
    - the title should be a summary of the user's message
    - do not use quotes or colons`,
    prompt: message,
  });

  return { title };
}
