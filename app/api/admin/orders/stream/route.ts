import { NextResponse } from "next/server";
import orderEmitter from "@/lib/orderEmitter";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send a heartbeat comment every 20s to keep the connection alive
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": heartbeat\n\n"));
        } catch {
          clearInterval(heartbeat);
        }
      }, 20_000);

      // When a new order arrives, push it to this client
      const onNewOrder = (order: object) => {
        try {
          const data = `data: ${JSON.stringify(order)}\n\n`;
          controller.enqueue(encoder.encode(data));
        } catch {
          // Client disconnected — clean up
          orderEmitter.off("new-order", onNewOrder);
          clearInterval(heartbeat);
        }
      };

      orderEmitter.on("new-order", onNewOrder);

      // Also when any order status changes
      const onStatusChange = (order: object) => {
        try {
          const data = `event: status-change\ndata: ${JSON.stringify(order)}\n\n`;
          controller.enqueue(encoder.encode(data));
        } catch {
          orderEmitter.off("status-change", onStatusChange);
        }
      };

      orderEmitter.on("status-change", onStatusChange);

      // Clean up on client disconnect
      return () => {
        clearInterval(heartbeat);
        orderEmitter.off("new-order", onNewOrder);
        orderEmitter.off("status-change", onStatusChange);
      };
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no", // Disable nginx buffering
    },
  });
}
