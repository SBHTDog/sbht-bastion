'use client';

import { useEffect, useState } from 'react';
import { Card, Badge } from '@/components/ui';

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
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">GitHub Webhook Monitor</h1>
          <p className="text-gray-600">
            Real-time webhook events via Server-Sent Events (SSE)
          </p>
        </div>

        {/* Connection Status */}
        <Card className="mb-6 animate-slideUp">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                }`}
              ></div>
              <span className="font-semibold text-gray-800">
                {connected ? 'Connected' : 'Disconnected'}
              </span>
              {connected && (
                <Badge variant="success" className="text-xs">
                  Live
                </Badge>
              )}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-blue-600">{events.length}</span> events received
            </div>
          </div>
          {error && (
            <div className="mt-3 text-sm text-red-600 flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}
        </Card>

        {/* Webhook Endpoint Info */}
        <Card className="mb-6 bg-blue-50/50 animate-slideUp">
          <h3 className="font-semibold mb-3 text-gray-800">Webhook Endpoint</h3>
          <code className="bg-white/80 backdrop-blur-sm px-4 py-3 rounded-lg border border-blue-200 text-sm block font-mono text-gray-700">
            POST http://localhost:3000/api/webhooks/github
          </code>
          <p className="text-sm text-gray-600 mt-3 leading-relaxed">
            Send a POST request to this endpoint to see events appear in real-time
          </p>
        </Card>

        {/* Events List */}
        <Card className="animate-slideUp">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800">Event Stream</h2>

          {events.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <div className="text-5xl mb-3">👀</div>
              <p className="font-medium text-lg">Waiting for webhook events...</p>
              <p className="text-sm mt-2">Events will appear here in real-time</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
              {events.map((event, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 transition-all hover:shadow-md ${getEventColor(event.type)}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xl">{getEventIcon(event.type)}</span>
                      <span className="font-semibold capitalize">{event.type}</span>
                      {event.type === 'webhook' && event.data?.event && (
                        <Badge variant="default" className="text-xs">
                          {event.data.event}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs opacity-75 whitespace-nowrap">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  {event.message && (
                    <p className="text-sm mb-2 leading-relaxed">{event.message}</p>
                  )}

                  {event.type === 'heartbeat' && event.listeners !== undefined && (
                    <p className="text-sm">
                      Active listeners: <span className="font-semibold">{event.listeners}</span>
                    </p>
                  )}

                  {event.type === 'webhook' && event.data && (
                    <details className="mt-3">
                      <summary className="cursor-pointer text-sm font-medium mb-2 hover:text-blue-600 transition-colors">
                        View Payload →
                      </summary>
                      <pre className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-xs overflow-x-auto border border-gray-200 font-mono">
                        {JSON.stringify(event.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Test Section */}
        <Card className="mt-6 animate-slideUp">
          <h3 className="font-semibold mb-4 text-gray-800">Test with curl</h3>
          <pre className="bg-gray-800 text-green-400 p-4 rounded-lg text-sm overflow-x-auto font-mono">
            {`curl -X POST http://localhost:3000/api/webhooks/github \\
  -H "Content-Type: application/json" \\
  -H "X-GitHub-Event: push" \\
  -d '{"test": "webhook", "message": "Hello from curl!"}'`}
          </pre>
        </Card>
      </div>
    </div>
  );
}
