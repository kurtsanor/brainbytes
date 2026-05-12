import { getMessagesByChatId } from "@/lib/api/messages.server";
import { redirect } from "next/navigation";
import ChatContainer from "../chat-container";

type Params = Promise<{ id: string }>;

const ChatPage = async ({ params }: { params: Params }) => {
  const { id } = await params;

  try {
    const messages = await getMessagesByChatId(id);

    return <ChatContainer messages={messages} id={id} />;
  } catch (error) {
    redirect("/chat");
  }
};

export default ChatPage;
