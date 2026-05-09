import { SignUpRequest } from "@/types/auth.types";
import { apiFetch } from "./client";

export const signUp = async (signUpRequest: SignUpRequest): Promise<any> => {
  const response = await apiFetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(signUpRequest),
  });
  return response;
};
