import { SignInRequest, SignUpRequest } from "@/types/auth.types";
import { apiFetch } from "./client";

export const signUp = async (signUpRequest: SignUpRequest): Promise<any> => {
  const response = await apiFetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(signUpRequest),
  });
  return response;
};

export const signIn = async (signInRequest: SignInRequest): Promise<any> => {
  const response = await apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(signInRequest),
  });
  return response;
};
