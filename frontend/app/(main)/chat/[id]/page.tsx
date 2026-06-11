import { getMessagesByChatId } from "@/lib/api/messages.server";
import { redirect } from "next/navigation";
import ChatContainer from "../chat-container";
import { Message } from "@/types/message.types";

type Params = Promise<{ id: string }>;

const ChatPage = async ({ params }: { params: Params }) => {
  const { id } = await params;
  let messages: Message[] = [];

  try {
    messages = await getMessagesByChatId(id);
  } catch {
    redirect("/chat");
  }

  return <ChatContainer messages={messages} id={id} />;
};

export default ChatPage;
