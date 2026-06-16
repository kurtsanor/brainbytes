const DEFAULT_SERVER_API_BASE_URL = "http://backend:3001";
const DEFAULT_CLIENT_API_BASE_URL = "http://localhost:3001";

const getApiBaseUrl = (): string => {
  // Server-side (Docker / Next SSR)
  if (typeof window === "undefined") {
    return (
      process.env.API_BASE_URL_SERVER ||
      process.env.API_BASE_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      DEFAULT_SERVER_API_BASE_URL
    );
  }

  return process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_CLIENT_API_BASE_URL;
};

const buildApiUrl = (endpoint: string): string => {
  const baseUrl = getApiBaseUrl().replace(/\/$/, "");
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${baseUrl}${path}`;
};

const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("session-token");
};

export async function apiClientFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const token = getToken();

  let headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options?.headers,
  };

  if (token) {
    headers = {
      ...headers,
      Authorization: `Bearer ${token}`,
    };
  }

  const res = await fetch(buildApiUrl(endpoint), {
    ...options,
    headers,
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}
