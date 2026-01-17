import { NextResponse } from "next/server";

const API_URL = process.env.VHD_API_URL || "http://localhost:8001";

export async function GET() {
  try {
    const response = await fetch(`${API_URL}/health`, {
      method: "GET",
      headers: {
        "accept": "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { status: "unhealthy", error: "Backend service unavailable" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { status: "unhealthy", error: "Failed to connect to backend service" },
      { status: 503 }
    );
  }
}
