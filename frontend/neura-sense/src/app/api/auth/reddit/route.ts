import { NextResponse } from "next/server";
import { adminAuth, adminDB } from "@/lib/firebaseAdmin";
import crypto from "crypto";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const clientId = process.env.REDDIT_CLIENT_ID;
    const redirectUri = process.env.REDDIT_REDIRECT_URI || "http://localhost:3000/api/auth/reddit/callback";

    if (!clientId || clientId === "your_reddit_client_id") {
      return NextResponse.json(
        { error: "Reddit API credentials are not configured in .env.local" },
        { status: 400 }
      );
    }

    let uid = "anonymous_user";
    try {
      const decoded = await adminAuth.verifyIdToken(token);
      uid = decoded.uid;
    } catch {
      // If adminAuth is unconfigured, fallback to decoded/mock user
    }

    const state = crypto.randomUUID();

    try {
      await adminDB.collection("oauth_temp").doc(state).set({
        uid,
        createdAt: new Date(),
      });
    } catch {
      // Firestore admin skip if unconfigured
    }

    const redditAuthUrl = new URL("https://www.reddit.com/api/v1/authorize");
    redditAuthUrl.searchParams.set("client_id", clientId);
    redditAuthUrl.searchParams.set("response_type", "code");
    redditAuthUrl.searchParams.set("state", state);
    redditAuthUrl.searchParams.set("redirect_uri", redirectUri);
    redditAuthUrl.searchParams.set("duration", "permanent");
    redditAuthUrl.searchParams.set("scope", "identity read history");

    return NextResponse.redirect(redditAuthUrl.toString());
  } catch (err: any) {
    console.error("Reddit Auth Error:", err);
    return NextResponse.json({ error: "Failed to authenticate user" }, { status: 401 });
  }
}
