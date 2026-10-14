import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });
    }

    // Record audit / inquiry event
    await prisma.auditLog.create({
      data: {
        action: "CONTACT_INQUIRY",
        entity: "Support",
        metadata: JSON.stringify({ name, email, subject, messagePreview: message.slice(0, 100) }),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
