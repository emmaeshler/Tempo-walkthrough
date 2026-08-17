import { NextResponse } from "next/server";

const AUTH_ADMIN_URL =
  process.env.AUTH_ADMIN_URL || "https://password-admin.vercel.app";
const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://commercial-supply-solutions.vercel.app";

export async function GET() {
  const callbackUrl = `${BASE_URL}/api/auth/callback`;
  const ssoUrl = `${AUTH_ADMIN_URL}/auth?app=apax-demo&redirect=${encodeURIComponent(callbackUrl)}`;
  return NextResponse.redirect(ssoUrl);
}
