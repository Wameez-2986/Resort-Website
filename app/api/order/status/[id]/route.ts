import { NextResponse } from "next/server";
import orderEmitter from "@/lib/orderEmitter";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const encoder = new TextEncoder();

  // Verify order exists
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const stream = new ReadableStream({
    start(controller) {
      // Send initial status immediately
      const initialData = `event: initial-status\ndata: ${JSON.stringify({ status: order.status })}\n\n`;
      controller.enqueue(encoder.encode(initialData));

      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": heartbeat\n\n"));
        } catch {
          clearInterval(heartbeat);
        }
      }, 20_000);

      const onStatusChange = (updatedOrder: any) => {
        if (updatedOrder.id === id) {
          try {
            const data = `event: status-change\ndata: ${JSON.stringify({ status: updatedOrder.status })}\n\n`;
            controller.enqueue(encoder.encode(data));
          } catch {
            orderEmitter.off("status-change", onStatusChange);
            clearInterval(heartbeat);
          }
        }
      };

      orderEmitter.on("status-change", onStatusChange);

      return () => {
        clearInterval(heartbeat);
        orderEmitter.off("status-change", onStatusChange);
      };
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
