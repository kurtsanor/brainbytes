"use client";

import { getUserConversations } from "@/lib/api/messages.client";
import { Chat } from "@/types/chat.types";
import { useEffect, useState } from "react";
import ChatList from "./chat-list";

type ChatHistorySectionProps = {
  initialChats: Chat[];
};

const CHAT_HISTORY_REFRESH_EVENT = "brainbytes:chat-history-refresh";

const ChatHistorySection = ({ initialChats }: ChatHistorySectionProps) => {
  const [chats, setChats] = useState(initialChats);

  useEffect(() => {
    const refreshChats = async () => {
      const nextChats = await getUserConversations();
      setChats(nextChats);
    };

    const handleRefresh = () => {
      void refreshChats();
    };

    window.addEventListener(CHAT_HISTORY_REFRESH_EVENT, handleRefresh);
    return () => {
      window.removeEventListener(CHAT_HISTORY_REFRESH_EVENT, handleRefresh);
    };
  }, []);

  return (
    <nav className="flex flex-col flex-1 p-2 overflow-y-auto">
      <p className="text-neutral-500 text-sm mb-1.5 ml-1.5">Recents</p>
      <ChatList chats={chats} />
    </nav>
  );
};

export const refreshChatHistory = () => {
  window.dispatchEvent(new Event(CHAT_HISTORY_REFRESH_EVENT));
};

export default ChatHistorySection;