const Sidebar = () => {
  const history = Array.from({ length: 20 }, (_, i) => (
    <a
      key={i}
      href="#"
      className="w-full rounded-xl p-1 transition-colors hover:bg-neutral-100 cursor-pointer whitespace-nowrap overflow-x-clip text-ellipsis"
    >
      Lorem ipsum dolor sit amet consectetur
    </a>
  ));

  return (
    <aside className="flex flex-col w-66 border-r border-neutral-100 overflow-auto">
      <header className="flex flex-col border-b border-neutral-100 mb-2 p-1.5">
        <div className="flex items-center h-10">
          <img
            src="/brains.png"
            alt="BrainBytes Logo"
            className="w-6 h-6 mr-1"
          />
          <h1 className="text-center text-xl font-semibold">BrainBytes</h1>
        </div>
      </header>
      <section className="p-2 mb-2">
        {/* New chat button */}
        <button className="flex items-center justify-center gap-2 w-full rounded-xl bg-black text-white p-1.5 transition-colors hover:bg-neutral-700 cursor-pointer">
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
          <span className="text-sm font-medium">New chat</span>
        </button>
      </section>
      {/* Chat history */}
      <nav className="flex flex-col flex-1 p-2 overflow-y-auto">
        <p className="text-neutral-500 text-sm mb-1.5 ml-1.5">Recents</p>
        {history}
      </nav>
      {/* Sidebar footer */}
      <footer className="border-t border-neutral-100 p-1.5">
        <div className="flex p-1 rounded-lg hover:bg-neutral-100 cursor-pointer transition-colors">
          <div className="flex items-center">
            <img
              src="/userpp.jpeg"
              alt="BrainBytes Logo"
              className="w-10 h-10 mr-2 rounded-full"
            />
            <div className="flex flex-col">
              <span className="font-semibold text-sm">Emerson Sterling</span>
              <span className="text-xs text-neutral-500">
                sterling@gmail.com
              </span>
            </div>
          </div>
        </div>
      </footer>
    </aside>
  );
};

export default Sidebar;
