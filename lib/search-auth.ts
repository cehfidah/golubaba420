import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "search_auth";
const MAX_AGE_SECONDS = 60 * 60 * 12;

function base64UrlEncode(input: string): string {
  return Buffer.from(input, "utf8").toString("base64url");
}

function base64UrlDecode(input: string): string {
  return Buffer.from(input, "base64url").toString("utf8");
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function getSearchAuthCookieName(): string {
  return COOKIE_NAME;
}

export function getSearchAuthCookieMaxAgeSeconds(): number {
  return MAX_AGE_SECONDS;
}

export function createSearchAuthToken(secret: string): string {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS;
  const payload = base64UrlEncode(JSON.stringify({ exp }));
  const signature = sign(payload, secret);
  return `${payload}.${signature}`;
}

export function verifySearchAuthToken(token: string, secret: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [payload, providedSignature] = parts;
  const expectedSignature = sign(payload, secret);

  const provided = Buffer.from(providedSignature, "utf8");
  const expected = Buffer.from(expectedSignature, "utf8");

  if (provided.length !== expected.length) {
    return false;
  }

  if (!timingSafeEqual(provided, expected)) {
    return false;
  }

  try {
    const parsed = JSON.parse(base64UrlDecode(payload)) as { exp?: number };
    return typeof parsed.exp === "number" && parsed.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}
