import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== "CREATOR" && user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized. Creator access required." }, { status: 403 });
    }

    const body = await req.json();
    const {
      title,
      slug,
      shortDesc,
      description,
      categorySlug,
      coverImage,
      previewUrl,
      framerRemixUrl,
      includedPages,
      features,
      compatibility,
      setupInstructions,
      isFree,
      price,
      status = "PUBLISHED",
    } = body;

    if (!title || !shortDesc || !coverImage) {
      return NextResponse.json({ error: "Title, summary, and cover image are required" }, { status: 400 });
    }

    // Find category
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
    });

    if (!category) {
      return NextResponse.json({ error: "Invalid category selected" }, { status: 400 });
    }

    const cleanSlug = slug
      ? slug.toLowerCase().replace(/[^a-z0-9]+/g, "-")
      : title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    // Check unique slug
    const existing = await prisma.product.findUnique({ where: { slug: cleanSlug } });
    const finalSlug = existing ? `${cleanSlug}-${Date.now().toString().slice(-4)}` : cleanSlug;

    const newProduct = await prisma.product.create({
      data: {
        title: title.trim(),
        slug: finalSlug,
        shortDesc: shortDesc.trim(),
        description: description ? description.trim() : "",
        categoryId: category.id,
        creatorId: user.id,
        coverImage: coverImage.trim(),
        previewUrl: previewUrl ? previewUrl.trim() : null,
        framerRemixUrl: framerRemixUrl ? framerRemixUrl.trim() : null,
        isFree: Boolean(isFree),
        price: isFree ? 0 : Number(price) || 0,
        currency: "INR",
        status: status === "DRAFT" ? "DRAFT" : "PUBLISHED",
        includedPages: JSON.stringify(
          typeof includedPages === "string" ? includedPages.split(",").map((s: string) => s.trim()) : includedPages
        ),
        features: JSON.stringify(
          typeof features === "string" ? features.split(",").map((s: string) => s.trim()) : features
        ),
        compatibility: compatibility || "Framer 2024+",
        setupInstructions: setupInstructions || "",
      },
    });

    // Create file entry
    await prisma.productFile.create({
      data: {
        productId: newProduct.id,
        fileName: `${cleanSlug}-Framer-Assets.zip`,
        fileSizeBytes: 28500000,
        downloadUrl: `/api/downloads/${newProduct.id}`,
        version: "1.0.0",
      },
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json({ error: "Failed to publish template" }, { status: 500 });
  }
}
