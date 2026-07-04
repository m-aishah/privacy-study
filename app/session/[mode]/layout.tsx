import { notFound } from "next/navigation";
import { NavGuard } from "@/components/NavGuard";
import { ChildrenDecor } from "@/components/ChildrenDecor";
import { Mode } from "@/lib/supabase";

export function generateStaticParams() {
  return [{ mode: "adult" }, { mode: "children" }];
}

export default function ModeLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { mode: string };
}) {
  if (params.mode !== "adult" && params.mode !== "children") {
    notFound();
  }
  const mode = params.mode as Mode;

  return (
    <div
      className={
        mode === "adult"
          ? "min-h-screen bg-adult-bg font-adult"
          : "relative min-h-screen bg-kids-bg font-kids"
      }
    >
      <NavGuard mode={mode} />
      {mode === "children" && <ChildrenDecor />}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
