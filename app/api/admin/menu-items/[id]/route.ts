import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PUT update menu item
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, price, image, imageKey, categoryId, available } = body;

    const item = await prisma.menuItem.update({
      where: { id },
      data: {
        name: name ?? undefined,
        description: description ?? undefined,
        price: price !== undefined ? parseFloat(price) : undefined,
        image: image ?? undefined,
        imageKey: imageKey ?? undefined,
        categoryId: categoryId ?? undefined,
        available: available ?? undefined,
      },
      include: { category: { select: { id: true, name: true } } },
    });

    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update menu item" }, { status: 500 });
  }
}

// DELETE menu item
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.menuItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete menu item" }, { status: 500 });
  }
}
