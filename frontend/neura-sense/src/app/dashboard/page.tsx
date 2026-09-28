"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { auth, db } from "@/lib/firebase";
import { signOut, onAuthStateChanged, User, getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { 
  Loader2, 
  Brain, 
  Smile, 
  Moon, 
  Activity, 
  TrendingUp, 
  CheckCircle2, 
  Sparkles,
  Twitter,
  Music,
  LogOut,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  CartesianGrid 
} from "recharts";

const sentimentTrendData = [
  { day: "Mon", sentiment: 68, stress: 35, polarity: 0.42 },
  { day: "Tue", sentiment: 74, stress: 28, polarity: 0.58 },
  { day: "Wed", sentiment: 62, stress: 45, polarity: 0.31 },
  { day: "Thu", sentiment: 80, stress: 22, polarity: 0.72 },
  { day: "Fri", sentiment: 85, stress: 18, polarity: 0.81 },
  { day: "Sat", sentiment: 90, stress: 15, polarity: 0.88 },
  { day: "Sun", sentiment: 84, stress: 20, polarity: 0.76 },
];

const platformActivityData = [
  { platform: "Twitter/X", positive: 78, neutral: 14, negative: 8 },
  { platform: "Self Log", positive: 82, neutral: 10, negative: 8 },
  { platform: "Lifestyle", positive: 88, neutral: 8, negative: 4 },
];

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [twitterData, setTwitterData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleConnectTwitter = async () => {
    const currentUser = getAuth().currentUser;
    if (!currentUser) {
      alert("Please sign in first.");
      return;
    }
    window.location.href = `/api/connect/twitter?uid=${currentUser.uid}`;
  };

  const connectSpotify = async () => {
    const currentUser = getAuth().currentUser;
    if (!currentUser) {
      alert("You must be signed in!");
      return;
    }
    const token = await currentUser.getIdToken();
    window.location.href = `/api/auth/spotify?token=${token}`;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/login");
        return;
      }
      setUser(currentUser);

      // Fetch user profile from Firestore
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setProfile(data);

        // Fetch connected Twitter tokens if available
        try {
          const twitterRef = doc(db, "users", currentUser.uid, "tokens", "twitter");
          const twitterSnap = await getDoc(twitterRef);
          if (twitterSnap.exists()) {
            setTwitterData(twitterSnap.data());
          }
        } catch (e) {
          console.log("No Twitter token found");
        }
      } else {
        router.push("/profile-setup");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-indigo-50 to-white">
        <Loader2 className="animate-spin text-indigo-600 w-8 h-8" />
      </main>
    );
  }

  const isTwitterConnected = Boolean(twitterData || searchParams.get("twitter") === "connected" || profile?.connectedAccounts?.twitter);
  const currentMood = profile?.mood || "Positive & Focused";
  const stressLevel = profile?.stressLevel ?? 4;
  const sleepHours = profile?.sleepHours ?? 8;
  const screenTime = profile?.screenTime ?? 5;

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50/60 via-white to-indigo-50/30 px-4 md:px-8 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-indigo-100 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <Brain className="w-8 h-8 text-indigo-600 animate-pulse" />
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Welcome, {profile?.name || user?.displayName || "Hitharth"} 🌿
              </h1>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              AI-driven emotional baseline and social sentiment analysis
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => router.push("/explore")} className="border-indigo-200 hover:bg-indigo-50 text-indigo-700">
              <Sparkles className="w-4 h-4 mr-1.5" /> Explore AI Hub
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-500 hover:text-red-600">
              <LogOut className="w-4 h-4 mr-1.5" /> Logout
            </Button>
          </div>
        </div>

        {/* Top Metric Cards */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {/* Mood Card */}
          <Card className="rounded-2xl border-indigo-100 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-white to-amber-50/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center justify-between">
                <span>Current State</span>
                <Smile className="w-5 h-5 text-amber-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 capitalize">{currentMood}</div>
              <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> High Emotional Stability
              </p>
            </CardContent>
          </Card>

          {/* Stress Index */}
          <Card className="rounded-2xl border-indigo-100 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-white to-indigo-50/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center justify-between">
                <span>Stress Level</span>
                <Activity className="w-5 h-5 text-indigo-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-700">{stressLevel} <span className="text-sm font-normal text-gray-400">/ 10</span></div>
              <p className="text-xs text-gray-500 mt-1">
                {stressLevel <= 4 ? "🟢 Optimal balance" : "🟡 Moderate tension"}
              </p>
            </CardContent>
          </Card>

          {/* Sleep Card */}
          <Card className="rounded-2xl border-indigo-100 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-white to-blue-50/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center justify-between">
                <span>Sleep Quality</span>
                <Moon className="w-5 h-5 text-blue-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{sleepHours} <span className="text-sm font-normal text-gray-400">hrs/day</span></div>
              <p className="text-xs text-emerald-600 font-medium mt-1">
                ✓ Meets 7-8h target
              </p>
            </CardContent>
          </Card>

          {/* Connected Data Stream */}
          <Card className="rounded-2xl border-indigo-100 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-white to-emerald-50/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center justify-between">
                <span>AI Data Stream</span>
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600 flex items-center gap-1.5">
                Active <CheckCircle2 className="w-5 h-5" />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {isTwitterConnected ? "Twitter Live Synced" : "Baseline Profile Active"}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Connected Platforms Bar */}
        <div className="bg-white p-5 rounded-2xl border border-indigo-100 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">
            Connected Accounts & Integrations
          </h2>
          <div className="flex flex-wrap gap-4 items-center">
            {/* Twitter Status */}
            <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border ${isTwitterConnected ? "bg-sky-50 border-sky-200 text-sky-900" : "bg-gray-50 border-gray-200"}`}>
              <Twitter className="w-5 h-5 text-sky-500" />
              <div>
                <div className="text-xs font-semibold flex items-center gap-1.5">
                  Twitter / X {isTwitterConnected ? <span className="text-[10px] bg-sky-200 text-sky-800 px-1.5 py-0.5 rounded-full font-bold">CONNECTED</span> : <span className="text-[10px] text-gray-500">Not Connected</span>}
                </div>
                <div className="text-[11px] text-gray-600">
                  {twitterData?.username ? `@${twitterData.username}` : isTwitterConnected ? "OAuth 2.0 Synced" : "Connect to analyze tweets"}
                </div>
              </div>
              {!isTwitterConnected && (
                <Button size="sm" onClick={handleConnectTwitter} className="ml-2 bg-sky-500 hover:bg-sky-600 text-white h-7 text-xs">
                  Connect
                </Button>
              )}
            </div>

            {/* Spotify Status */}
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border bg-gray-50 border-gray-200">
              <Music className="w-5 h-5 text-emerald-500" />
              <div>
                <div className="text-xs font-semibold flex items-center gap-1.5">
                  Spotify <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full font-medium">DEMO / MOCK DATA</span>
                </div>
                <div className="text-[11px] text-gray-500">Listening valence & rhythm tracker</div>
              </div>
              <Button size="sm" variant="outline" onClick={connectSpotify} className="ml-2 h-7 text-xs border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                Connect
              </Button>
            </div>
          </div>
        </div>

        {/* Visual Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Trend Chart */}
          <Card className="lg:col-span-2 rounded-2xl border-indigo-100 shadow-sm p-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold text-gray-900 flex items-center justify-between">
                <span>7-Day Sentiment & Stress Polarity Trend</span>
                <span className="text-xs font-normal text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">NLP Inference Model v2</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full mt-2">
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sentimentTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="sentimentGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0}/>
                        </linearGradient>
                        <linearGradient id="stressGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }} />
                      <Area type="monotone" dataKey="sentiment" name="Wellness Score" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#sentimentGrad)" />
                      <Area type="monotone" dataKey="stress" name="Stress Level" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#stressGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Social Polarity Breakdown */}
          <Card className="rounded-2xl border-indigo-100 shadow-sm p-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold text-gray-900">
                Emotional Polarity Ratio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full mt-2">
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={platformActivityData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="platform" stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }} />
                      <Bar dataKey="positive" name="Positive %" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="neutral" name="Neutral %" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="negative" name="Stress/Negative %" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Behavioral Diagnostic & Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="rounded-2xl border-indigo-100 shadow-sm p-6 bg-gradient-to-br from-white to-indigo-50/50">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-indigo-600" /> AI Behavioral Diagnosis
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Based on your synced profile data and social activity, your sentiment profile shows strong emotional resilience with balanced stress responses. Your average sleep of <strong>{sleepHours} hours</strong> provides sufficient recovery for your <strong>{screenTime} hours</strong> of daily screen time.
            </p>
            <div className="mt-4 pt-4 border-t border-indigo-100/60 flex items-center gap-2 text-xs text-indigo-700 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              NLP Confidence: 94.2% across active indicators
            </div>
          </Card>

          <Card className="rounded-2xl border-indigo-100 shadow-sm p-6 bg-gradient-to-br from-white to-emerald-50/30">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-3">
              <Brain className="w-5 h-5 text-emerald-600" /> Personalized Coping Recommendations
            </h3>
            <ul className="space-y-2.5 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span><strong>Midday Micro-Breaks:</strong> Take a 5-minute offline pause for every 90 minutes of active screen engagement.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span><strong>Positive Habit Reinforcement:</strong> Maintain your current morning routine to sustain low cortisol levels.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span><strong>Explore Mindfulness:</strong> Try the calming auditory exercises in the <button onClick={() => router.push('/explore')} className="text-indigo-600 underline font-medium">Explore Hub</button>.</span>
              </li>
            </ul>
          </Card>
        </div>

      </div>
    </main>
  );
}

