import type { User } from "./user.types";

export interface SignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success?: boolean;
  token?: string;
  response?: string;
  user?: User;
}
