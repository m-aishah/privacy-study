"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AnswerOptions } from "@/components/AnswerOptions";
import { ConfidenceRating } from "@/components/ConfidenceRating";
import { NextButton } from "@/components/NextButton";
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

  const { play: playIntro } = useAudio([audioClip(mode, "see_yourself_intro")]);
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
    <main className="h-screen flex flex-col items-center overflow-y-auto py-2 px-4">
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
            ? "relative w-[min(60vw,32vh)] h-[min(60vw,32vh)] border-2 border-adult-green"
            : "relative w-[min(60vw,32vh)] h-[min(60vw,32vh)] rounded-3xl overflow-hidden border-4 border-kids-teal"
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
            ? "text-lg sm:text-xl text-adult-text mt-3 text-center"
            : "text-xl sm:text-2xl text-[#1A1A1A] mt-3 text-center"
        }
      >
        {copy.seeYourselfQuestion}
      </p>

      <AnswerOptions
        mode={mode}
        selected={answer}
        onSelect={setAnswer}
        compact
        options={[
          { value: "yes", label: copy.seeYourselfYes },
          { value: "no", label: copy.seeYourselfNo },
          { value: "not_sure", label: copy.seeYourselfNotSure },
        ]}
      />

      <ConfidenceRating
        mode={mode}
        label={copy.confidenceLabel}
        value={confidence}
        onChange={setConfidence}
        compact
      />

      <div className="mt-4 mb-4 min-h-[3.5rem]">
        {answer && confidence !== null && (
          <NextButton mode={mode} label={copy.next} onClick={handleNext} />
        )}
      </div>
    </main>
  );
}
