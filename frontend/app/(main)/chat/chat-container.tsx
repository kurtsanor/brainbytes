"use client";

import { sendMessage } from "@/lib/api/messages.client";
import { Message } from "@/types/message.types";
import { User } from "@/types/user.types";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface ChatInputProps {
  chatBoxStyle: string;
  handleSend: (message: string) => void;
  isTyping: boolean;
}

interface MessageBubbleProps {
  message: Message;
  isUser: boolean;
}

interface ChatHeaderProps {
  userDetails?: User;
}

type ChatContainerProps = {
  messages: Message[];
  id?: string;
  userDetails?: User;
};

const ChatContainer = ({ messages, id, userDetails }: ChatContainerProps) => {
  const router = useRouter();

  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [data, setData] = useState<Message[]>(messages);
  const chatIdRef = useRef<string | undefined>(id);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data]);

  const scrollRef = useRef<HTMLDivElement>(null);

  const chatBoxStyle =
    data?.length > 0
      ? "bg-white flex flex-col w-full border border-neutral-200 focus:outline-none p-3"
      : "flex flex-col w-full border border-neutral-200 focus:outline-none p-3";

  const heroTextStyle = data?.length < 1 ? "justify-center items-center" : "";

  const chatContainerStyle = data?.length < 1 ? "" : "flex-1";

  const handleSend = async (message: string) => {
    if (!message.trim()) {
      return;
    }
    setData((prevData) => {
      const newMessage: any = {
        _id: Date.now().toString(),
        text: message,
      };
      return [...prevData, newMessage];
    });
    setIsTyping(true);
    try {
      console.log("chat id is ", chatIdRef.current);
      const response = await sendMessage(message, chatIdRef.current || "");
      console.log(response);

      if (!chatIdRef.current) {
        chatIdRef.current = response.aiMessage.chatId; // Update the chat ID if it was newly created
      }

      setData((prevData) => [...prevData, response.aiMessage]);
      router.replace(`/chat/${response.aiMessage.chatId}`); // Update URL to reflect the current chat session
      router.refresh(); // Refresh after navigation so the sidebar/server tree re-renders with the new chat
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const messagesList = data?.map((msg, index) => {
    const isUser = index % 2 === 0;
    return <MessageBubble key={index} message={msg} isUser={isUser} />;
  });

  return (
    <div
      className={`flex min-h-screen flex-col ${heroTextStyle} max-w-200 w-200 p-5 pb-0`}
    >
      <div className={`flex flex-col ${heroTextStyle} ${chatContainerStyle}`}>
        {/* Show welcome message if no messages */}
        {data.length === 0 && <ChatHeader userDetails={userDetails} />}
        {messagesList}
        {isTyping && (
          <div className="flex items-center justify-start mb-8 space-x-1 animate-pulse">
            <img src="/bblogo1.png" alt="BrainBytes Logo" className="w-6 h-5" />
            <p className="text-gray-500">BrainBytes is thinking...</p>
          </div>
        )}
        <div ref={scrollRef} className="text-transparent border" />
      </div>
      {/* Text Area layout */}
      <div className="w-full mt-5 sticky pb-3 bottom-0 z-100 bg-white">
        <ChatInput
          chatBoxStyle={chatBoxStyle}
          handleSend={handleSend}
          isTyping={isTyping}
        />
        <Disclaimer />
      </div>
    </div>
  );
};

const ChatHeader = ({ userDetails }: ChatHeaderProps) => {
  return (
    <>
      <img
        src="/bblogo1.png"
        alt="BrainBytes Logo"
        className="w-30 h-30 mb-5"
      />
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2 bg-linear-to-r from-blue-950 to-brand-blue bg-clip-text text-transparent">
        Hello, {userDetails?.firstName || "there"}
      </h1>
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
        How can I assist you today?
      </h1>
    </>
  );
};

const MessageBubble = ({ message, isUser }: MessageBubbleProps) => {
  const alignment = isUser ? "justify-end" : "justify-start";
  const bgColor = isUser ? "bg-neutral-100 max-w-[70%] p-3" : "";

  return (
    <div className={`flex ${alignment} mb-8`}>
      <p className={`${bgColor} leading-relaxed`}>{message.text}</p>
    </div>
  );
};

const ChatInput = ({ chatBoxStyle, handleSend, isTyping }: ChatInputProps) => {
  const [messageInput, setMessageInput] = useState("");

  const executeSend = () => {
    handleSend(messageInput);
    setMessageInput("");
  };

  return (
    <div className={chatBoxStyle}>
      <textarea
        disabled={isTyping}
        className="w-full resize-none focus:outline-none mb-5 field-sizing-content min-h-12 max-h-30"
        placeholder="How can I help you today?"
        onChange={(e) => setMessageInput(e.target.value)}
        value={messageInput}
      />
      <div className="flex justify-end">
        <button
          disabled={isTyping}
          className="p-1.5 bg-brand-blue text-white hover:bg-brand-blue-hover transition-colors disabled:bg-gray-300 cursor-pointer"
          aria-label="Send message"
          onClick={executeSend}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const Disclaimer = () => {
  return (
    <p className="text-sm text-muted-foreground mt-2 text-center">
      AI can make mistakes. Please verify the information provided.
    </p>
  );
};

export default ChatContainer;
