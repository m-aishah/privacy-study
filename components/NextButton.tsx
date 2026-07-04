import { Mode } from "@/lib/supabase";

export function NextButton({
  mode,
  label,
  onClick,
}: {
  mode: Mode;
  label: string;
  onClick: () => void;
}) {
  if (mode === "adult") {
    return (
      <button
        onClick={onClick}
        className="font-adult text-xl px-10 py-4 bg-adult-green text-white rounded-none hover:opacity-90 transition-opacity animate-fade-in"
      >
        {label}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="font-kids text-xl px-10 py-5 bg-kids-coral text-white rounded-full shadow-md hover:scale-105 transition-transform animate-bounce-in"
    >
      {label}
    </button>
  );
}
