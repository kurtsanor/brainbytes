import { SignInRequest, SignUpRequest } from "@/types/auth.types";
import { apiClientFetch } from "./api-client";

export const signUp = async (signUpRequest: SignUpRequest) => {
  const response = await apiClientFetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(signUpRequest),
  });
  return response;
};

export const signIn = async (signInRequest: SignInRequest) => {
  const response = await apiClientFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(signInRequest),
  });
  return response;
};
