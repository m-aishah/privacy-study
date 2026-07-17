import { createClient } from "@supabase/supabase-js";

// Fall back to a syntactically valid placeholder so the client can be
// constructed at build time (e.g. static prerendering) even when env vars
// aren't set yet. Real calls made with the placeholder simply fail, which
// is caught by the try/catch wrappers below per the "fail silently" spec.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Mode = "adult" | "children";

export type SessionRow = {
  id: string;
  participant_id: string;
  mode: Mode;
  created_at: string;
};

export type SlideshowAnswer = "same" | "not_same" | "not_sure";

export type SlideshowResponseRow = {
  id: string;
  session_id: string;
  pair_number: number;
  answer: SlideshowAnswer;
  confidence: number;
  created_at: string;
};

export type SeeYourselfAnswer = "yes" | "no" | "not_sure";

export type SeeYourselfResponseRow = {
  id: string;
  session_id: string;
  answer: SeeYourselfAnswer;
  confidence: number;
  created_at: string;
};

export type OpenEndedResponseRow = {
  id: string;
  session_id: string;
  question_number: number;
  response: string | null;
  created_at: string;
};

export type CreateSessionResult =
  | { status: "ok"; sessionId: string }
  | { status: "duplicate" }
  | { status: "error" };

const POSTGRES_UNIQUE_VIOLATION = "23505";

export async function createSession(
  participantId: string,
  mode: Mode
): Promise<CreateSessionResult> {
  try {
    const { data, error } = await supabase
      .from("sessions")
      .insert({ participant_id: participantId, mode })
      .select("id")
      .single();

    if (error) {
      if (error.code === POSTGRES_UNIQUE_VIOLATION) {
        return { status: "duplicate" };
      }
      console.error("createSession error:", error);
      return { status: "error" };
    }

    if (!data?.id) return { status: "error" };
    return { status: "ok", sessionId: data.id };
  } catch (err) {
    console.error("createSession threw:", err);
    return { status: "error" };
  }
}

export async function logSlideshowResponse(
  sessionId: string,
  pairNumber: number,
  answer: SlideshowAnswer,
  confidence: number
): Promise<void> {
  try {
    const { error } = await supabase.from("slideshow_responses").insert({
      session_id: sessionId,
      pair_number: pairNumber,
      answer,
      confidence,
    });
    if (error) console.error("logSlideshowResponse error:", error);
  } catch (err) {
    console.error("logSlideshowResponse threw:", err);
  }
}

export async function logSeeYourselfResponse(
  sessionId: string,
  answer: SeeYourselfAnswer,
  confidence: number
): Promise<void> {
  try {
    const { error } = await supabase.from("see_yourself_responses").insert({
      session_id: sessionId,
      answer,
      confidence,
    });
    if (error) console.error("logSeeYourselfResponse error:", error);
  } catch (err) {
    console.error("logSeeYourselfResponse threw:", err);
  }
}

export async function logOpenEndedResponse(
  sessionId: string,
  questionNumber: number,
  response: string | null
): Promise<void> {
  try {
    const { error } = await supabase.from("open_ended_responses").insert({
      session_id: sessionId,
      question_number: questionNumber,
      response,
    });
    if (error) console.error("logOpenEndedResponse error:", error);
  } catch (err) {
    console.error("logOpenEndedResponse threw:", err);
  }
}

export async function triggerPipelineStart(): Promise<void> {
  const ngrokUrl = process.env.NEXT_PUBLIC_NGROK_URL;
  if (!ngrokUrl) return;
  try {
    await fetch(`${ngrokUrl.replace(/\/$/, "")}/start`, { method: "POST" });
  } catch (err) {
    console.error("triggerPipelineStart threw:", err);
  }
}

export async function triggerPipelineStop(): Promise<void> {
  const ngrokUrl = process.env.NEXT_PUBLIC_NGROK_URL;
  if (!ngrokUrl) return;
  try {
    await fetch(`${ngrokUrl.replace(/\/$/, "")}/stop`, { method: "POST" });
  } catch (err) {
    console.error("triggerPipelineStop threw:", err);
  }
}
