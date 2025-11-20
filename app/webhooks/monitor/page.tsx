'use client';

import { useEffect, useState } from 'react';

interface WebhookEvent {
  type: 'connected' | 'webhook' | 'heartbeat';
  message?: string;
  data?: any;
  timestamp: string;
  listeners?: number;
}

export default function WebhookMonitorPage() {
  const [events, setEvents] = useState<WebhookEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let eventSource: EventSource | null = null;

    const connect = () => {
      try {
        // Connect to SSE endpoint
        eventSource = new EventSource('/api/webhooks/events');

        eventSource.onopen = () => {
          setConnected(true);
          setError(null);
          console.log('SSE connection opened');
        };

        eventSource.onmessage = (event) => {
          try {
            const data: WebhookEvent = JSON.parse(event.data);
            console.log('Received event:', data);
            
            setEvents((prev) => [data, ...prev].slice(0, 50)); // Keep last 50 events
          } catch (err) {
            console.error('Error parsing SSE message:', err);
          }
        };

        eventSource.onerror = (err) => {
          console.error('SSE error:', err);
          setConnected(false);
          setError('Connection lost. Reconnecting...');
          eventSource?.close();
          
          // Attempt to reconnect after 3 seconds
          setTimeout(connect, 3000);
        };
      } catch (err) {
        console.error('Failed to create EventSource:', err);
        setError('Failed to connect to event stream');
      }
    };

    connect();

    // Cleanup on unmount
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  const getEventColor = (type: string) => {
    switch (type) {
      case 'connected':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'webhook':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'heartbeat':
        return 'bg-gray-100 border-gray-300 text-gray-600';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'connected':
        return '✅';
      case 'webhook':
        return '📨';
      case 'heartbeat':
        return '💓';
      default:
        return '📡';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">GitHub Webhook Monitor</h1>
          <p className="text-gray-600">
            Real-time webhook events via Server-Sent Events (SSE)
          </p>
        </div>

        {/* Connection Status */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                }`}
              ></div>
              <span className="font-semibold">
                {connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              {events.length} events received
            </div>
          </div>
          {error && (
            <div className="mt-3 text-sm text-red-600">{error}</div>
          )}
        </div>

        {/* Webhook Endpoint Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-2">Webhook Endpoint:</h3>
          <code className="bg-white px-3 py-2 rounded border border-blue-300 text-sm block">
            POST http://localhost:3000/api/webhooks/github
          </code>
          <p className="text-sm text-gray-600 mt-2">
            Send a POST request to this endpoint to see events appear in real-time
          </p>
        </div>

        {/* Events List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Event Stream</h2>
          
          {events.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-2">👀</div>
              <p>Waiting for webhook events...</p>
              <p className="text-sm mt-1">Events will appear here in real-time</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {events.map((event, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 ${getEventColor(event.type)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getEventIcon(event.type)}</span>
                      <span className="font-semibold capitalize">{event.type}</span>
                      {event.type === 'webhook' && event.data?.event && (
                        <span className="text-sm bg-white px-2 py-1 rounded">
                          {event.data.event}
                        </span>
                      )}
                    </div>
                    <span className="text-xs opacity-75">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  {event.message && (
                    <p className="text-sm mb-2">{event.message}</p>
                  )}

                  {event.type === 'heartbeat' && event.listeners !== undefined && (
                    <p className="text-sm">
                      Active listeners: {event.listeners}
                    </p>
                  )}

                  {event.type === 'webhook' && event.data && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm font-medium mb-2">
                        View Payload
                      </summary>
                      <pre className="bg-white rounded p-3 text-xs overflow-x-auto border">
                        {JSON.stringify(event.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Test Section */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h3 className="font-semibold mb-3">Test with curl:</h3>
          <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
            {`curl -X POST http://localhost:3000/api/webhooks/github \\
  -H "Content-Type: application/json" \\
  -H "X-GitHub-Event: push" \\
  -d '{"test": "webhook", "message": "Hello from curl!"}'`}
          </pre>
        </div>
      </div>
    </div>
  );
}
