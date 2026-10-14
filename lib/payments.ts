import crypto from "crypto";
import prisma from "@/lib/prisma";
import { calculateFinancials } from "@/lib/currency";

export interface CreateOrderParams {
  productId: string;
  userId: string;
  paymentMethod: "DEMO" | "STRIPE" | "RAZORPAY";
  licenseType?: "Standard" | "Extended";
}

export function generateLicenseKey(productSlug: string, licenseType: string = "STD"): string {
  const prefix = productSlug.slice(0, 4).toUpperCase();
  const randomPart = crypto.randomBytes(4).toString("hex").toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `FM-${prefix}-${randomPart}-${timestamp}-${licenseType.slice(0, 3).toUpperCase()}`;
}

export function generateOrderNumber(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `FM-ORD-${dateStr}-${random}`;
}

export async function processCompletedOrder(orderId: string, transactionId: string, provider: string) {
  return await prisma.$transaction(async (tx) => {
    // 1. Fetch order with items
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: {
              include: {
                creator: {
                  include: {
                    creatorProfile: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    if (order.status === "COMPLETED") {
      // Idempotent: already completed
      return order;
    }

    // 2. Update order to COMPLETED
    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: {
        status: "COMPLETED",
        providerTransactionId: transactionId,
        paymentMethod: provider,
      },
    });

    // 3. Create payment record
    await tx.payment.create({
      data: {
        orderId: order.id,
        provider,
        status: "SUCCEEDED",
        amount: order.total,
        currency: order.currency,
        transactionId,
      },
    });

    // 4. Generate Licenses & update product and creator stats
    for (const item of order.items) {
      const licenseKey = generateLicenseKey(item.product.slug, item.licenseType);

      await tx.license.create({
        data: {
          licenseKey,
          orderId: order.id,
          productId: item.productId,
          userId: order.userId,
          licenseType: item.licenseType,
          status: "ACTIVE",
        },
      });

      // Increment product sales
      await tx.product.update({
        where: { id: item.productId },
        data: {
          salesCount: { increment: 1 },
        },
      });

      // Update creator profile earnings and sales count
      const creatorProfile = item.product.creator.creatorProfile;
      if (creatorProfile) {
        const { creatorGrossShare } = calculateFinancials(item.price);
        await tx.creatorProfile.update({
          where: { id: creatorProfile.id },
          data: {
            totalSales: { increment: 1 },
            netEarnings: { increment: creatorGrossShare },
          },
        });
      }
    }

    // 5. Create audit log
    await tx.auditLog.create({
      data: {
        userId: order.userId,
        action: "ORDER_COMPLETED",
        entity: "Order",
        entityId: order.id,
        metadata: JSON.stringify({
          orderNumber: order.orderNumber,
          total: order.total,
          provider,
          transactionId,
        }),
      },
    });

    return updatedOrder;
  });
}
