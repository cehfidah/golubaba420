import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import {
  createSearchAuthToken,
  getSearchAuthCookieMaxAgeSeconds,
  getSearchAuthCookieName,
} from "@/lib/search-auth";

const SEARCH_PIN = process.env.SEARCH_PIN;
const SEARCH_AUTH_SECRET = process.env.SEARCH_AUTH_SECRET;

function isValidPin(pin: string, expectedPin: string): boolean {
  const provided = Buffer.from(pin, "utf8");
  const expected = Buffer.from(expectedPin, "utf8");

  if (provided.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(provided, expected);
}

export async function POST(request: NextRequest) {
  try {
    if (!SEARCH_PIN) {
      return NextResponse.json(
        { error: "Server is missing SEARCH_PIN configuration" },
        { status: 500 }
      );
    }

    if (!SEARCH_AUTH_SECRET) {
      return NextResponse.json(
        { error: "Server is missing SEARCH_AUTH_SECRET configuration" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const pin = body?.pin;

    if (!pin || typeof pin !== "string") {
      return NextResponse.json({ error: "PIN code is required" }, { status: 401 });
    }

    if (!isValidPin(pin, SEARCH_PIN)) {
      return NextResponse.json({ error: "Invalid PIN code" }, { status: 403 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(getSearchAuthCookieName(), createSearchAuthToken(SEARCH_AUTH_SECRET), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: getSearchAuthCookieMaxAgeSeconds(),
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Failed to verify PIN" }, { status: 500 });
  }
}
