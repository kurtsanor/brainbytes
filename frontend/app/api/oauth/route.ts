import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { token } = await request.json();

  const cookieStore = await cookies();

  cookieStore.set("session-token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 60 * 60,
  });

  return NextResponse.json({
    success: true,
  });
}
