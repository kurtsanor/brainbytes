import { DashboardAnalyticsWithSeries } from "@/types/analytics.types";
import { apiServerFetch } from "./api-server";

export const getUserAnalytics = async (
  days = 7,
): Promise<DashboardAnalyticsWithSeries> =>
  apiServerFetch<{ data: DashboardAnalyticsWithSeries }>(
    `/api/analytics?days=${days}`,
    {
      method: "GET",
    },
  ).then((res) => res.data);
