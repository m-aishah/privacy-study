"use client";

import { Logo } from "@/components/Logo";
import { content } from "@/lib/content";
import { Mode } from "@/lib/supabase";

export function ErrorScreen({ mode, onRetry }: { mode: Mode | null; onRetry: () => void }) {
  const isChildren = mode === "children";
  const copy = content[isChildren ? "children" : "adult"];

  if (isChildren) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 gap-6 text-center bg-kids-bg font-kids">
        <span className="text-7xl" aria-hidden>
          😵‍💫
        </span>
        <h1 className="text-4xl font-extrabold text-kids-coral">{copy.errorTitle}</h1>
        <p className="text-2xl text-[#1A1A1A] max-w-xl">{copy.errorBody}</p>
        <button
          onClick={onRetry}
          className="font-kids text-xl px-10 py-5 bg-kids-coral text-white rounded-full shadow-md hover:scale-105 transition-transform"
        >
          {copy.errorRetry}
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 gap-6 text-center bg-adult-bg font-adult">
      <Logo size={64} />
      <h1 className="text-4xl font-semibold text-adult-navy">{copy.errorTitle}</h1>
      <p className="text-xl text-adult-text max-w-xl">{copy.errorBody}</p>
      <button
        onClick={onRetry}
        className="font-adult text-xl px-10 py-4 bg-adult-green text-white rounded-none hover:opacity-90 transition-opacity"
      >
        {copy.errorRetry}
      </button>
    </main>
  );
}
