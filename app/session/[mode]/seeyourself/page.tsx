"use client";

// The "See Yourself" activity has been temporarily removed from the
// session flow (replaced by the Screen 6 open-ended questions screen,
// positioned after the questionnaire instead of before it). Nothing in
// the app routes here anymore. The original implementation is kept below,
// commented out, in case this screen is reinstated later.
//
// If this route is ever visited directly, redirect on to the actual next
// step rather than showing a dead page.

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mode } from "@/lib/supabase";

export default function SeeYourselfPage({ params }: { params: { mode: Mode } }) {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/session/${params.mode}/questionnaire`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

/*
import { useState } from "react";
import Image from "next/image";
import { AnswerOptions } from "@/components/AnswerOptions";
import { ConfidenceRating } from "@/components/ConfidenceRating";
import { NextButton } from "@/components/NextButton";
import { SmileIcon, XCircleIcon, QuestionMarkIcon } from "@/components/icons";
import { useAudio } from "@/hooks/useAudio";
import { audioClip, content } from "@/lib/content";
import { logSeeYourselfResponse, Mode, SeeYourselfAnswer } from "@/lib/supabase";
import { useSession } from "@/context/SessionContext";

export default function SeeYourselfPage({ params }: { params: { mode: Mode } }) {
  const mode = params.mode;
  const copy = content[mode];
  const router = useRouter();
  const { sessionId } = useSession();

  const [answer, setAnswer] = useState<SeeYourselfAnswer | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [finishing, setFinishing] = useState(false);
  const [introAudioDone, setIntroAudioDone] = useState(false);

  // commented out — see yourself screen temporarily removed, may be reinstated
  const { play: playIntro } = useAudio([audioClip(mode, "see_yourself_intro")], () =>
    setIntroAudioDone(true)
  );
  // commented out — see yourself screen temporarily removed, may be reinstated
  const { play: playComplete } = useAudio([audioClip(mode, "see_yourself_complete")], () => {
    router.push(`/session/${mode}/questionnaire`);
  });

  useEffect(() => {
    playIntro();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isAdult = mode === "adult";

  const handleNext = async () => {
    if (!answer || confidence === null || finishing) return;

    if (sessionId) {
      await logSeeYourselfResponse(sessionId, answer, confidence);
    }

    setFinishing(true);
    playComplete();
  };

  return (
    <main className="h-screen flex flex-col items-center justify-center overflow-y-auto py-2 px-4">
      <h1
        className={
          isAdult
            ? "text-2xl sm:text-3xl font-semibold text-adult-navy mb-2 text-center"
            : "text-2xl sm:text-3xl font-extrabold text-kids-coral mb-2 text-center"
        }
      >
        {copy.seeYourselfHeading}
      </h1>

      <div
        className={
          isAdult
            ? "relative w-[min(55vw,44vh)] h-[min(55vw,44vh)] border-2 border-adult-green"
            : "relative w-[min(55vw,44vh)] h-[min(55vw,44vh)] rounded-3xl overflow-hidden border-4 border-kids-teal"
        }
      >
        <Image
          src="/images/see_yourself_placeholder.jpg"
          alt="Your anonymized appearance"
          fill
          className="object-cover"
        />
      </div>

      <p
        className={
          isAdult
            ? "text-lg sm:text-xl text-adult-text mt-2 text-center"
            : "text-xl sm:text-2xl text-[#1A1A1A] mt-2 text-center"
        }
      >
        {copy.seeYourselfQuestion}
      </p>

      {introAudioDone && (
        <>
          <AnswerOptions
            mode={mode}
            selected={answer}
            onSelect={setAnswer}
            compact
            options={[
              { value: "yes", label: copy.seeYourselfYes, icon: <SmileIcon className="w-6 h-6" /> },
              { value: "no", label: copy.seeYourselfNo, icon: <XCircleIcon className="w-6 h-6" /> },
              {
                value: "not_sure",
                label: copy.seeYourselfNotSure,
                icon: <QuestionMarkIcon className="w-6 h-6" />,
              },
            ]}
          />

          <ConfidenceRating
            mode={mode}
            label={copy.confidenceLabel}
            value={confidence}
            onChange={setConfidence}
            compact
          />
        </>
      )}

      <div className="mt-4 mb-4 min-h-[3.5rem]">
        {answer && confidence !== null && (
          <NextButton mode={mode} label={copy.next} onClick={handleNext} />
        )}
      </div>
    </main>
  );
}
*/
