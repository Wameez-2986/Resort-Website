import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all orders, newest first, with items
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            menuItem: { select: { id: true, name: true } },
          },
        },
      },
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
