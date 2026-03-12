import { EventEmitter } from "events";

// Global singleton SSE emitter so order creation can notify the stream route
// This works for single-server deployments (no Redis needed)
declare const globalThis: {
  orderEmitter: EventEmitter;
} & typeof global;

const orderEmitter: EventEmitter =
  globalThis.orderEmitter ?? new EventEmitter();

globalThis.orderEmitter = orderEmitter;

// Increase max listeners to avoid memory leak warnings
orderEmitter.setMaxListeners(100);

export default orderEmitter;
