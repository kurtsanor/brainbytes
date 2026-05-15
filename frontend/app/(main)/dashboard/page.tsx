import Link from "next/link";

const DashboardPage = () => {
  return (
    <div className="w-full max-w-5xl p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Learning Dashboard</h1>
        <p className="text-neutral-500 mt-1">
          Track your recent learning activity and chat progress.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="border border-neutral-200 rounded-lg p-5 bg-white">
          <p className="text-sm text-neutral-500">Total Chat Sessions</p>
          <h2 className="text-3xl font-semibold mt-2">0</h2>
        </div>

        <div className="border border-neutral-200 rounded-lg p-5 bg-white">
          <p className="text-sm text-neutral-500">Messages Sent</p>
          <h2 className="text-3xl font-semibold mt-2">0</h2>
        </div>

        <div className="border border-neutral-200 rounded-lg p-5 bg-white">
          <p className="text-sm text-neutral-500">Last Active</p>
          <h2 className="text-3xl font-semibold mt-2">Today</h2>
        </div>
      </div>

      <div className="border border-neutral-200 rounded-lg p-5 bg-white mb-6">
        <h2 className="text-xl font-semibold mb-3">Recent Learning Activity</h2>
        <p className="text-neutral-500">
          Your recent chats and learning sessions will appear here.
        </p>
      </div>

      <Link
        href="/chat"
        className="inline-flex bg-black text-white px-5 py-3 rounded-md hover:bg-neutral-800 transition-colors"
      >
        Start New Chat
      </Link>
    </div>
  );
};

export default DashboardPage;
