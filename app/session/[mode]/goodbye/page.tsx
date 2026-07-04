"use client";

import { useEffect } from "react";
import { Logo } from "@/components/Logo";
import { useAudio } from "@/hooks/useAudio";
import { audioClip, content } from "@/lib/content";
import { Mode } from "@/lib/supabase";

export default function GoodbyePage({ params }: { params: { mode: Mode } }) {
  const mode = params.mode;
  const copy = content[mode];
  const isAdult = mode === "adult";

  const { play: playGoodbye } = useAudio([audioClip(mode, "goodbye")]);

  useEffect(() => {
    playGoodbye();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 gap-8 text-center">
      <Logo size={isAdult ? 72 : 56} />
      <h1
        className={
          isAdult
            ? "text-4xl font-semibold text-adult-navy"
            : "text-4xl font-extrabold text-kids-coral"
        }
      >
        {copy.goodbyeHeading}
      </h1>
      <p
        className={
          isAdult ? "text-xl text-adult-text max-w-xl" : "text-2xl text-[#1A1A1A] max-w-xl"
        }
      >
        {copy.goodbyeBody}
      </p>
    </main>
  );
}
