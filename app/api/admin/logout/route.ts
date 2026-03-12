import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const response = NextResponse.json({ success: true });
  response.cookies.set("talav_admin_token", "", { maxAge: 0, path: "/" });
  return response;
}
