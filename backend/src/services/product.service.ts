import prisma from "../config/prisma.js";

interface CreateProductData {
  name: string;
  sku: string;
  description?: string;
  price: number;
  costPrice: number;
  stock?: number;
  minStock?: number;
  categoryId: number;
}

export const createProduct = async (data: CreateProductData) => {
  const existingSku = await prisma.product.findUnique({
    where: { sku: data.sku },
  });

  if (existingSku) {
    throw new Error("Product with this SKU already exists");
  }

  const category = await prisma.category.findUnique({
    where: { id: data.categoryId },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  return prisma.product.create({
    data: {
      name: data.name,
      sku: data.sku,
      description: data.description ?? null,
      price: data.price,
      costPrice: data.costPrice,
      stock: data.stock ?? 0,
      minStock: data.minStock ?? 5,
      categoryId: data.categoryId,
    },
    include: {
      category: true,
    },
  });
};

export const getProducts = async () => {
  return prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getProductById = async (id: number) => {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
    },
  });
};

export const updateProduct = async (
  id: number,
  data: Partial<CreateProductData>
) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  if (data.sku && data.sku !== product.sku) {
    const existingSku = await prisma.product.findUnique({
      where: { sku: data.sku },
    });

    if (existingSku) {
      throw new Error("Product with this SKU already exists");
    }
  }

  if (data.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      throw new Error("Category not found");
    }
  }

  return prisma.product.update({
    where: { id },
    data,
    include: {
      category: true,
    },
  });
};

export const deleteProduct = async (id: number) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  return prisma.product.delete({
    where: { id },
  });
};