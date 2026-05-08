"use client";

import { sendMessage } from "@/lib/api/messages";
import { Message } from "@/types/message.types";
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

const ChatContainer = (messages: { messages: Message[] }) => {
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [data, setData] = useState<{ messages: Message[] }>(messages);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data]);

  const scrollRef = useRef<HTMLDivElement>(null);

  const chatBoxStyle =
    data?.messages.length > 0
      ? "bg-white flex flex-col w-full border border-neutral-200 focus:outline-none p-3"
      : "flex flex-col w-full border border-neutral-200 focus:outline-none p-3";

  const heroTextStyle = data?.messages.length < 1 ? "items-center" : "";

  const handleSend = async (message: string) => {
    if (!message.trim()) {
      return;
    }
    setData((prevData) => {
      const newMessage: any = {
        _id: Date.now().toString(),
        text: message,
      };
      return {
        messages: [...prevData.messages, newMessage],
      };
    });
    setIsTyping(true);
    const response = await sendMessage(message);
    setData((prevData) => ({
      messages: [...prevData.messages, response.aiMessage],
    }));
    setIsTyping(false);
  };

  const messagesList = data?.messages?.map((msg, index) => {
    const isUser = index % 2 === 0;
    return <MessageBubble key={index} message={msg} isUser={isUser} />;
  });

  return (
    <div
      className={`flex min-h-screen flex-col ${heroTextStyle} max-w-200 p-5`}
    >
      {/* Show welcome message if no messages */}
      {data.messages?.length === 0 && <ChatHeader />}
      {messagesList}
      {isTyping && (
        <div className="flex items-center justify-start mb-8 space-x-3 animate-pulse">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 3L14.5 9.5L21 12L14.5 14.5L12 21L9.5 14.5L3 12L9.5 9.5L12 3Z"
              fill="#2c94de"
            />
            <path
              d="M18 4L18.7 5.3L20 6L18.7 6.7L18 8L17.3 6.7L16 6L17.3 5.3L18 4Z"
              fill="#2c94de"
            />
            <path
              d="M18 16L18.7 17.3L20 18L18.7 18.7L18 20L17.3 18.7L16 18L17.3 17.3L18 16Z"
              fill="#2c94de"
            />
          </svg>
          <p className="text-gray-500 italic">BrainBytes is thinking...</p>
        </div>
      )}
      <div ref={scrollRef} className="text-transparent border" />
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

const ChatHeader = () => {
  return (
    <>
      <img src="/brains.png" alt="BrainBytes Logo" className="w-20 h-20 mb-5" />
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2 bg-linear-to-r from-blue-950 to-brand-blue bg-clip-text text-transparent">
        Hello, Jackson
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
        rows={2}
        className="w-full resize-none focus:outline-none mb-5"
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
