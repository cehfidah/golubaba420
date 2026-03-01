import { NextRequest, NextResponse } from "next/server";
import {
  getSearchAuthCookieName,
  verifySearchAuthToken,
} from "@/lib/search-auth";

const API_URL = "https://leakosintapi.com/";

function isPlaceholderToken(token: string): boolean {
  const normalized = token.trim().toLowerCase();
  return (
    normalized.length === 0 ||
    normalized === "your_api_token_here" ||
    normalized === "replace_with_real_token" ||
    normalized.includes("your_")
  );
}

export async function POST(request: NextRequest) {
  try {
    // Read environment variables at request time, not module load time
    const API_TOKEN = process.env.LEAKOSINT_API_TOKEN;
    const SEARCH_AUTH_SECRET = process.env.SEARCH_AUTH_SECRET;

    if (!API_TOKEN) {
      return NextResponse.json(
        { error: "Server is missing LEAKOSINT_API_TOKEN configuration" },
        { status: 500 }
      );
    }

    if (isPlaceholderToken(API_TOKEN)) {
      return NextResponse.json(
        {
          error:
            "Invalid LEAKOSINT_API_TOKEN. Set a real API token in .env.local and restart server.",
        },
        { status: 500 }
      );
    }

    if (!SEARCH_AUTH_SECRET) {
      return NextResponse.json(
        { error: "Server is missing SEARCH_AUTH_SECRET configuration" },
        { status: 500 }
      );
    }

    const authCookie = request.cookies.get(getSearchAuthCookieName())?.value;

    if (!authCookie || !verifySearchAuthToken(authCookie, SEARCH_AUTH_SECRET)) {
      return NextResponse.json(
        { error: "Unauthorized. Please verify PIN first." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { query, limit = 100, lang = "en" } = body;

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    const sanitizedLimit = Math.min(Math.max(Number(limit) || 100, 100), 10000);

    const data = {
      token: API_TOKEN,
      request: query.trim(),
      limit: sanitizedLimit,
      lang: lang,
    };

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if ("Error code" in result) {
      const errorCode = String(result["Error code"] || "").toLowerCase();
      const errorMessage = String(result["Error"] || "").toLowerCase();

      if (errorCode.includes("bad token") || errorMessage.includes("bad token")) {
        return NextResponse.json(
          {
            error:
              "Search API token rejected by provider. Update LEAKOSINT_API_TOKEN in .env.local.",
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { error: result["Error code"], message: result["Error"] || "API Error" },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch results. Please try again." },
      { status: 500 }
    );
  }
}
