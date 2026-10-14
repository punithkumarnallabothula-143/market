import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { generateOrderNumber, processCompletedOrder } from "@/lib/payments";
import { calculateFinancials } from "@/lib/currency";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required to checkout" }, { status: 401 });
    }

    const { productId, paymentMethod = "DEMO", licenseType = "Standard" } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    // 1. Fetch product securely from database (NEVER trust client price)
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || product.status !== "PUBLISHED") {
      return NextResponse.json({ error: "Product is not available for purchase" }, { status: 404 });
    }

    const finalPrice = product.isFree ? 0 : (product.discountPrice || product.price);
    const { subtotal, discount, tax, total } = calculateFinancials(finalPrice);
    const orderNumber = generateOrderNumber();

    // 2. Create Order in DB
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user.id,
        status: finalPrice === 0 ? "COMPLETED" : "PENDING",
        subtotal,
        discount,
        tax,
        total,
        currency: product.currency,
        paymentMethod,
        items: {
          create: {
            productId: product.id,
            price: finalPrice,
            licenseType,
          },
        },
      },
    });

    // If free or DEMO checkout mode, fulfill order immediately on server
    if (finalPrice === 0 || paymentMethod === "DEMO") {
      const demoTxnId = `txn_demo_${Date.now()}`;
      await processCompletedOrder(order.id, demoTxnId, "DEMO");

      return NextResponse.json({
        success: true,
        orderId: order.id,
        orderNumber: order.orderNumber,
        redirectUrl: `/checkout/success?orderId=${order.id}`,
      });
    }

    // If Stripe or other provider requested
    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      redirectUrl: `/checkout/success?orderId=${order.id}`,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Failed to process checkout" }, { status: 500 });
  }
}
