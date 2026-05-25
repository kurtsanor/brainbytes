import { getMe } from "@/lib/api/auth.server";
import AccountMenu from "./account-menu";
import { getUserConversations } from "@/lib/api/messages.server";
import ChatList from "./chat-list";
import Link from "next/link";

const Sidebar = async () => {
  const userDetails = await getMe();

  const chatHistory = await getUserConversations();

  return (
    <aside className="hidden md:flex flex-col w-66 shrink-0 border-r border-neutral-200 overflow-auto">
      <header className="flex flex-col p-1.5">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center h-10 pl-1">
            <img
              src="/bblogo1.png"
              alt="BrainBytes Logo"
              className="w-7 h-6 mr-1"
            />
            <h1 className="text-lg font-semibold tracking-tight scale-y-115 mt-1">
              BrainBytes
            </h1>
          </div>

          {/* Sidebar Toggle Button (Square Icon Grid) */}
          <button
            className="h-8 w-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-neutral-100 transition-colors"
            aria-label="Toggle sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.9}
              stroke="currentColor"
              className="w-5 h-5"
            >
              {/* Sharp, full outer box container (no rx rounded values) */}
              <rect
                width="18"
                height="18"
                x="3"
                y="3"
                strokeLinecap="square"
                strokeLinejoin="miter"
              />
              {/* Vertical sidebar panel divider line */}
              <path d="M9 3v18" strokeLinecap="square" strokeLinejoin="miter" />
              {/* Left-pointing collapse arrow */}
              <path
                d="m15 15-3-3 3-3"
                strokeLinecap="square"
                strokeLinejoin="miter"
              />
            </svg>
          </button>
        </div>
      </header>
      <section className="p-2 mb-2 flex flex-col gap-1">
        {/* New chat button */}
        <Link
          href="/chat/"
          className="flex items-center justify-center gap-2 w-full bg-black text-white p-1.5 transition-colors hover:bg-neutral-700 cursor-pointer"
        >
          {/* Plus Icon SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          <span>New chat</span>
        </Link>
        {/* Dashboard Button */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 w-full p-1.5 transition-colors hover:bg-neutral-100 cursor-pointer"
        >
          {/* Dashboard Icon SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
            />
          </svg>
          <span className="">Dashboard</span>
        </Link>
        {/* Profile Button */}
        <Link
          href="/profile"
          className="flex items-center gap-2 w-full p-1.5 transition-colors hover:bg-neutral-100 cursor-pointer"
        >
          {/* Profile Icon SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
          <span className="">Profile</span>
        </Link>
      </section>
      {/* Chat history */}
      <nav className="flex flex-col flex-1 p-2 overflow-y-auto">
        <p className="text-neutral-500 text-sm mb-1.5 ml-1.5">Recents</p>
        <ChatList chats={chatHistory} />
      </nav>
      {/* Sidebar footer */}
      <footer className="border-t border-neutral-200 p-1.5">
        <AccountMenu user={userDetails.user} />
      </footer>
    </aside>
  );
};

export default Sidebar;
