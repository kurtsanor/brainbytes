export interface SignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface JwtClaims {
  userId: string;
  role: string;
  iat: number;
  exp: number;
}
