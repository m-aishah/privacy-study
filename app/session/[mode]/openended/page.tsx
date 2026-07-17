"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { NextButton } from "@/components/NextButton";
import { useAudio } from "@/hooks/useAudio";
import { audioClip, content } from "@/lib/content";
import { logOpenEndedResponse, Mode } from "@/lib/supabase";
import { useSession } from "@/context/SessionContext";

const TOTAL_ADULT_QUESTIONS = 5;

export default function OpenEndedPage({ params }: { params: { mode: Mode } }) {
  const mode = params.mode;
  const router = useRouter();
  const { sessionId } = useSession();
  const isAdult = mode === "adult";

  const [introAudioDone, setIntroAudioDone] = useState(false);
  const [logging, setLogging] = useState(false);

  // Adult flow state
  const [questionIndex, setQuestionIndex] = useState(0);
  const [textValue, setTextValue] = useState("");

  // Children flow state
  const [childText, setChildText] = useState("");
  const [childEmoji, setChildEmoji] = useState<string | null>(null);

  // audioClip appends the _adult/_child suffix automatically, resolving to
  // screen6_intro_adult.mp3 / screen6_intro_child.mp3 as specified.
  const { play: playIntro } = useAudio([audioClip(mode, "screen6_intro")], () =>
    setIntroAudioDone(true)
  );

  useEffect(() => {
    playIntro();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goToGoodbye = () => router.push(`/session/${mode}/goodbye`);

  const handleAdultAdvance = async (skip: boolean) => {
    if (logging) return;
    setLogging(true);

    const response = skip ? null : textValue.trim() || null;
    if (sessionId) {
      await logOpenEndedResponse(sessionId, questionIndex + 1, response);
    }

    if (questionIndex + 1 >= TOTAL_ADULT_QUESTIONS) {
      goToGoodbye();
      return;
    }

    setQuestionIndex((i) => i + 1);
    setTextValue("");
    setLogging(false);
  };

  const handleChildSubmit = async () => {
    if (logging) return;
    setLogging(true);

    const trimmed = childText.trim();
    let response: string | null = null;
    if (childEmoji && trimmed) response = `EMOJI: ${childEmoji} | TEXT: ${trimmed}`;
    else if (childEmoji) response = `EMOJI: ${childEmoji}`;
    else if (trimmed) response = `TEXT: ${trimmed}`;

    if (sessionId) {
      await logOpenEndedResponse(sessionId, 1, response);
    }

    goToGoodbye();
  };

  const demoImages = (
    <div className="flex justify-center gap-4">
      <div
        className={
          isAdult
            ? "relative w-36 h-36 sm:w-44 sm:h-44 border-2 border-adult-green"
            : "relative w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border-4 border-kids-teal"
        }
      >
        <Image src="/images/demo.png" alt="Original video, unmodified" fill className="object-cover" />
      </div>
      <div
        className={
          isAdult
            ? "relative w-36 h-36 sm:w-44 sm:h-44 border-2 border-adult-green"
            : "relative w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border-4 border-kids-teal"
        }
      >
        <Image
          src="/images/demo_anonymized.png"
          alt="Same video with the face anonymized"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );

  if (isAdult) {
    const adultCopy = content.adult;
    return (
      <main className="min-h-screen flex flex-col items-center py-10 px-4 overflow-y-auto">
        <p className="max-w-2xl text-center text-xl text-adult-text">{adultCopy.openEndedIntro}</p>

        <div className="mt-6">{demoImages}</div>

        <p className="max-w-xl text-center text-base text-adult-text mt-3">
          {adultCopy.openEndedCaption}
        </p>

        <p className="text-sm text-adult-green mt-6 font-medium">
          Question {questionIndex + 1} of {TOTAL_ADULT_QUESTIONS}
        </p>

        <div className="w-full max-w-2xl mt-3">
          <p className="text-xl text-adult-navy font-medium mb-3">
            {adultCopy.openEndedQuestions[questionIndex]}
          </p>
          <textarea
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            placeholder={adultCopy.openEndedPlaceholder}
            rows={4}
            className="w-full min-h-[120px] border-2 border-adult-green rounded-none p-4 text-lg focus:outline-none placeholder:text-gray-400"
          />
        </div>

        <div className="mt-6 mb-4 min-h-[3.5rem] flex items-center gap-4">
          {(questionIndex > 0 || introAudioDone) && (
            <>
              <NextButton
                mode={mode}
                label={adultCopy.openEndedNext}
                onClick={() => handleAdultAdvance(false)}
              />
              <button
                onClick={() => handleAdultAdvance(true)}
                disabled={logging}
                className="font-adult text-lg px-6 py-3 text-adult-text underline hover:text-adult-green transition-colors disabled:opacity-50"
              >
                {adultCopy.openEndedSkip}
              </button>
            </>
          )}
        </div>
      </main>
    );
  }

  const childCopy = content.children;
  return (
    <main className="min-h-screen flex flex-col items-center py-10 px-4 overflow-y-auto">
      <div>{demoImages}</div>

      <p className="max-w-xl text-center text-lg text-[#1A1A1A] mt-3">{childCopy.openEndedCaption}</p>

      <p className="max-w-xl text-center text-2xl font-extrabold text-kids-coral mt-6">
        {childCopy.openEndedQuestion}
      </p>

      <div className="w-full max-w-xl mt-4">
        <textarea
          value={childText}
          onChange={(e) => setChildText(e.target.value)}
          placeholder={childCopy.openEndedPlaceholder}
          rows={4}
          className="w-full min-h-[120px] border-4 border-kids-yellow rounded-2xl p-4 text-lg focus:outline-none placeholder:text-gray-400"
        />
      </div>

      <div className="flex gap-4 mt-4">
        {childCopy.openEndedEmojiOptions.map((opt) => (
          <button
            key={opt.emoji}
            onClick={() => setChildEmoji(opt.emoji === childEmoji ? null : opt.emoji)}
            aria-label={opt.label}
            title={opt.label}
            className={`text-5xl rounded-full p-3 border-4 transition-transform hover:scale-110 ${
              childEmoji === opt.emoji
                ? "border-kids-coral bg-kids-yellow/30 scale-110"
                : "border-transparent"
            }`}
          >
            {opt.emoji}
          </button>
        ))}
      </div>

      <div className="mt-6 mb-4 min-h-[3.5rem]">
        {introAudioDone && (
          <NextButton mode={mode} label={childCopy.openEndedNext} onClick={handleChildSubmit} />
        )}
      </div>
    </main>
  );
}
