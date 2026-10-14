import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");
    const category = searchParams.get("category");
    const isFree = searchParams.get("free") === "true";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      status: "PUBLISHED",
    };

    if (q) {
      where.OR = [
        { title: { contains: q } },
        { shortDesc: { contains: q } },
        { description: { contains: q } },
      ];
    }

    if (category) {
      where.category = { slug: category };
    }

    if (isFree) {
      where.isFree = true;
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        creator: {
          include: {
            creatorProfile: true,
          },
        },
      },
      orderBy: { salesCount: "desc" },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Products API error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
