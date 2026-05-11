import { apiServerFetch } from "./api-server";

export const getMe = async (): Promise<any> => {
  const response = await apiServerFetch("/api/auth/me", {
    method: "GET",
  });
  return response;
};
