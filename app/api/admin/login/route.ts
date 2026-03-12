import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { signAdminJWT } from "@/lib/adminAuth";

export async function POST(request: Request) {
  try {
    const { pin } = await request.json();

    if (!pin) {
      return NextResponse.json({ error: "PIN is required" }, { status: 400 });
    }

    const admin = await prisma.admin.findFirst({ where: { pin: String(pin) } });

    if (!admin) {
      return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
    }

    const token = await signAdminJWT();

    const response = NextResponse.json({ success: true });
    response.cookies.set("talav_admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 12, // 12 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
