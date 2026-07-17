"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CornerLogo } from "@/components/CornerLogo";
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
  const [duplicateError, setDuplicateError] = useState(false);
  const [welcomeAudioDone, setWelcomeAudioDone] = useState(false);

  const { play: playWelcome } = useAudio([audioClip(mode, "welcome")], () =>
    setWelcomeAudioDone(true)
  );
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
    setDuplicateError(false);

    const result = await createSession(participantId, mode);

    if (result.status === "duplicate") {
      setSubmitting(false);
      setDuplicateError(true);
      return;
    }

    startSession(participantId, result.status === "ok" ? result.sessionId : "", mode);
    playConfirmed();
  };

  const isAdult = mode === "adult";

  return (
    <main className="min-h-screen flex flex-col px-6 py-10">
      <CornerLogo size={isAdult ? 40 : 32} />

      <div className="text-center max-w-xl mx-auto pt-6 sm:pt-10">
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

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm mx-auto gap-6">
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
            onChange={(e) => {
              setParticipantId(e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase());
              setDuplicateError(false);
            }}
            placeholder={copy.participantIdPlaceholder}
            className={
              isAdult
                ? `w-full text-center text-3xl border-2 rounded-none px-4 py-3 focus:outline-none placeholder:text-gray-300 ${
                    duplicateError ? "border-red-600" : "border-adult-green"
                  }`
                : `w-full text-center text-3xl border-4 rounded-2xl px-4 py-3 focus:outline-none placeholder:text-gray-300 ${
                    duplicateError ? "border-red-500" : "border-kids-yellow"
                  }`
            }
            autoFocus
          />
        </label>

        {duplicateError && (
          <p
            role="alert"
            className={
              isAdult
                ? "text-lg text-red-600 -mt-3 max-w-sm text-center"
                : "text-xl text-red-500 -mt-3 max-w-sm text-center font-semibold"
            }
          >
            {copy.duplicateIdError}
          </p>
        )}

        {participantId.length > 0 && welcomeAudioDone && (
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
