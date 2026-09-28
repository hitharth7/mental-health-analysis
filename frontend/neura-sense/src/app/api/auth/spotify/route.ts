import { NextResponse } from "next/server";
import crypto from "crypto";
import { adminDB } from "@/lib/firebaseAdmin";

export async function GET(req: Request) {
  const state = crypto.randomUUID();

  // Store temporary state for the logged-in user
  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI || "http://localhost:3000/api/auth/spotify/callback";

  if (!clientId || clientId === "your_spotify_client_id") {
    return NextResponse.json(
      { error: "Spotify API credentials are not configured in .env.local" },
      { status: 400 }
    );
  }

  let uid = "anonymous_user";
  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: token }),
      }
    );
    const data = await res.json();
    if (data?.users?.[0]?.localId) {
      uid = data.users[0].localId;
    }
  } catch {
    // Fallback if Firebase API is placeholder
  }

  try {
    await adminDB.collection("oauth_temp").doc(state).set({ uid, provider: "spotify" });
  } catch {
    // Firestore admin fallback
  }

  const scope = [
    "user-read-recently-played",
    "user-top-read",
    "user-read-currently-playing",
    "user-read-playback-state",
  ].join(" ");

  const queryParams = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope,
    redirect_uri: redirectUri,
    state,
  });

  return NextResponse.redirect(`https://accounts.spotify.com/authorize?${queryParams.toString()}`);
}
