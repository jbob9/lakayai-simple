import { myProvider } from "@/lib/ai/provider";
import { streamText } from "ai";

export async function POST(request: Request) {
  const { id, messages } = await request.json();

  const result = streamText({
    model: myProvider.languageModel("chat-model"),
    system:
      "you are a friendly assistant! keep your responses concise and helpful.",
    messages,
    // onFinish: async ({ text }) => {
    //   await createMessage({
    //     id,
    //     messages: [...messages, { role: "assistant", content: text }],
    //     author: session.user?.email!,
    //   });
    // },
  });

  return result.toTextStreamResponse({});
}
