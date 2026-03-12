import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all menu items with their category
export async function GET() {
  try {
    const items = await prisma.menuItem.findMany({
      orderBy: { createdAt: "asc" },
      include: { category: { select: { id: true, name: true } } },
    });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch menu items" }, { status: 500 });
  }
}

// POST create menu item
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, image, categoryId, available } = body;

    if (!name || !price || !categoryId) {
      return NextResponse.json({ error: "Name, price and category are required" }, { status: 400 });
    }

    const item = await prisma.menuItem.create({
      data: {
        name,
        description: description || null,
        price: parseFloat(price),
        image: image || null,
        categoryId,
        available: available ?? true,
      },
      include: { category: { select: { id: true, name: true } } },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create menu item" }, { status: 500 });
  }
}
