import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import orderEmitter from "@/lib/orderEmitter";

type OrderStatus = "Pending" | "Preparing" | "Ready" | "Served";

const STATUS_FLOW: Record<OrderStatus, OrderStatus | null> = {
  Pending: "Preparing",
  Preparing: "Ready",
  Ready: "Served",
  Served: null,
};

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const order = await prisma.order.findUnique({ where: { id } });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const currentStatus = order.status as OrderStatus;
    const nextStatus = STATUS_FLOW[currentStatus];

    if (!nextStatus) {
      return NextResponse.json({ error: "Order is already completed" }, { status: 400 });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status: nextStatus },
      include: {
        items: { include: { menuItem: { select: { id: true, name: true } } } },
      },
    });

    // 🔔 Push status change to all listening SSE clients
    orderEmitter.emit("status-change", updated);

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 });
  }
}

