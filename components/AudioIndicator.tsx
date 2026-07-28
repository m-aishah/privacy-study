import { Mode } from "@/lib/supabase";

/**
 * Shown in place of a gated button while its audio cue is still playing —
 * some clips run 15-20s, and with nothing on screen that looks identical
 * to the app being frozen.
 */
export function AudioIndicator({ mode, label }: { mode: Mode; label: string }) {
  const isAdult = mode === "adult";

  return (
    <div className="flex items-center gap-3" role="status">
      <span
        aria-hidden="true"
        className={
          isAdult
            ? "w-5 h-5 border-2 border-adult-green border-t-transparent rounded-full animate-spin"
            : "w-6 h-6 border-4 border-kids-teal border-t-transparent rounded-full animate-spin"
        }
      />
      <span
        className={
          isAdult
            ? "font-adult text-lg text-adult-text"
            : "font-kids text-lg text-[#1A1A1A]"
        }
      >
        {label}
      </span>
    </div>
  );
}
