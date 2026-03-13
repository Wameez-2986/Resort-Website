import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Public endpoint — returns all available menu items for a given category ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const items = await prisma.menuItem.findMany({
      where: { categoryId: id, available: true },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ category, items });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch menu items" }, { status: 500 });
  }
}
