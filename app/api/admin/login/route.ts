import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { password } = await req.json().catch(() => ({ password: "" }));
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected) {
    return NextResponse.json({ ok: false, error: "ADMIN_PASSWORD is not configured" }, { status: 500 });
  }

  return NextResponse.json({ ok: password === expected });
}
