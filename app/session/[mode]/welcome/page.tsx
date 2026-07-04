"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { useAudio } from "@/hooks/useAudio";
import { audioClip, content } from "@/lib/content";
import { createSession, Mode } from "@/lib/supabase";
import { useSession } from "@/context/SessionContext";

export default function WelcomePage({ params }: { params: { mode: Mode } }) {
  const mode = params.mode;
  const copy = content[mode];
  const router = useRouter();
  const { startSession } = useSession();

  const [participantId, setParticipantId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { play: playWelcome } = useAudio([audioClip(mode, "welcome")]);
  const { play: playConfirmed } = useAudio([audioClip(mode, "id_confirmed")], () => {
    router.push(`/session/${mode}/slideshow`);
  });

  useEffect(() => {
    playWelcome();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async () => {
    if (!participantId || submitting) return;
    setSubmitting(true);

    const sessionId = await createSession(participantId, mode);
    startSession(participantId, sessionId ?? "", mode);
    playConfirmed();
  };

  const isAdult = mode === "adult";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 gap-8">
      <Logo size={isAdult ? 72 : 56} />

      <div className="text-center max-w-xl">
        <h1
          className={
            isAdult
              ? "text-4xl font-semibold text-adult-navy"
              : "text-4xl font-extrabold text-kids-coral"
          }
        >
          {copy.welcomeHeading}
        </h1>
        <p
          className={
            isAdult
              ? "text-xl text-adult-text mt-4"
              : "text-2xl text-[#1A1A1A] mt-4"
          }
        >
          {copy.welcomeBody}
        </p>
      </div>

      <div className="w-full max-w-sm flex flex-col items-center gap-6">
        <label className="w-full text-center">
          <span
            className={
              isAdult
                ? "block text-xl text-adult-green mb-2"
                : "block text-2xl text-kids-teal font-bold mb-2"
            }
          >
            {copy.participantIdLabel}
          </span>
          <input
            type="text"
            autoCapitalize="characters"
            value={participantId}
            onChange={(e) =>
              setParticipantId(e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase())
            }
            placeholder={copy.participantIdPlaceholder}
            className={
              isAdult
                ? "w-full text-center text-3xl border-2 border-adult-green rounded-none px-4 py-3 focus:outline-none placeholder:text-gray-300"
                : "w-full text-center text-3xl border-4 border-kids-yellow rounded-2xl px-4 py-3 focus:outline-none placeholder:text-gray-300"
            }
            autoFocus
          />
        </label>

        {participantId.length > 0 && (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={
              isAdult
                ? "font-adult text-xl px-10 py-4 bg-adult-green text-white rounded-none hover:opacity-90 transition-opacity disabled:opacity-50"
                : "font-kids text-xl px-10 py-5 bg-kids-coral text-white rounded-full shadow-md hover:scale-105 transition-transform disabled:opacity-50 animate-bounce-in"
            }
          >
            {copy.submit}
          </button>
        )}
      </div>
    </main>
  );
}
