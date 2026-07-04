import { Mode } from "@/lib/supabase";

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
      <div className={`w-full max-w-2xl mx-auto ${compact ? "mt-3" : "mt-8"}`}>
        <p className="font-adult text-xl text-adult-text mb-2">{label}</p>
        <div className="flex gap-3">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => onChange(n)}
              aria-label={`Confidence ${n}`}
              className={`w-12 h-12 border-2 text-xl font-adult transition-colors ${
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
    <div className={`w-full max-w-2xl mx-auto ${compact ? "mt-3" : "mt-8"}`}>
      <p className="font-kids text-xl text-[#1A1A1A] mb-2">{label}</p>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            aria-label={`${n} stars`}
            className={`text-4xl transition-transform hover:scale-110 ${
              value !== null && n <= value ? "opacity-100" : "opacity-30"
            }`}
          >
            ⭐
          </button>
        ))}
      </div>
    </div>
  );
}
