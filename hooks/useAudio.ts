"use client";

import { useCallback, useEffect, useRef } from "react";

const VOLUME = 0.85;

/**
 * Plays a queue of audio clips sequentially, never overlapping.
 * Clips are preloaded on mount. A clip that fails to load or play
 * is skipped silently so a missing asset never blocks the session.
 */
export function useAudio(clips: string[], onComplete?: () => void) {
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const elementsRef = useRef<HTMLAudioElement[]>([]);
  const playImplRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // `active` is local to this specific effect generation, unlike a ref it
    // cannot be reset by a later generation's setup. Each generation (e.g.
    // React StrictMode's dev-only mount->cleanup->mount cycle, or a real
    // clips change) gets its own isolated flag, so a stale async callback
    // from a disposed generation (a rejected play() promise settling after
    // cleanup already ran, for instance) can never affect the current one.
    let active = true;

    const elements = clips.map((src) => {
      const el = new Audio(src);
      el.preload = "auto";
      el.volume = VOLUME;
      return el;
    });
    elementsRef.current = elements;

    function playFrom(startIndex: number) {
      if (!active) return;

      if (startIndex >= elements.length) {
        onCompleteRef.current?.();
        return;
      }

      const el = elements[startIndex];

      const handleEndedOrError = () => {
        el.removeEventListener("ended", handleEndedOrError);
        el.removeEventListener("error", handleEndedOrError);
        if (!active) return;
        playFrom(startIndex + 1);
      };

      el.addEventListener("ended", handleEndedOrError);
      el.addEventListener("error", handleEndedOrError);

      el.currentTime = 0;
      el.play().catch(() => {
        if (!active) return;
        handleEndedOrError();
      });
    }

    playImplRef.current = () => playFrom(0);

    return () => {
      active = false;
      playImplRef.current = null;
      elements.forEach((el) => {
        el.pause();
        el.src = "";
      });
      elementsRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clips.join("|")]);

  const play = useCallback(() => {
    playImplRef.current?.();
  }, []);

  const stop = useCallback(() => {
    elementsRef.current.forEach((el) => {
      el.pause();
      el.currentTime = 0;
    });
  }, []);

  return { play, stop };
}
