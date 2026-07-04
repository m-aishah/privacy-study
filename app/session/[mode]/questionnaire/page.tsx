"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAudio } from "@/hooks/useAudio";
import { CheckIcon } from "@/components/icons";
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

  return (
    <main className="min-h-screen flex flex-col">
      <div className="px-4 pt-8 pb-4 text-center">
        <h1
          className={
            isAdult
              ? "text-3xl font-semibold text-adult-navy"
              : "text-3xl font-extrabold text-kids-coral"
          }
        >
          {copy.questionnaireHeading}
        </h1>
        <p className={isAdult ? "text-xl text-adult-text mt-2" : "text-2xl text-[#1A1A1A] mt-2"}>
          {copy.questionnaireBody}
        </p>
      </div>

      <div className="flex-1 min-h-[60vh] px-4">
        {surveyUrl ? (
          <iframe
            src={surveyUrl}
            title="Questionnaire"
            className="w-full h-full min-h-[60vh] border-0"
          />
        ) : (
          <p className="text-center text-adult-text">Questionnaire link is not configured.</p>
        )}
      </div>

      <div className="sticky bottom-0 bg-inherit px-4 py-6 flex justify-center">
        <button
          onClick={() => router.push(`/session/${mode}/goodbye`)}
          disabled={!introAudioDone}
          className={
            isAdult
              ? "font-adult text-xl px-10 py-4 bg-adult-green text-white rounded-none hover:opacity-90 transition-opacity shadow-lg inline-flex items-center gap-2 disabled:opacity-50"
              : "font-kids text-xl px-10 py-5 bg-kids-coral text-white rounded-full shadow-lg hover:scale-105 transition-transform inline-flex items-center gap-2 disabled:opacity-50"
          }
        >
          {copy.questionnaireDone}
          <CheckIcon className={isAdult ? "w-5 h-5" : "w-6 h-6"} />
        </button>
      </div>
    </main>
  );
}
