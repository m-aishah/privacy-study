"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAudio } from "@/hooks/useAudio";
import { CheckIcon, ArrowRightIcon } from "@/components/icons";
import { audioClip, content } from "@/lib/content";
import { Mode } from "@/lib/supabase";
import { useSession } from "@/context/SessionContext";

export default function QuestionnairePage({ params }: { params: { mode: Mode } }) {
  const mode = params.mode;
  const copy = content[mode];
  const router = useRouter();
  const { participantId } = useSession();

  const [introAudioDone, setIntroAudioDone] = useState(false);
  const { play: playIntro } = useAudio([audioClip(mode, "questionnaire_intro")], () =>
    setIntroAudioDone(true)
  );

  useEffect(() => {
    playIntro();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const baseUrl =
    mode === "adult"
      ? process.env.NEXT_PUBLIC_SURVEYMONKEY_URL_ADULT
      : process.env.NEXT_PUBLIC_SURVEYMONKEY_URL_CHILDREN;

  const surveyUrl = baseUrl
    ? `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}participant_id=${encodeURIComponent(
        participantId ?? ""
      )}`
    : undefined;

  const isAdult = mode === "adult";

  const handleOpenSurvey = () => {
    if (!surveyUrl) return;
    window.open(surveyUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 gap-8 text-center">
      <h1
        className={
          isAdult
            ? "text-3xl font-semibold text-adult-navy"
            : "text-3xl font-extrabold text-kids-coral"
        }
      >
        {copy.questionnaireHeading}
      </h1>
      <p
        className={
          isAdult
            ? "text-xl text-adult-text max-w-xl"
            : "text-2xl text-[#1A1A1A] max-w-xl"
        }
      >
        {copy.questionnaireBody}
      </p>

      {surveyUrl ? (
        <button
          onClick={handleOpenSurvey}
          className={
            isAdult
              ? "font-adult text-xl px-10 py-4 bg-adult-green text-white rounded-none hover:opacity-90 transition-opacity inline-flex items-center gap-2"
              : "font-kids text-xl px-10 py-5 bg-kids-teal text-white rounded-full shadow-md hover:scale-105 transition-transform inline-flex items-center gap-2"
          }
        >
          {copy.questionnaireOpenButton}
          <ArrowRightIcon className={isAdult ? "w-5 h-5" : "w-6 h-6"} />
        </button>
      ) : (
        <p className={isAdult ? "text-lg text-adult-text" : "text-xl text-[#1A1A1A]"}>
          Questionnaire link is not configured.
        </p>
      )}

      <div className="min-h-[3.5rem]">
        {introAudioDone && (
          <button
            onClick={() => router.push(`/session/${mode}/openended`)}
            className={
              isAdult
                ? "font-adult text-xl px-10 py-4 bg-adult-green text-white rounded-none hover:opacity-90 transition-opacity shadow-lg inline-flex items-center gap-2"
                : "font-kids text-xl px-10 py-5 bg-kids-coral text-white rounded-full shadow-lg hover:scale-105 transition-transform inline-flex items-center gap-2"
            }
          >
            {copy.questionnaireDone}
            <CheckIcon className={isAdult ? "w-5 h-5" : "w-6 h-6"} />
          </button>
        )}
      </div>
    </main>
  );
}
