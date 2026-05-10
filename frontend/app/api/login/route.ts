import { apiFetch } from "@/lib/api/client";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const loginRequest = await request.json();

  const data: { response: string } = await apiFetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(loginRequest),
  });

  // Set the cookie in Next.js
  const cookieStore = await cookies();
  cookieStore.set("session-token", data.response, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return NextResponse.json({ success: true });
}
