import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, COOKIE_NAME } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json(
      { ok: false, error: "Not authenticated" },
      { status: 401 }
    );
  }

  const session = await verifySessionToken(token);
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Invalid or expired session" },
      { status: 401 }
    );
  }

  return NextResponse.json({ ok: true, session });
}
