import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import orderEmitter from "@/lib/orderEmitter";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tableNumber, items, totalPrice, notes } = body;

    if (!tableNumber || !items || items.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create the order with its items in one Prisma transaction
    const order = await prisma.order.create({
      data: {
        tableNumber: String(tableNumber),
        totalPrice: parseFloat(totalPrice),
        notes: notes || null,
        items: {
          create: items.map((item: { id: string; name: string; quantity: number; price: number }) => ({
            menuItemId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: { include: { menuItem: { select: { id: true, name: true } } } },
      },
    });

    // 🔔 Push to SSE stream so admin KDS updates instantly
    orderEmitter.emit("new-order", order);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      message: "Order placed successfully",
    });
  } catch (error) {
    console.error("Order processing error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


