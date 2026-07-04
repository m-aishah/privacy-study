"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { CheckIcon, PartyIcon } from "@/components/icons";
import { useAudio } from "@/hooks/useAudio";
import { audioClip, content } from "@/lib/content";
import { Mode } from "@/lib/supabase";
import { useSession } from "@/context/SessionContext";

export default function GoodbyePage({ params }: { params: { mode: Mode } }) {
  const mode = params.mode;
  const copy = content[mode];
  const isAdult = mode === "adult";
  const router = useRouter();
  const { clearSession } = useSession();

  const { play: playGoodbye } = useAudio([audioClip(mode, "goodbye")]);

  useEffect(() => {
    playGoodbye();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFinish = () => {
    clearSession();
    router.push("/");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 gap-8 text-center">
      <Logo size={isAdult ? 72 : 56} />
      {!isAdult && <PartyIcon className="w-16 h-16 text-kids-yellow" />}
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
      <button
        onClick={handleFinish}
        className={
          isAdult
            ? "font-adult text-xl px-10 py-4 bg-adult-green text-white rounded-none hover:opacity-90 transition-opacity inline-flex items-center gap-2"
            : "font-kids text-xl px-10 py-5 bg-kids-coral text-white rounded-full shadow-md hover:scale-105 transition-transform inline-flex items-center gap-2 animate-bounce-in"
        }
      >
        {copy.finishSession}
        <CheckIcon className={isAdult ? "w-5 h-5" : "w-6 h-6"} />
      </button>
    </main>
  );
}
