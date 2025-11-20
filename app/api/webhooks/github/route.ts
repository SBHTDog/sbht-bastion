import { createWebhookRecord } from "@/src/db/dbacc";
import { NextResponse } from "next/server";
import { webhookEmitter } from "@/src/github/webhook-emitter";

export async function POST(request: Request) {
    try {
        const res = await request.json();
        console.log("GitHub Webhook Payload:", res);

        const record = await createWebhookRecord(res);
        console.log("Saved webhook to database:", record);

        // Emit webhook event to all connected SSE clients
        console.log("Emitting webhook event to SSE clients:", webhookEmitter.getListenerCount());
        webhookEmitter.emit({
            event: request.headers.get('x-github-event') || 'unknown',
            payload: res,
            recordId: record.id,
            timestamp: record.created_at,
        });

        return NextResponse.json({
            success: true,
            recordId: record.id,
            timestamp: record.created_at,
        });
    } catch (error) {
        console.error("Error processing webhook:", error);
        return NextResponse.json(
            { success: false, error: "Failed to process webhook" },
            { status: 500 }
        );
    }
}
