import { apiServerFetch } from "@/lib/api/api-server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const loginRequest = await request.json();

  const data: { response: string } = await apiServerFetch<{ response: string }>(
    "/api/auth/login",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginRequest),
    },
  );

  // Set the cookie in Next.js
  const cookieStore = await cookies();
  cookieStore.set("session-token", data.response, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    path: "/",
  });

  return NextResponse.json({ success: true, token: data.response });
}
