import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  // Set the cookie in Next.js
  const cookieStore = await cookies();
  cookieStore.delete("session-token");

  return NextResponse.json({ success: true });
}
