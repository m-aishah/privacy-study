"use client";

import { Mode } from "@/lib/supabase";

export function Modal({
  mode,
  title,
  body,
  dismissLabel,
  onDismiss,
  confirmLabel,
  onConfirm,
}: {
  mode: Mode;
  title: string;
  body: string;
  dismissLabel: string;
  onDismiss: () => void;
  confirmLabel?: string;
  onConfirm?: () => void;
}) {
  const isAdult = mode === "adult";

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 animate-fade-in"
    >
      <div
        className={
          isAdult
            ? "w-full max-w-md bg-white border-2 border-adult-green px-8 py-8 text-center"
            : "w-full max-w-md bg-kids-bg border-4 border-kids-yellow rounded-3xl px-8 py-8 text-center shadow-xl animate-bounce-in"
        }
      >
        <h2
          className={
            isAdult
              ? "text-2xl font-semibold text-adult-navy mb-3"
              : "text-3xl font-extrabold text-kids-coral mb-3"
          }
        >
          {title}
        </h2>
        <p className={isAdult ? "text-lg text-adult-text mb-6" : "text-xl text-[#1A1A1A] mb-6"}>
          {body}
        </p>

        <div className="flex flex-col gap-3 items-center">
          <button
            onClick={onDismiss}
            autoFocus
            className={
              isAdult
                ? "font-adult text-lg px-8 py-3 bg-adult-green text-white rounded-none hover:opacity-90 transition-opacity w-full"
                : "font-kids text-lg px-8 py-3 bg-kids-coral text-white rounded-full shadow-md hover:scale-105 transition-transform w-full"
            }
          >
            {dismissLabel}
          </button>

          {confirmLabel && onConfirm && (
            <button
              onClick={onConfirm}
              className={
                isAdult
                  ? "font-adult text-base px-8 py-2 text-adult-text underline hover:text-adult-green transition-colors"
                  : "font-kids text-base px-8 py-2 text-[#1A1A1A]/70 underline hover:text-kids-coral transition-colors"
              }
            >
              {confirmLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
