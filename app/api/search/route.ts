import { NextRequest, NextResponse } from "next/server";

const API_URL = "https://leakosintapi.com/";
const API_TOKEN = process.env.LEAKOSINT_API_TOKEN || "6512523069:ui73uF3d";

export async function POST(request: NextRequest) {
  try {
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
