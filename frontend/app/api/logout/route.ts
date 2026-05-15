import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Set the cookie in Next.js
  const cookieStore = await cookies();
  cookieStore.delete("session-token");

  return NextResponse.json({ success: true });
}
