import client from "prom-client";

client.collectDefaultMetrics();

export const httpRequestsTotal = new client.Counter({
  name: "brainbytes_http_requests_total",
  help: "Total number of HTTP requests handled by the backend",
  labelNames: ["method", "route", "status_code"],
});

export const activeUsersGauge = new client.Gauge({
  name: "brainbytes_active_users",
  help: "Estimated number of currently active users",
});

export const aiResponseDuration = new client.Histogram({
  name: "brainbytes_ai_response_duration_seconds",
  help: "AI response generation duration in seconds",
  buckets: [0.1, 0.5, 1, 2, 3, 5, 10],
});

export const mobileRequestsTotal = new client.Counter({
  name: "brainbytes_mobile_requests_total",
  help: "Total number of requests coming from mobile user agents",
});

export const estimatedDataUsageBytes = new client.Counter({
  name: "brainbytes_estimated_data_usage_bytes_total",
  help: "Estimated response data usage in bytes",
  labelNames: ["route"],
});

export const intermittentConnectivityTotal = new client.Counter({
  name: "brainbytes_intermittent_connectivity_events_total",
  help: "Estimated intermittent connectivity events based on failed or aborted requests",
});

export const register = client.register;