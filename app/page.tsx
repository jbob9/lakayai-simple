import { Chat } from "@/components/chat";
import { nanoid } from "nanoid";

export default function Home() {
  const id = nanoid();
  return <Chat id={id} initialMessages={[]} />;
}
