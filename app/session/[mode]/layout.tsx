import { notFound } from "next/navigation";
import { NavGuard } from "@/components/NavGuard";
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
          : "min-h-screen bg-kids-bg font-kids"
      }
    >
      <NavGuard />
      {children}
    </div>
  );
}
