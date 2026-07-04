import { Mode } from "@/lib/supabase";
import { StarIcon } from "./icons";

export function ConfidenceRating({
  mode,
  label,
  value,
  onChange,
  compact = false,
}: {
  mode: Mode;
  label: string;
  value: number | null;
  onChange: (value: number) => void;
  compact?: boolean;
}) {
  if (mode === "adult") {
    return (
      <div className={`w-full max-w-2xl mx-auto ${compact ? "mt-2" : "mt-8"}`}>
        <p className={`font-adult text-xl text-adult-text ${compact ? "mb-1" : "mb-2"}`}>{label}</p>
        <div className="flex gap-3">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => onChange(n)}
              aria-label={`Confidence ${n}`}
              className={`${compact ? "w-11 h-11" : "w-12 h-12"} border-2 text-xl font-adult transition-colors ${
                value === n
                  ? "bg-adult-green text-white border-adult-green"
                  : "bg-white text-adult-green border-adult-green hover:bg-gray-50"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-2xl mx-auto ${compact ? "mt-2" : "mt-8"}`}>
      <p className={`font-kids text-xl text-[#1A1A1A] ${compact ? "mb-1" : "mb-2"}`}>{label}</p>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            aria-label={`${n} stars`}
            className={`text-kids-yellow transition-transform hover:scale-110 ${
              value !== null && n <= value ? "opacity-100" : "opacity-30"
            }`}
          >
            <StarIcon filled={value !== null && n <= value} className={compact ? "w-8 h-8" : "w-10 h-10"} />
          </button>
        ))}
      </div>
    </div>
  );
}
