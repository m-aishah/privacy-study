import { Mode } from "@/lib/supabase";

export function AnswerOptions<T extends string>({
  mode,
  options,
  selected,
  onSelect,
  compact = false,
}: {
  mode: Mode;
  options: { value: T; label: string }[];
  selected: T | null;
  onSelect: (value: T) => void;
  compact?: boolean;
}) {
  if (mode === "adult") {
    return (
      <div className={`w-full max-w-2xl mx-auto grid gap-3 sm:grid-cols-3 ${compact ? "mt-3" : "mt-8"}`}>
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className={`font-adult text-xl border-2 rounded-none transition-colors ${
              compact ? "px-6 py-3" : "px-6 py-6"
            } ${
              selected === opt.value
                ? "bg-adult-green text-white border-adult-green"
                : "bg-white text-adult-text border-adult-green hover:bg-gray-50"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={`w-full max-w-2xl mx-auto grid gap-3 sm:grid-cols-3 ${compact ? "mt-3" : "mt-8"}`}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onSelect(opt.value)}
          className={`font-kids text-xl rounded-3xl border-4 transition-all ${
            compact ? "px-6 py-4" : "px-6 py-8"
          } ${
            selected === opt.value
              ? "bg-kids-yellow border-kids-yellow text-[#1A1A1A] scale-105 shadow-lg"
              : "bg-white border-kids-teal text-[#1A1A1A] hover:scale-105"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
