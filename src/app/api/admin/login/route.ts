import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const expectedEmail    = process.env.ADMIN_EMAIL    ?? "";
  const expectedPassword = process.env.ADMIN_PASSWORD ?? "";
  const secret           = process.env.ADMIN_SECRET   ?? "";

  if (
    !secret ||
    email    !== expectedEmail ||
    password !== expectedPassword
  ) {
    return NextResponse.json({ error: "Email atau password salah." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_session", secret, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "lax",
    path:     "/",
    maxAge:   60 * 60 * 24 * 7, // 7 days
  });
  return res;
}
