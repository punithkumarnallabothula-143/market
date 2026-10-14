export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: string;
  avatarUrl?: string | null;
  creatorProfile?: {
    id: string;
    storeName: string;
    verified: boolean;
  } | null;
}

export interface ProductWithRelations {
  id: string;
  slug: string;
  title: string;
  shortDesc: string;
  description: string;
  price: number;
  currency: string;
  isFree: boolean;
  discountPrice?: number | null;
  coverImage: string;
  previewUrl?: string | null;
  framerRemixUrl?: string | null;
  status: string;
  isFeatured: boolean;
  isTrending: boolean;
  salesCount: number;
  viewsCount: number;
  rating: number;
  reviewCount: number;
  includedPages?: string | null;
  features?: string | null;
  compatibility?: string | null;
  setupInstructions?: string | null;
  licenseType: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  category: {
    id: string;
    name: string;
    slug: string;
    icon?: string | null;
  };
  creator: {
    id: string;
    name: string;
    avatarUrl?: string | null;
    creatorProfile?: {
      id: string;
      storeName: string;
      verified: boolean;
    } | null;
  };
  images?: Array<{
    id: string;
    url: string;
    caption?: string | null;
  }>;
  files?: Array<{
    id: string;
    fileName: string;
    fileSizeBytes: number;
    version: string;
  }>;
  reviews?: Array<{
    id: string;
    rating: number;
    comment: string;
    isVerifiedPurchase: boolean;
    createdAt: Date | string;
    user: {
      name: string;
      avatarUrl?: string | null;
    };
  }>;
}

export interface CategoryWithCount {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  displayOrder: number;
  _count?: {
    products: number;
  };
}
