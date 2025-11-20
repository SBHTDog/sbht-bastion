import { NextRequest } from 'next/server';
import { webhookEmitter } from '@/src/github/webhook-emitter';

// Use nodejs runtime to share memory with webhook endpoint
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  // Create a readable stream for SSE
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      // Send initial connection message
      const send = (data: any) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
        );
      };

      // Send connection established message
      send({ 
        type: 'connected', 
        message: 'Connected to webhook event stream',
        timestamp: new Date().toISOString()
      });

      // Subscribe to webhook events
      const unsubscribe = webhookEmitter.subscribe((webhookData) => {
        send({
          type: 'webhook',
          data: webhookData,
          timestamp: new Date().toISOString()
        });
      });

      // Send periodic heartbeat to keep connection alive
      const heartbeatInterval = setInterval(() => {
        send({ 
          type: 'heartbeat', 
          timestamp: new Date().toISOString(),
          listeners: webhookEmitter.getListenerCount()
        });
      }, 30000); // Every 30 seconds

      // Cleanup on connection close
      request.signal.addEventListener('abort', () => {
        clearInterval(heartbeatInterval);
        unsubscribe();
        controller.close();
      });
    },
  });

  // Return SSE response
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
