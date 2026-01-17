export type DrinkBrand = 'Coke' | 'Fanta' | 'Sprite';

export interface Product {
  id: string;
  name: DrinkBrand;
  price: number;
  description: string;
  image: string;
  category: 'soft-drink';
}

export interface BranchInventory {
  branchId: string;
  productId: string;
  quantity: number;
  lastRestocked: string;
}

export interface ProductWithStock extends Product {
  stockLevel: number;
  available: boolean;
}