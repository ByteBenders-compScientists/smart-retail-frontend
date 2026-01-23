export type DrinkBrand = 'Coke' | 'Fanta' | 'Sprite';

/** GET /api/v1/products */
export interface ApiProduct {
  DeletedAt: string | null;
  ID: string;
  Name: string;
  Brand: string;
  Description: string;
  Price: number;
  OriginalPrice: number | null;
  Image: string;
  Rating: number;
  Reviews: number;
  Category: string;
  Volume: string;
  Unit: string;
  Tags: string;
  CreatedAt: string;
  UpdatedAt: string;
}

/** POST /api/v1/admin/products - Create product request */
export interface CreateProductRequest {
  name: string;
  brand: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  reviews?: number;
  category: string;
  volume: string;
  unit: string;
  tags?: string[]; // Client-side array; API will convert to JSON string
}

/** PUT /api/v1/admin/products/:id - Update product request */
export interface UpdateProductRequest {
  name?: string;
  brand?: string;
  description?: string;
  price?: number;
  originalPrice?: number;
  image?: string;
  rating?: number;
  reviews?: number;
  category?: string;
  volume?: string;
  unit?: string;
  tags?: string[]; // Client-side array; API will convert to JSON string
}

/** Branch information from stock response */
export interface ApiBranch {
  DeletedAt: string | null;
  ID: string;
  Name: string;
  IsHeadquarter: boolean;
  Address: string;
  Phone: string;
  Status: string;
  CreatedAt: string;
  UpdatedAt: string;
}

/** Branch stock item from GET /api/v1/admin/products/:id/stock */
export interface ApiBranchStock {
  DeletedAt: string | null;
  ID: string;
  BranchID: string;
  Branch: ApiBranch;
  ProductID: string;
  Product: ApiProduct;
  Quantity: number;
  LastRestocked: string;
  CreatedAt: string;
  UpdatedAt: string;
}

/** GET /api/v1/admin/products/:id/stock - Product stock response */
export interface ProductStockResponse {
  branch_stocks: ApiBranchStock[];
  branches: number;
  product_id: string;
  total_stock: number;
}

/** GET /api/v1/products/branch/:branchId */
export interface ApiBranchInventoryItem {
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  originalPrice: number | null;
  image: string;
  rating: number;
  reviews: number;
  stock: number;
  available: boolean;
  volume: string;
  unit: string;
  tags: string[];
}

/** Unified product shape for UI (ProductCard, etc.) */
export interface ProductDisplay {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  stock: number;
  category: string;
  volume: string;
  unit: string;
  branches: string[];
  tags?: string[];
}

export function parseTags(tags: string | string[]): string[] {
  if (Array.isArray(tags)) return tags;
  try {
    const parsed = JSON.parse(tags) as unknown;
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

export function mapApiProductToDisplay(p: ApiProduct): ProductDisplay {
  return {
    id: p.ID,
    name: p.Name,
    brand: p.Brand,
    description: p.Description,
    price: p.Price,
    originalPrice: p.OriginalPrice ?? undefined,
    image: p.Image,
    rating: p.Rating,
    reviews: p.Reviews,
    stock: 1,
    category: p.Category,
    volume: p.Volume,
    unit: p.Unit,
    branches: [],
    tags: parseTags(p.Tags),
  };
}

export function mapBranchInventoryToDisplay(
  p: ApiBranchInventoryItem,
  branchName?: string
): ProductDisplay {
  return {
    id: p.id,
    name: p.name,
    brand: p.brand,
    description: p.description,
    price: p.price,
    originalPrice: p.originalPrice ?? undefined,
    image: p.image,
    rating: p.rating,
    reviews: p.reviews,
    stock: p.stock,
    category: p.category,
    volume: p.volume,
    unit: p.unit,
    branches: branchName ? [branchName] : [],
    tags: p.tags,
  };
}
