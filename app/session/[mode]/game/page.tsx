"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { NextButton } from "@/components/NextButton";
import { ReplayButton } from "@/components/ReplayButton";
import { StandUpAvatar } from "@/components/StandUpAvatar";
import { useAudio } from "@/hooks/useAudio";
import {
  actionVideoSrc,
  audioClip,
  content,
  STAND_UP_AFTER_ACTION,
  TOTAL_ACTIONS,
} from "@/lib/content";
import {
  Mode,
  triggerPipelineStart,
  triggerPipelineStop,
} from "@/lib/supabase";

type Phase = "action" | "standup";

export default function GamePage({ params }: { params: { mode: Mode } }) {
  const mode = params.mode;
  const copy = content[mode];
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const introQueuedRef = useRef(false);

  const [phase, setPhase] = useState<Phase>("action");
  const [actionNumber, setActionNumber] = useState(1);
  const [actionAudioDone, setActionAudioDone] = useState(false);
  const [standUpAudioDone, setStandUpAudioDone] = useState(false);

  // game_intro only ever plays once, chained in front of the first action's
  // cue in the same queue so the two never overlap (useAudio guarantees
  // sequential, non-overlapping playback within a single queue, but two
  // separate useAudio calls firing at the same time would still overlap
  // each other).
  const actionClips = introQueuedRef.current
    ? [audioClip(mode, `action_${actionNumber}`)]
    : [
        audioClip(mode, "game_intro"),
        audioClip(mode, `action_${actionNumber}`),
      ];

  const { play: playActionCue } = useAudio(actionClips, () =>
    setActionAudioDone(true),
  );
  const { play: playStandUp } = useAudio([audioClip(mode, "stand_up")], () =>
    setStandUpAudioDone(true),
  );
  const { play: playComplete } = useAudio(
    [audioClip(mode, "game_complete")],
    () => {
      router.push(`/session/${mode}/questionnaire`);
    },
  );

  useEffect(() => {
    triggerPipelineStart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (phase === "action") {
      setActionAudioDone(false);
      playActionCue();
      introQueuedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionNumber, phase]);

  useEffect(() => {
    if (phase === "standup") {
      setStandUpAudioDone(false);
      playStandUp();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const isAdult = mode === "adult";

  const handleNext = () => {
    if (actionNumber >= TOTAL_ACTIONS) {
      triggerPipelineStop();
      playComplete();
      return;
    }

    if (actionNumber === STAND_UP_AFTER_ACTION) {
      setPhase("standup");
      return;
    }

    setActionNumber((n) => n + 1);
  };

  const handleReady = () => {
    setPhase("action");
    setActionNumber((n) => n + 1);
  };

  const handleReplay = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => {});
  };

  if (phase === "standup") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 gap-6 text-center">
        {!isAdult && <StandUpAvatar />}
        <h1
          className={
            isAdult
              ? "text-4xl font-semibold text-adult-navy"
              : "text-4xl font-extrabold text-kids-coral"
          }
        >
          {copy.standUpHeading}
        </h1>
        <p
          className={
            isAdult
              ? "text-xl text-adult-text max-w-xl"
              : "text-2xl text-[#1A1A1A] max-w-xl"
          }
        >
          {copy.standUpBody}
        </p>
        <div className="min-h-[3.5rem]">
          {standUpAudioDone && (
            <NextButton
              mode={mode}
              label={copy.standUpReady}
              onClick={handleReady}
            />
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center pb-10">
      <ProgressIndicator
        mode={mode}
        current={actionNumber}
        total={TOTAL_ACTIONS}
      />

      <div className="w-full max-w-7xl px-4 mt-6 flex-1 grid grid-cols-1 sm:grid-cols-[3fr_1fr] gap-6 items-center">
        <div
          className={
            isAdult
              ? "relative w-full aspect-video max-h-[75vh] bg-black border-2 border-adult-green overflow-hidden mx-auto"
              : "relative w-full aspect-video max-h-[75vh] bg-black rounded-3xl border-4 border-kids-teal overflow-hidden mx-auto"
          }
        >
          <video
            ref={videoRef}
            key={actionNumber}
            src={actionVideoSrc(mode, actionNumber)}
            autoPlay
            muted
            playsInline
            controls={false}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col items-center justify-center gap-4">
          <div className="min-h-[3.5rem]">
            {actionAudioDone && (
              <NextButton mode={mode} label={copy.next} onClick={handleNext} />
            )}
          </div>
          <ReplayButton
            mode={mode}
            label={copy.replay}
            onClick={handleReplay}
          />
        </div>
      </div>
    </main>
  );
}
