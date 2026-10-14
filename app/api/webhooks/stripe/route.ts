import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { processCompletedOrder } from "@/lib/payments";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("stripe-signature");

    // In production, verify signature using stripe.webhooks.constructEvent()
    // For test simulation, parse payload
    let event: any;
    try {
      event = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid payload JSON" }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data?.object;
      const orderId = session?.metadata?.orderId;
      const transactionId = session?.payment_intent || session?.id || `txn_${Date.now()}`;

      if (orderId) {
        await processCompletedOrder(orderId, transactionId, "STRIPE");
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
