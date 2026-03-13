import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Returns all categories with their available menu items — used for client-side search
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { displayOrder: "asc" },
      include: {
        menuItems: {
          where: { available: true },
          orderBy: { createdAt: "asc" },
          select: { id: true, name: true, description: true, price: true, image: true },
        },
      },
    });
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json({ error: "Failed to fetch menu" }, { status: 500 });
  }
}
