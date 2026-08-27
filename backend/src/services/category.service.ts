import prisma from "../config/prisma.js";

export const createCategory = async (name: string) => {
  const existingCategory = await prisma.category.findUnique({
    where: { name },
  });

  if (existingCategory) {
    throw new Error("Category already exists");
  }

  return prisma.category.create({
    data: {
      name,
    },
  });
};

export const getCategories = async () => {
  return prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
};

export const getCategoryById = async (id: number) => {
  return prisma.category.findUnique({
    where: { id },
  });
};

export const updateCategory = async (id: number, name: string) => {
  const existingCategory = await prisma.category.findUnique({
    where: { id },
  });

  if (!existingCategory) {
    throw new Error("Category not found");
  }

  const duplicateCategory = await prisma.category.findFirst({
    where: {
      name,
      NOT: {
        id,
      },
    },
  });

  if (duplicateCategory) {
    throw new Error("Category already exists");
  }

  return prisma.category.update({
    where: { id },
    data: {
      name,
    },
  });
};

export const deleteCategory = async (id: number) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      products: true,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  if (category.products.length > 0) {
    throw new Error(
      "Cannot delete a category that contains products"
    );
  }

  return prisma.category.delete({
    where: { id },
  });
};