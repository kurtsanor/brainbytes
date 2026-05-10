"use client";

const Sidebar = () => {
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        window.location.href = "/sign-in";
      }
    } catch (error) {
      console.error("An error occurred while logging out:", error);
    }
  };

  const history = Array.from({ length: 20 }, (_, i) => (
    <a
      key={i}
      href="#"
      className="w-full leading-relaxed py-1 px-2 transition-colors hover:bg-neutral-100 cursor-pointer whitespace-nowrap overflow-x-clip text-ellipsis"
    >
      Lorem ipsum dolor sit amet consectetur
    </a>
  ));

  return (
    <aside className="flex-col w-66 border-r border-neutral-200 overflow-auto hidden md:flex">
      <header className="flex flex-col p-1.5">
        <div className="flex items-center h-10 pl-1">
          <img
            src="/bblogo1.png"
            alt="BrainBytes Logo"
            className="w-7 h-7 mr-1"
          />
          <h1 className="text-lg font-semibold tracking-tight">BrainBytes</h1>
        </div>
      </header>
      <section className="p-2 mb-2 flex flex-col gap-1">
        {/* New chat button */}
        <button className="flex items-center justify-center gap-2 w-full bg-black text-white p-1.5 transition-colors hover:bg-neutral-700 cursor-pointer">
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
        </button>
        {/* Dashboard Button */}
        <button className="flex items-center gap-2 w-full p-1.5 transition-colors hover:bg-neutral-100 cursor-pointer">
          {/* Dashboard Icon SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
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
        </button>
        {/* Profile Button */}
        <button className="flex items-center gap-2 w-full p-1.5 transition-colors hover:bg-neutral-100 cursor-pointer">
          {/* Profile Icon SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
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
        </button>
      </section>
      {/* Chat history */}
      <nav className="flex flex-col flex-1 p-2 overflow-y-auto">
        <p className="text-neutral-500 text-sm mb-1.5 ml-1.5">Recents</p>
        {history}
      </nav>
      {/* Sidebar footer */}
      <footer className="border-t border-neutral-200 p-1.5">
        <div className="flex items-center justify-between p-2 hover:bg-neutral-100 cursor-pointer transition-colors rounded-lg group">
          {/* Left Side: User Info */}
          <div className="flex items-center">
            <img
              src="/userpp.jpeg"
              alt="User Profile"
              className="w-10 h-10 mr-2 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <span className="font-semibold text-sm">Emerson Sterling</span>
              <span className="text-xs text-neutral-500">
                sterling@gmail.com
              </span>
            </div>
          </div>

          {/* Right Side: Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="p-2 hover:bg-neutral-200 rounded-md transition-colors text-neutral-500 hover:text-red-600"
            title="Logout"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </footer>
    </aside>
  );
};

export default Sidebar;
