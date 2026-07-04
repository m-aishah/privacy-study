import { Mode } from "@/lib/supabase";
import { ArrowRightIcon } from "./icons";

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
        className="font-adult text-xl px-10 py-4 bg-adult-green text-white rounded-none hover:opacity-90 transition-opacity animate-fade-in inline-flex items-center gap-2"
      >
        {label}
        <ArrowRightIcon className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="font-kids text-xl px-10 py-5 bg-kids-coral text-white rounded-full shadow-md hover:scale-105 transition-transform animate-bounce-in inline-flex items-center gap-2"
    >
      {label}
      <ArrowRightIcon className="w-6 h-6" />
    </button>
  );
}
