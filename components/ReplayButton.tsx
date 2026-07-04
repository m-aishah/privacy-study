import { Mode } from "@/lib/supabase";
import { ReplayIcon } from "./icons";

export function ReplayButton({
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
        aria-label={label}
        className="font-adult text-lg px-6 py-4 bg-white text-adult-green border-2 border-adult-green hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
      >
        <ReplayIcon className="w-5 h-5" />
        {label}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="font-kids text-lg px-6 py-4 bg-white text-kids-teal border-4 border-kids-teal rounded-full hover:scale-105 transition-transform inline-flex items-center gap-2"
    >
      <ReplayIcon className="w-6 h-6" />
      {label}
    </button>
  );
}
