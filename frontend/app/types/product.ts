export interface Product {
  id: number;
  name: string;
  sku: string;
  description?: string | null;
  price: number;
  costPrice: number;
  stock: number;
  minStock: number;
  isActive: boolean;
  categoryId: number;
  category?: {
    id: number;
    name: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductRequest {
  name: string;
  sku: string;
  description?: string;
  price: number;
  costPrice: number;
  stock?: number;
  minStock?: number;
  categoryId: number;
}