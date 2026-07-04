"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { NextButton } from "@/components/NextButton";
import { useAudio } from "@/hooks/useAudio";
import {
  actionVideoSrc,
  audioClip,
  content,
  STAND_UP_AFTER_ACTION,
  TOTAL_ACTIONS,
} from "@/lib/content";
import { Mode, triggerPipelineStart } from "@/lib/supabase";

type Phase = "action" | "standup";

export default function GamePage({ params }: { params: { mode: Mode } }) {
  const mode = params.mode;
  const copy = content[mode];
  const router = useRouter();

  const [phase, setPhase] = useState<Phase>("action");
  const [actionNumber, setActionNumber] = useState(1);

  const { play: playIntro } = useAudio([audioClip(mode, "game_intro")]);
  const { play: playActionCue } = useAudio([audioClip(mode, `action_${actionNumber}_cue`)]);
  const { play: playStandUp } = useAudio([audioClip(mode, "stand_up")]);
  const { play: playComplete } = useAudio([audioClip(mode, "game_complete")], () => {
    router.push(`/session/${mode}/seeyourself`);
  });

  useEffect(() => {
    playIntro();
    triggerPipelineStart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (phase === "action") playActionCue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionNumber, phase]);

  const isAdult = mode === "adult";

  const handleNext = () => {
    if (actionNumber >= TOTAL_ACTIONS) {
      playComplete();
      return;
    }

    if (actionNumber === STAND_UP_AFTER_ACTION) {
      setPhase("standup");
      playStandUp();
      return;
    }

    setActionNumber((n) => n + 1);
  };

  const handleReady = () => {
    setPhase("action");
    setActionNumber((n) => n + 1);
  };

  if (phase === "standup") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 gap-8 text-center">
        <h1
          className={
            isAdult
              ? "text-4xl font-semibold text-adult-navy"
              : "text-4xl font-extrabold text-kids-coral"
          }
        >
          {copy.standUpHeading}
        </h1>
        <p className={isAdult ? "text-xl text-adult-text max-w-xl" : "text-2xl text-[#1A1A1A] max-w-xl"}>
          {copy.standUpBody}
        </p>
        <NextButton mode={mode} label={copy.standUpReady} onClick={handleReady} />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center pb-16">
      <ProgressIndicator mode={mode} current={actionNumber} total={TOTAL_ACTIONS} />

      <div className="w-full max-w-5xl px-4 mt-8 flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
        <div
          className={
            isAdult
              ? "relative aspect-video bg-black border-2 border-adult-navy overflow-hidden"
              : "relative aspect-video bg-black rounded-3xl border-4 border-kids-teal overflow-hidden"
          }
        >
          <video
            key={actionNumber}
            src={actionVideoSrc(mode, actionNumber)}
            autoPlay
            loop
            muted
            playsInline
            controls={false}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex items-center justify-center">
          <NextButton mode={mode} label={copy.next} onClick={handleNext} />
        </div>
      </div>
    </main>
  );
}
