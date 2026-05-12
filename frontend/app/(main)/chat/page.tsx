import { getMe } from "@/lib/api/auth.server";
import ChatContainer from "./chat-container";

const NewChatPage = async () => {
  const userDetails = await getMe();

  return <ChatContainer messages={[]} userDetails={userDetails.user} />;
};

export default NewChatPage;
