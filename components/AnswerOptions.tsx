import { Mode } from "@/lib/supabase";

export function AnswerOptions<T extends string>({
  mode,
  options,
  selected,
  onSelect,
}: {
  mode: Mode;
  options: { value: T; label: string }[];
  selected: T | null;
  onSelect: (value: T) => void;
}) {
  if (mode === "adult") {
    return (
      <div className="w-full max-w-2xl mx-auto grid gap-4 sm:grid-cols-3 mt-8">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className={`font-adult text-xl px-6 py-6 border-2 rounded-none transition-colors ${
              selected === opt.value
                ? "bg-adult-green text-white border-adult-green"
                : "bg-white text-adult-text border-adult-navy hover:bg-gray-50"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto grid gap-4 sm:grid-cols-3 mt-8">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onSelect(opt.value)}
          className={`font-kids text-xl px-6 py-8 rounded-3xl border-4 transition-all ${
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
