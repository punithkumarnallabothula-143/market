import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required to download files" }, { status: 401 });
    }

    const { productId } = params;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { files: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Free templates are accessible to all registered users
    let authorized = product.isFree;
    let orderId: string | null = null;

    if (!authorized) {
      // Check if user is the creator or an admin
      if (user.role === "ADMIN" || product.creatorId === user.id) {
        authorized = true;
      } else {
        // Verify completed order purchase
        const orderItem = await prisma.orderItem.findFirst({
          where: {
            productId,
            order: {
              userId: user.id,
              status: "COMPLETED",
            },
          },
          include: { order: true },
        });

        if (orderItem) {
          authorized = true;
          orderId = orderItem.orderId;
        }
      }
    }

    if (!authorized) {
      return NextResponse.json(
        { error: "Access denied. You have not purchased this template." },
        { status: 403 }
      );
    }

    // Find first order ID if free or not yet assigned
    if (!orderId) {
      const order = await prisma.order.findFirst({
        where: { userId: user.id },
      });
      orderId = order?.id || "direct_free_grant";
    }

    // Record download event in DB
    await prisma.downloadRecord.create({
      data: {
        orderId,
        productId,
        userId: user.id,
        ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
        userAgent: req.headers.get("user-agent") || "Browser",
      },
    });

    // Provide digital package with license and instructions
    const fileName = `${product.slug}-framer-package.zip`;
    const payload = JSON.stringify(
      {
        product: product.title,
        slug: product.slug,
        version: "1.0.0",
        licensedTo: user.email,
        downloadTimestamp: new Date().toISOString(),
        framerRemixUrl: product.framerRemixUrl || "https://framer.com",
        instructions: product.setupInstructions || "Import into Framer and publish.",
        notice: "Authorized digital asset download from FrameMarket.",
      },
      null,
      2
    );

    return new Response(payload, {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("Download authorization error:", error);
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}
