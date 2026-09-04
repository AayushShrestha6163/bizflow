import { api } from "../lib/api";
import type {
  Product,
  CreateProductRequest,
} from "../types/product";

interface ProductsResponse {
  products: Product[];
}

interface ProductResponse {
  product: Product;
}

export async function getProducts(
  token: string
): Promise<ProductsResponse> {
  return api<ProductsResponse>("/products", {
    method: "GET",
    token,
  });
}

export async function getProduct(
  id: number,
  token: string
): Promise<ProductResponse> {
  return api<ProductResponse>(`/products/${id}`, {
    method: "GET",
    token,
  });
}

export async function createProduct(
  data: CreateProductRequest,
  token: string
): Promise<ProductResponse> {
  return api<ProductResponse>("/products", {
    method: "POST",
    token,
    body: JSON.stringify(data),
  });
}