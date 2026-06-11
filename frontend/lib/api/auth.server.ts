import type { User } from "@/types/user.types";
import { apiServerFetch } from "./api-server";

export type MeResponse = {
  user: User;
};

export const getMe = async (): Promise<MeResponse> => {
  const response = await apiServerFetch<MeResponse>("/api/auth/me", {
    method: "GET",
  });
  return response;
};
