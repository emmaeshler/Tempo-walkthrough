import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, COOKIE_NAME } from "@/lib/auth";

const AUTH_ADMIN_URL =
  process.env.AUTH_ADMIN_URL || "https://password-admin.vercel.app";
const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://commercial-supply-solutions.vercel.app";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") || "";

  if (!token) {
    return redirectToSSO("invalid_token");
  }

  const apiKey = process.env.AUTH_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Auth service not configured" },
      { status: 500 }
    );
  }

  try {
    const exchangeRes = await fetch(`${AUTH_ADMIN_URL}/api/auth/exchange`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({ token }),
    });

    if (!exchangeRes.ok) {
      return redirectToSSO("invalid_token");
    }

    const data = await exchangeRes.json();
    if (!data.user) {
      return redirectToSSO("invalid_token");
    }

    const nameParts = [data.user.firstName, data.user.lastName].filter(Boolean);
    const jwt = await createSessionToken({
      email: data.user.email,
      displayName: nameParts.length > 0 ? nameParts.join(" ") : undefined,
    });

    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.set(COOKIE_NAME, jwt, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 86400,
      secure: process.env.VERCEL === "1",
    });
    return response;
  } catch {
    return redirectToSSO("exchange_failed");
  }
}

function redirectToSSO(error: string) {
  const callbackUrl = `${BASE_URL}/api/auth/callback`;
  const ssoUrl = `${AUTH_ADMIN_URL}/auth?app=apax-demo&redirect=${encodeURIComponent(callbackUrl)}&error=${error}`;
  return NextResponse.redirect(ssoUrl);
}
