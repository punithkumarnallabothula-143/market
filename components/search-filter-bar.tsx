"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, X, ArrowUpDown, SlidersHorizontal, Check } from "lucide-react";
import { CategoryWithCount } from "@/types";

interface SearchFilterBarProps {
  categories: CategoryWithCount[];
}

export default function SearchFilterBar({ categories }: SearchFilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("cat") || "");
  const [priceType, setPriceType] = useState(searchParams.get("price") || "all"); // all, free, paid
  const [sort, setSort] = useState(searchParams.get("sort") || "popular");
  const [minPrice, setMinPrice] = useState(searchParams.get("min") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max") || "");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Sync state if URL changes externally
  useEffect(() => {
    setQuery(searchParams.get("q") || "");
    setSelectedCategory(searchParams.get("cat") || "");
    setPriceType(searchParams.get("price") || "all");
    setSort(searchParams.get("sort") || "popular");
    setMinPrice(searchParams.get("min") || "");
    setMaxPrice(searchParams.get("max") || "");
  }, [searchParams]);

  const applyFilters = (overrides?: Record<string, string>) => {
    const params = new URLSearchParams();

    const qVal = overrides?.q !== undefined ? overrides.q : query;
    const catVal = overrides?.cat !== undefined ? overrides.cat : selectedCategory;
    const priceVal = overrides?.price !== undefined ? overrides.price : priceType;
    const sortVal = overrides?.sort !== undefined ? overrides.sort : sort;
    const minVal = overrides?.min !== undefined ? overrides.min : minPrice;
    const maxVal = overrides?.max !== undefined ? overrides.max : maxPrice;

    if (qVal) params.set("q", qVal);
    if (catVal) params.set("cat", catVal);
    if (priceVal && priceVal !== "all") params.set("price", priceVal);
    if (sortVal && sortVal !== "popular") params.set("sort", sortVal);
    if (minVal) params.set("min", minVal);
    if (maxVal) params.set("max", maxVal);

    router.push(`/explore?${params.toString()}`);
  };

  const clearAll = () => {
    setQuery("");
    setSelectedCategory("");
    setPriceType("all");
    setSort("popular");
    setMinPrice("");
    setMaxPrice("");
    router.push("/explore");
  };

  const hasActiveFilters = Boolean(
    query || selectedCategory || (priceType && priceType !== "all") || minPrice || maxPrice || (sort && sort !== "popular")
  );

  return (
    <div className="w-full space-y-4">
      {/* Top Search & Primary Filters Row */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search templates by keyword, title, or creator..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            className="w-full rounded-2xl border border-zinc-200 bg-white pl-10 pr-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 shadow-sm"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                applyFilters({ q: "" });
              }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category Dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            applyFilters({ cat: e.target.value });
          }}
          className="w-full md:w-48 rounded-2xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs font-medium text-zinc-700 focus:border-brand-500 focus:outline-none shadow-sm cursor-pointer"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Pricing Segment Selector */}
        <div className="flex rounded-2xl border border-zinc-200 bg-white p-1 shadow-sm w-full md:w-auto">
          <button
            onClick={() => {
              setPriceType("all");
              applyFilters({ price: "all" });
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              priceType === "all" ? "bg-zinc-900 text-white" : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            All
          </button>
          <button
            onClick={() => {
              setPriceType("free");
              applyFilters({ price: "free" });
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              priceType === "free" ? "bg-emerald-600 text-white" : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Free
          </button>
          <button
            onClick={() => {
              setPriceType("paid");
              applyFilters({ price: "paid" });
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              priceType === "paid" ? "bg-brand-600 text-white" : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Paid
          </button>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-1.5 w-full md:w-auto">
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              applyFilters({ sort: e.target.value });
            }}
            className="w-full md:w-40 rounded-2xl border border-zinc-200 bg-white px-3 py-2.5 text-xs font-medium text-zinc-700 focus:border-brand-500 focus:outline-none shadow-sm cursor-pointer"
          >
            <option value="popular">Most Popular</option>
            <option value="newest">Newest First</option>
            <option value="rating">Highest Rated</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>

        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          className="md:hidden flex items-center justify-center gap-2 w-full rounded-2xl border border-zinc-200 bg-white py-2.5 text-xs font-semibold text-zinc-700 shadow-sm"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Advanced Filters</span>
        </button>
      </div>

      {/* Advanced Price Range Filter Drawer / Accordion */}
      {isMobileFiltersOpen && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 space-y-3 shadow-sm animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-700">Price Range (₹)</span>
            <button
              onClick={() => setIsMobileFiltersOpen(false)}
              className="text-zinc-400 hover:text-zinc-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              placeholder="Min ₹"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-1/2 rounded-xl border border-zinc-200 px-3 py-1.5 text-xs text-zinc-900"
            />
            <span className="text-zinc-400">-</span>
            <input
              type="number"
              placeholder="Max ₹"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-1/2 rounded-xl border border-zinc-200 px-3 py-1.5 text-xs text-zinc-900"
            />
            <button
              onClick={() => applyFilters()}
              className="rounded-xl bg-zinc-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="font-medium text-zinc-500">Active filters:</span>

          {query && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 border border-zinc-200 px-3 py-1 text-zinc-800">
              Keyword: "{query}"
              <button
                onClick={() => {
                  setQuery("");
                  applyFilters({ q: "" });
                }}
                className="hover:text-rose-500"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          )}

          {selectedCategory && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 border border-brand-200 px-3 py-1 text-brand-700 font-medium">
              Category: {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
              <button
                onClick={() => {
                  setSelectedCategory("");
                  applyFilters({ cat: "" });
                }}
                className="hover:text-rose-500"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          )}

          {priceType !== "all" && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 border border-zinc-200 px-3 py-1 text-zinc-800 font-medium capitalize">
              {priceType} templates
              <button
                onClick={() => {
                  setPriceType("all");
                  applyFilters({ price: "all" });
                }}
                className="hover:text-rose-500"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          )}

          {(minPrice || maxPrice) && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 border border-zinc-200 px-3 py-1 text-zinc-800 font-medium">
              ₹{minPrice || "0"} - ₹{maxPrice || "Any"}
              <button
                onClick={() => {
                  setMinPrice("");
                  setMaxPrice("");
                  applyFilters({ min: "", max: "" });
                }}
                className="hover:text-rose-500"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          )}

          <button
            onClick={clearAll}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 underline underline-offset-4 ml-1"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
