import { Mode } from "@/lib/supabase";
import { StarIcon } from "./icons";

export function ProgressIndicator({
  mode,
  current,
  total,
  compact = false,
}: {
  mode: Mode;
  current: number;
  total: number;
  compact?: boolean;
}) {
  if (mode === "adult") {
    const pct = Math.min(100, Math.round((current / total) * 100));
    return (
      <div className={`w-full max-w-2xl mx-auto px-4 ${compact ? "pt-3" : "pt-6"}`}>
        <div className="h-3 w-full bg-gray-200 rounded-none overflow-hidden">
          <div
            className="h-full bg-adult-green transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-sm text-adult-green mt-2 font-adult">
          Step {current} of {total}
        </p>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-2xl mx-auto px-4 ${compact ? "pt-3" : "pt-6"} flex flex-wrap justify-center gap-2`}>
      {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
        <StarIcon
          key={n}
          filled={n <= current}
          className={`w-6 h-6 text-kids-yellow transition-transform ${
            n <= current ? "scale-110" : "opacity-30"
          }`}
        />
      ))}
    </div>
  );
}
