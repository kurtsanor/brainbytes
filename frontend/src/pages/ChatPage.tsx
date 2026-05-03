import { useRef, useState } from "react";

interface ChatInputProps {
  chatBoxStyle: string;
  handleSend: (message: string) => void;
}

interface MessageBubbleProps {
  message: string;
  isUser: boolean;
}

const ChatPage = () => {
  const [messages, setMessages] = useState<string[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);

  const chatBoxStyle =
    messages.length > 0
      ? "bg-white flex flex-col w-full border border-neutral-200 rounded-lg focus:outline-none p-3"
      : "flex flex-col w-full border border-neutral-200 rounded-lg focus:outline-none p-3";

  const heroTextStyle = messages.length < 1 ? "items-center" : "";

  const handleSend = (message: string) => {
    if (!message.trim()) {
      return;
    }
    setMessages((prevMessages) => [...prevMessages, message]);
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const messagesList = messages.map((msg, index) => {
    const isUser = index % 2 === 0;
    return <MessageBubble key={index} message={msg} isUser={isUser} />;
  });

  return (
    <div
      className={`flex min-h-screen flex-col ${heroTextStyle} justify-center px-40 pt-5`}
    >
      {/* Show welcome message if no messages */}
      {messages.length === 0 && <ChatHeader />}
      {messagesList}
      <div ref={scrollRef} className="text-transparent">
        this is a dummy element to scroll into view
      </div>
      {/* Text Area layout */}
      <div className="w-full mt-10 sticky pb-3 bottom-0 z-100 bg-white">
        <ChatInput chatBoxStyle={chatBoxStyle} handleSend={handleSend} />
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
  const bgColor = isUser ? "bg-neutral-100" : "";

  return (
    <div className={`flex ${alignment}`}>
      <p className={`p-3 rounded-lg ${bgColor} max-w-[70%]`}>{message}</p>
    </div>
  );
};

const ChatInput = ({ chatBoxStyle, handleSend }: ChatInputProps) => {
  const [messageInput, setMessageInput] = useState("");

  const executeSend = () => {
    handleSend(messageInput);
    setMessageInput("");
  };

  return (
    <div className={chatBoxStyle}>
      <textarea
        rows={2}
        className="w-full resize-none focus:outline-none mb-5"
        placeholder="How can I help you today?"
        onChange={(e) => setMessageInput(e.target.value)}
        value={messageInput}
      />
      <div className="flex justify-end">
        <button
          className="p-1.5 bg-brand-blue text-white rounded-lg hover:bg-brand-blue-hover transition-colors disabled:bg-gray-300 cursor-pointer"
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

export default ChatPage;
