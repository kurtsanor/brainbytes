import { getUserAnalytics } from "@/lib/api/analytics.server";
import { formatLastActiveChat } from "@/lib/utils/date";
import LineChart from "@/components/LineChart";

const DashboardPage = async () => {
  const analytics = await getUserAnalytics(7);

  return (
    <div className="w-full max-w-4xl p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Learning Dashboard</h1>
        <p className="text-neutral-500 mt-1">
          Track your recent learning activity and chat progress.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="border border-neutral-200 p-4 bg-white flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-neutral-500">Total Chat Sessions</p>
            <h2 className="text-2xl font-semibold mt-2">
              {analytics.totalChatSessions}
            </h2>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="h-5 w-5 shrink-0 text-neutral-700 mt-1"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.5 8.25h9m-9 4.5h6m-6 7.5a3 3 0 01-3-3v-11.25a3 3 0 013-3h9a3 3 0 013 3V18a3 3 0 01-3 3H7.5z"
            />
          </svg>
        </div>

        <div className="border border-neutral-200 p-4 bg-white flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-neutral-500">Messages Sent</p>
            <h2 className="text-2xl font-semibold mt-2">
              {analytics.totalMessagesSent}
            </h2>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="h-5 w-5 shrink-0 text-neutral-700 mt-1"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 12a8.25 8.25 0 1116.5 0v5.25a1.5 1.5 0 001.5 1.5h.75M8.25 12h7.5M12 8.25v7.5"
            />
          </svg>
        </div>

        <div className="border border-neutral-200 p-4 bg-white flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-neutral-500">Last Active</p>
            <h2 className="text-2xl font-semibold mt-2">
              {formatLastActiveChat(analytics.lastActiveChat)}
            </h2>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="h-5 w-5 shrink-0 text-neutral-700 mt-1"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6l4 2m5 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>

      <div className="">
        <LineChart days={7} chartData={analytics.timeSeries} />
      </div>
    </div>
  );
};

export default DashboardPage;
