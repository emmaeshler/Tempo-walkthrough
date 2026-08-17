import { SignJWT, jwtVerify } from "jose";

export interface SessionPayload {
  email: string;
  displayName?: string;
}

export const COOKIE_NAME = "session";

export function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET env var is not set");
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(
  payload: SessionPayload
): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(getSecret());
}

export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      email: payload.email as string,
      displayName: (payload.displayName as string) || undefined,
    };
  } catch {
    return null;
  }
}
