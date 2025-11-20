// Simple in-memory event emitter for webhook notifications
// Uses globalThis to ensure true singleton across HMR and module reloads
type WebhookEventListener = (data: any) => void;

class WebhookEventEmitter {
  private listeners: Set<WebhookEventListener> = new Set();

  subscribe(listener: WebhookEventListener): () => void {
    this.listeners.add(listener);
    console.log(`Listener subscribed. Total listeners: ${this.listeners.size}`);
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
      console.log(`Listener unsubscribed. Total listeners: ${this.listeners.size}`);
    };
  }

  emit(data: any): void {
    console.log(`Emitting to ${this.listeners.size} listeners:`, {
      event: data.event,
      recordId: data.recordId
    });
    
    if (this.listeners.size === 0) {
      console.warn('⚠️ No listeners connected to receive webhook event!');
    }
    
    this.listeners.forEach(listener => {
      try {
        listener(data);
      } catch (error) {
        console.error('Error in webhook event listener:', error);
      }
    });
  }

  getListenerCount(): number {
    return this.listeners.size;
  }
}

// Use globalThis to ensure true singleton across HMR and module reloads
declare global {
  var __webhookEmitter: WebhookEventEmitter | undefined;
}

if (!globalThis.__webhookEmitter) {
  globalThis.__webhookEmitter = new WebhookEventEmitter();
  console.log('✨ WebhookEmitter singleton initialized');
}

export const webhookEmitter = globalThis.__webhookEmitter;
