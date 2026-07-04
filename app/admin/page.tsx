"use client";

import { useEffect, useState } from "react";
import {
  SeeYourselfResponseRow,
  SessionRow,
  SlideshowResponseRow,
  supabase,
} from "@/lib/supabase";
import { TOTAL_PAIRS } from "@/lib/content";

type CompletionInfo = { slideshowCount: number; hasSeeYourself: boolean };

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  const handleLogin = async () => {
    setChecking(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.ok) {
        setAuthed(true);
      } else {
        setError(data.error ?? "Incorrect password.");
      }
    } catch {
      setError("Could not verify password. Please try again.");
    } finally {
      setChecking(false);
    }
  };

  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-sm bg-white border border-gray-300 rounded p-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">
            Admin Login
          </h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Password"
            className="w-full border border-gray-300 rounded px-3 py-2 text-lg mb-3"
            autoFocus
          />
          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
          <button
            onClick={handleLogin}
            disabled={checking || !password}
            className="w-full bg-gray-800 text-white rounded py-2 text-lg disabled:opacity-50"
          >
            {checking ? "Checking..." : "Log In"}
          </button>
        </div>
      </main>
    );
  }

  return <AdminDashboard />;
}

function AdminDashboard() {
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [completion, setCompletion] = useState<Map<string, CompletionInfo>>(new Map());
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [slideshowByExpanded, setSlideshowByExpanded] = useState<
    SlideshowResponseRow[]
  >([]);
  const [seeYourselfByExpanded, setSeeYourselfByExpanded] = useState<
    SeeYourselfResponseRow[]
  >([]);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    (async () => {
      const [sessionsRes, slideshowRes, seeYourselfRes] = await Promise.all([
        supabase.from("sessions").select("*").order("created_at", { ascending: false }),
        supabase.from("slideshow_responses").select("session_id"),
        supabase.from("see_yourself_responses").select("session_id"),
      ]);

      if (!sessionsRes.error && sessionsRes.data) setSessions(sessionsRes.data as SessionRow[]);

      const map = new Map<string, CompletionInfo>();
      (slideshowRes.data as { session_id: string }[] | null)?.forEach((r) => {
        const entry = map.get(r.session_id) ?? { slideshowCount: 0, hasSeeYourself: false };
        entry.slideshowCount += 1;
        map.set(r.session_id, entry);
      });
      (seeYourselfRes.data as { session_id: string }[] | null)?.forEach((r) => {
        const entry = map.get(r.session_id) ?? { slideshowCount: 0, hasSeeYourself: false };
        entry.hasSeeYourself = true;
        map.set(r.session_id, entry);
      });
      setCompletion(map);
      setLoading(false);
    })();
  }, []);

  const toggleExpand = async (sessionId: string) => {
    if (expanded === sessionId) {
      setExpanded(null);
      return;
    }
    setExpanded(sessionId);

    const [slideshowRes, seeYourselfRes] = await Promise.all([
      supabase
        .from("slideshow_responses")
        .select("*")
        .eq("session_id", sessionId)
        .order("pair_number", { ascending: true }),
      supabase
        .from("see_yourself_responses")
        .select("*")
        .eq("session_id", sessionId),
    ]);

    setSlideshowByExpanded((slideshowRes.data as SlideshowResponseRow[]) ?? []);
    setSeeYourselfByExpanded(
      (seeYourselfRes.data as SeeYourselfResponseRow[]) ?? [],
    );
  };

  const exportCsv = async () => {
    setExporting(true);
    try {
      const [
        { data: allSessions },
        { data: allSlideshow },
        { data: allSeeYourself },
      ] = await Promise.all([
        supabase.from("sessions").select("*"),
        supabase.from("slideshow_responses").select("*"),
        supabase.from("see_yourself_responses").select("*"),
      ]);

      const sessionsById = new Map(
        (allSessions as SessionRow[] | null)?.map((s) => [s.id, s]),
      );

      const rows: string[][] = [
        [
          "session_id",
          "participant_id",
          "mode",
          "session_created_at",
          "response_type",
          "pair_number",
          "answer",
          "confidence",
          "response_created_at",
        ],
      ];

      (allSlideshow as SlideshowResponseRow[] | null)?.forEach((r) => {
        const s = sessionsById.get(r.session_id);
        rows.push([
          r.session_id,
          s?.participant_id ?? "",
          s?.mode ?? "",
          s?.created_at ?? "",
          "slideshow",
          String(r.pair_number),
          r.answer,
          String(r.confidence),
          r.created_at,
        ]);
      });

      (allSeeYourself as SeeYourselfResponseRow[] | null)?.forEach((r) => {
        const s = sessionsById.get(r.session_id);
        rows.push([
          r.session_id,
          s?.participant_id ?? "",
          s?.mode ?? "",
          s?.created_at ?? "",
          "see_yourself",
          "",
          r.answer,
          String(r.confidence),
          r.created_at,
        ]);
      });

      const csv = rows
        .map((row) =>
          row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
        )
        .join("\n");

      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `privacystudy_export_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Admin</h1>
          <button
            onClick={exportCsv}
            disabled={exporting}
            className="bg-gray-800 text-white rounded px-4 py-2 text-sm disabled:opacity-50"
          >
            {exporting ? "Exporting..." : "Export CSV"}
          </button>
        </div>

        {loading ? (
          <p className="text-gray-600">Loading sessions...</p>
        ) : (
          <div className="bg-white border border-gray-300 rounded overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-2">Participant ID</th>
                  <th className="px-4 py-2">Mode</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Completion</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => (
                  <SessionRowView
                    key={s.id}
                    session={s}
                    completion={completion.get(s.id) ?? { slideshowCount: 0, hasSeeYourself: false }}
                    expanded={expanded === s.id}
                    onToggle={() => toggleExpand(s.id)}
                    slideshow={expanded === s.id ? slideshowByExpanded : []}
                    seeYourself={expanded === s.id ? seeYourselfByExpanded : []}
                  />
                ))}
                {sessions.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      No sessions yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

function CompletionBadge({ completion }: { completion: CompletionInfo }) {
  const isComplete = completion.slideshowCount >= TOTAL_PAIRS && completion.hasSeeYourself;

  if (isComplete) {
    return (
      <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 border border-green-200 rounded px-2 py-0.5 text-xs font-medium">
        Complete
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-0.5 text-xs font-medium">
      Incomplete · {completion.slideshowCount}/{TOTAL_PAIRS} slideshow
      {completion.hasSeeYourself ? "" : ", no see-yourself"}
    </span>
  );
}

function SessionRowView({
  session,
  completion,
  expanded,
  onToggle,
  slideshow,
  seeYourself,
}: {
  session: SessionRow;
  completion: CompletionInfo;
  expanded: boolean;
  onToggle: () => void;
  slideshow: SlideshowResponseRow[];
  seeYourself: SeeYourselfResponseRow[];
}) {
  return (
    <>
      <tr className="border-t border-gray-200">
        <td className="px-4 py-2">{session.participant_id}</td>
        <td className="px-4 py-2 capitalize">{session.mode}</td>
        <td className="px-4 py-2">
          {new Date(session.created_at).toLocaleString()}
        </td>
        <td className="px-4 py-2">
          <CompletionBadge completion={completion} />
        </td>
        <td className="px-4 py-2">
          <button onClick={onToggle} className="text-blue-700 underline">
            {expanded ? "Hide" : "View"}
          </button>
        </td>
      </tr>
      {expanded && (
        <tr className="bg-gray-50 border-t border-gray-200">
          <td colSpan={5} className="px-4 py-4">
            <h3 className="font-semibold text-gray-700 mb-2">
              Slideshow Responses
            </h3>
            <table className="w-full text-xs mb-4">
              <thead>
                <tr className="text-gray-600">
                  <th className="text-left py-1">Pair</th>
                  <th className="text-left py-1">Answer</th>
                  <th className="text-left py-1">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {slideshow.map((r) => (
                  <tr key={r.id}>
                    <td className="py-1">{r.pair_number}</td>
                    <td className="py-1">{r.answer}</td>
                    <td className="py-1">{r.confidence}</td>
                  </tr>
                ))}
                {slideshow.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-1 text-gray-500">
                      No responses.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <h3 className="font-semibold text-gray-700 mb-2">
              See Yourself Response
            </h3>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-600">
                  <th className="text-left py-1">Answer</th>
                  <th className="text-left py-1">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {seeYourself.map((r) => (
                  <tr key={r.id}>
                    <td className="py-1">{r.answer}</td>
                    <td className="py-1">{r.confidence}</td>
                  </tr>
                ))}
                {seeYourself.length === 0 && (
                  <tr>
                    <td colSpan={2} className="py-1 text-gray-500">
                      No response.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </td>
        </tr>
      )}
    </>
  );
}
