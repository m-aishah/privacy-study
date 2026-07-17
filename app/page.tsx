import Link from "next/link";
import { CornerLogo } from "@/components/CornerLogo";
import { UsersIcon, ChildIcon } from "@/components/icons";
import { STUDY_TITLE } from "@/lib/content";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white px-6 py-12 gap-10">
      <CornerLogo />

      <div className="text-center max-w-3xl">
        <p className="text-lg sm:text-2xl uppercase tracking-wide text-[#00573F] font-semibold">
          {STUDY_TITLE}
        </p>
        <p className="text-lg sm:text-xl text-[#1A1A1A] mt-4">
          Select the session mode for this participant.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 w-full max-w-3xl">
        <Link
          href="/session/adult/welcome"
          className="flex flex-col items-center gap-4 border-2 border-[#00573F] rounded-lg px-8 py-10 hover:bg-gray-50 transition-colors"
        >
          <UsersIcon className="w-14 h-14 text-[#00573F]" />
          <span className="text-2xl font-medium text-[#1F4E79]">Adult</span>
        </Link>

        <Link
          href="/session/children/welcome"
          className="flex flex-col items-center gap-4 border-2 border-[#00573F] rounded-lg px-8 py-10 hover:bg-gray-50 transition-colors"
        >
          <ChildIcon className="w-14 h-14 text-[#00573F]" />
          <span className="text-2xl font-medium text-[#1F4E79]">Children</span>
        </Link>
      </div>
    </main>
  );
}
