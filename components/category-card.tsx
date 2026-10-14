import Link from "next/link";
import {
  Laptop,
  Briefcase,
  Building2,
  ShoppingBag,
  UserCheck,
  Rocket,
  BookOpen,
  Cpu,
  Home,
  Smartphone,
  Layers,
} from "lucide-react";
import { CategoryWithCount } from "@/types";

interface CategoryCardProps {
  category: CategoryWithCount;
}

const iconMap: Record<string, React.ElementType> = {
  Laptop,
  Briefcase,
  Building2,
  ShoppingBag,
  UserCheck,
  Rocket,
  BookOpen,
  Cpu,
  Home,
  Smartphone,
};

export default function CategoryCard({ category }: CategoryCardProps) {
  const IconComponent = category.icon && iconMap[category.icon] ? iconMap[category.icon] : Layers;

  return (
    <Link
      href={`/explore?cat=${category.slug}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 hover:border-brand-300"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-200 shadow-sm">
          <IconComponent className="h-5 w-5" />
        </div>
        {category._count?.products !== undefined && (
          <span className="text-[11px] font-semibold text-zinc-400 group-hover:text-zinc-600 transition-colors">
            {category._count.products} templates
          </span>
        )}
      </div>

      <div className="mt-4">
        <h4 className="text-sm font-bold text-zinc-900 group-hover:text-brand-600 transition-colors">
          {category.name}
        </h4>
        {category.description && (
          <p className="mt-1 text-xs text-zinc-500 line-clamp-2 leading-relaxed">
            {category.description}
          </p>
        )}
      </div>

      <div className="mt-4 flex items-center text-xs font-semibold text-brand-600 group-hover:translate-x-1 transition-transform duration-200">
        <span>Explore templates →</span>
      </div>
    </Link>
  );
}
