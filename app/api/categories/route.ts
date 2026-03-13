import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Public endpoint — returns all categories ordered by displayOrder
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { displayOrder: "asc" },
    });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
