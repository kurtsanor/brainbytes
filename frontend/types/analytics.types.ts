export interface DashboardAnalytics {
  totalChatSessions: number;
  totalMessagesSent: number;
  lastActiveChat: string; // ISO date string
}

export interface TimeSeries {
  labels: string[];
  messages: number[];
  sessions: number[];
  avgMsgsPerSession: number[];
}

export interface DashboardAnalyticsWithSeries extends DashboardAnalytics {
  timeSeries: TimeSeries;
}
