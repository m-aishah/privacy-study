"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { AnswerOptions } from "@/components/AnswerOptions";
import { ConfidenceRating } from "@/components/ConfidenceRating";
import { NextButton } from "@/components/NextButton";
import { useAudio } from "@/hooks/useAudio";
import { audioClip, content, slideshowPairSrc, TOTAL_PAIRS } from "@/lib/content";
import { logSlideshowResponse, Mode, SlideshowAnswer } from "@/lib/supabase";
import { useSession } from "@/context/SessionContext";

export default function SlideshowPage({ params }: { params: { mode: Mode } }) {
  const mode = params.mode;
  const copy = content[mode];
  const router = useRouter();
  const { sessionId } = useSession();

  const [pairNumber, setPairNumber] = useState(1);
  const [answer, setAnswer] = useState<SlideshowAnswer | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [finishing, setFinishing] = useState(false);

  const clips =
    pairNumber === 1
      ? [audioClip(mode, "slideshow_intro"), audioClip(mode, "slideshow_pair_instruction")]
      : [audioClip(mode, "slideshow_pair_instruction")];

  const { play: playPairAudio } = useAudio(clips);
  const { play: playComplete } = useAudio([audioClip(mode, "slideshow_complete")], () => {
    router.push(`/session/${mode}/game`);
  });

  useEffect(() => {
    playPairAudio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pairNumber]);

  const images = slideshowPairSrc(pairNumber);
  const isAdult = mode === "adult";

  const handleNext = async () => {
    if (!answer || confidence === null || finishing) return;

    if (sessionId) {
      await logSlideshowResponse(sessionId, pairNumber, answer, confidence);
    }

    if (pairNumber >= TOTAL_PAIRS) {
      setFinishing(true);
      playComplete();
      return;
    }

    setPairNumber((n) => n + 1);
    setAnswer(null);
    setConfidence(null);
  };

  return (
    <main className="h-screen flex flex-col items-center overflow-y-auto py-2">
      <ProgressIndicator mode={mode} current={pairNumber} total={TOTAL_PAIRS} compact />

      <div className="w-full max-w-3xl px-4 mt-2 text-center">
        <h1
          className={
            isAdult
              ? "text-2xl sm:text-3xl font-semibold text-adult-navy mb-3"
              : "text-2xl sm:text-3xl font-extrabold text-kids-coral mb-3"
          }
        >
          {copy.slideshowIntroHeading}
        </h1>

        <div className="flex justify-center gap-4 sm:gap-8">
          <div
            className={
              isAdult
                ? "relative w-[min(38vw,32vh)] h-[min(38vw,32vh)] border-2 border-adult-green"
                : "relative w-[min(38vw,32vh)] h-[min(38vw,32vh)] rounded-3xl overflow-hidden border-4 border-kids-teal"
            }
          >
            <Image src={images.a} alt={`Pair ${pairNumber} - image A`} fill className="object-cover" />
          </div>
          <div
            className={
              isAdult
                ? "relative w-[min(38vw,32vh)] h-[min(38vw,32vh)] border-2 border-adult-green"
                : "relative w-[min(38vw,32vh)] h-[min(38vw,32vh)] rounded-3xl overflow-hidden border-4 border-kids-teal"
            }
          >
            <Image src={images.b} alt={`Pair ${pairNumber} - image B`} fill className="object-cover" />
          </div>
        </div>

        <p className={isAdult ? "text-lg sm:text-xl text-adult-text mt-3" : "text-xl sm:text-2xl text-[#1A1A1A] mt-3"}>
          {copy.slideshowQuestion}
        </p>
      </div>

      <AnswerOptions
        mode={mode}
        selected={answer}
        onSelect={setAnswer}
        compact
        options={[
          { value: "same", label: copy.answerSame },
          { value: "not_same", label: copy.answerNotSame },
          { value: "not_sure", label: copy.answerNotSure },
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
