"use client";

import { useState } from "react";
import { ChevronDown, Search, Sparkles } from "lucide-react";

interface FAQItem {
  q: string;
  a: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: "Buyers",
    q: "How do I use a template after purchasing?",
    a: "Immediately upon purchase, you receive an automated Framer Remix link and a downloadable backup package. Clicking the remix link duplicates the entire template directly into your Framer account ready for editing.",
  },
  {
    category: "Buyers",
    q: "Do I need a paid Framer subscription to use these templates?",
    a: "You can edit and preview any template on Framer's free plan. To connect a custom domain or utilize advanced CMS features beyond the free tier limits, you may choose to subscribe to a Framer Site plan.",
  },
  {
    category: "Buyers",
    q: "Can I use the template for multiple client projects?",
    a: "The Standard License allows use for one end product (personal or commercial). If you intend to use the template for multiple clients or redistribute derivative templates, an Extended License is required.",
  },
  {
    category: "Creators",
    q: "What commission does FrameMarket take?",
    a: "FrameMarket charges a flat 10% platform fee on completed sales. You keep 90% of the gross sale price.",
  },
  {
    category: "Creators",
    q: "How do I get paid?",
    a: "You can link your Indian UPI ID or Bank Account (via IFSC). Payout requests can be submitted whenever your balance is ₹1,000 or above and are processed within 3-5 business days.",
  },
  {
    category: "Creators",
    q: "How does the template review and moderation process work?",
    a: "After submitting your template, our design team verifies responsiveness, breakpoint behavior, CMS field setups, and asset copyright within 24 to 48 hours before setting it to Published.",
  },
];

export default function FAQPage() {
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase()) ||
      f.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-zinc-600 max-w-md mx-auto">
          Everything you need to know about purchasing, remixing, and selling on FrameMarket.
        </p>

        {/* Search */}
        <div className="max-w-md mx-auto pt-2">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-zinc-200 bg-white pl-10 pr-4 py-2.5 text-xs text-zinc-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filteredFaqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="rounded-2xl border border-zinc-200 bg-white transition-all overflow-hidden shadow-card"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left font-semibold text-zinc-900 text-sm hover:text-brand-600 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 text-zinc-400 transition-transform duration-200 flex-shrink-0 ml-4 ${
                    isOpen ? "rotate-180 text-brand-600" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-xs text-zinc-600 leading-relaxed border-t border-zinc-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
