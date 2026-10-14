import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { getSessionUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "FrameMarket — Premium Framer Website Templates Marketplace",
  description:
    "Great websites start with great templates. Discover, preview, purchase, and download premium Framer website templates created by independent designers.",
  keywords: [
    "Framer templates",
    "Framer marketplace",
    "website templates",
    "SaaS landing page",
    "portfolio templates",
    "Framer remix",
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  // Get favorite count if user is logged in
  let favoriteCount = 0;
  if (user) {
    favoriteCount = await prisma.favorite.count({
      where: { userId: user.id },
    });
  }

  return (
    <html lang="en" className={inter.variable}>
      <body className="flex min-h-screen flex-col bg-[#FAFAFC] text-zinc-900 font-sans antialiased selection:bg-brand-500 selection:text-white">
        <Navbar user={user} favoriteCount={favoriteCount} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
