"use client";

import { useCallback, useEffect, useRef } from "react";

const VOLUME = 0.85;

/**
 * Plays a queue of audio clips sequentially, never overlapping.
 * Clips are preloaded on mount. A clip that fails to load or play
 * is skipped silently so a missing asset never blocks the session.
 */
export function useAudio(clips: string[], onComplete?: () => void) {
  const elementsRef = useRef<HTMLAudioElement[]>([]);
  const indexRef = useRef(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const elements = clips.map((src) => {
      const el = new Audio(src);
      el.preload = "auto";
      el.volume = VOLUME;
      return el;
    });
    elementsRef.current = elements;
    indexRef.current = 0;

    return () => {
      elements.forEach((el) => {
        el.pause();
        el.src = "";
      });
      elementsRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clips.join("|")]);

  const playFrom = useCallback((startIndex: number) => {
    const elements = elementsRef.current;
    if (startIndex >= elements.length) {
      onCompleteRef.current?.();
      return;
    }

    indexRef.current = startIndex;
    const el = elements[startIndex];

    const handleEndedOrError = () => {
      el.removeEventListener("ended", handleEndedOrError);
      el.removeEventListener("error", handleEndedOrError);
      playFrom(startIndex + 1);
    };

    el.addEventListener("ended", handleEndedOrError);
    el.addEventListener("error", handleEndedOrError);

    el.currentTime = 0;
    el.play().catch(() => {
      handleEndedOrError();
    });
  }, []);

  const play = useCallback(() => {
    playFrom(0);
  }, [playFrom]);

  const stop = useCallback(() => {
    elementsRef.current.forEach((el) => {
      el.pause();
      el.currentTime = 0;
    });
  }, []);

  return { play, stop };
}
