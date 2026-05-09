const DEFAULT_SERVER_API_BASE_URL = "http://backend:3001";
const DEFAULT_CLIENT_API_BASE_URL = "http://localhost:3001";

const getApiBaseUrl = (): string => {
  // Server-side fetch
  if (typeof window === "undefined") {
    return (
      process.env.API_BASE_URL_SERVER ||
      process.env.API_BASE_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      DEFAULT_SERVER_API_BASE_URL
    );
  }

  // Client-side code runs in the browser and cannot resolve Docker service names.
  return process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_CLIENT_API_BASE_URL;
};

const buildApiUrl = (endpoint: string): string => {
  const baseUrl = getApiBaseUrl().replace(/\/$/, "");
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${baseUrl}${path}`;
};

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit & { next?: NextFetchRequestConfig },
): Promise<T> {
  const res = await fetch(buildApiUrl(endpoint), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  // if (!res.ok) {
  //   throw new Error(`API error: ${res.status} ${res.statusText}`);
  // }

  return res.json() as Promise<T>;
}
