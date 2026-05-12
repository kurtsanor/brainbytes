"use client";

import { Chat } from "@/types/chat.types";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ChatListProps {
  chats: Chat[];
}

const ChatList = (props: ChatListProps) => {
  return (
    <>
      {props.chats.map((chat) => (
        <ChatCard key={chat._id} chat={chat} />
      ))}
    </>
  );
};

const ChatCard = ({ chat }: { chat: Chat }) => {
  const pathname = usePathname();
  const activePath = pathname.split("/")[2];

  const activeStyle =
    activePath == chat._id ? "bg-neutral-100" : "hover:bg-neutral-50";

  return (
    <Link
      title={chat.title}
      href={`/chat/${chat._id}`}
      className={`w-full leading-relaxed py-1 px-2 transition-colors ${activeStyle} cursor-pointer whitespace-nowrap overflow-x-clip text-ellipsis`}
    >
      {chat.title}
    </Link>
  );
};

export default ChatList;
