import { getMessagesByChatId } from "@/lib/api/messages.server";
import ChatContainer from "../chat-container";

type Params = Promise<{ id: string }>;

const ChatPage = async ({ params }: { params: Params }) => {
  const { id } = await params;

  const messages = await getMessagesByChatId(id);

  return <ChatContainer messages={messages} id={id} />;
};

export default ChatPage;
