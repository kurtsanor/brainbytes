import { getAllMessages } from "@/lib/api/messages";
import ChatContainer from "./chat-container";

const ChatPage = async () => {
  const messages = await getAllMessages();

  return <ChatContainer messages={messages} />;
};

export default ChatPage;
