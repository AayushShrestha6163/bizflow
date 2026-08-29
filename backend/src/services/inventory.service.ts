import prisma from "../config/prisma.js";

interface StockChangeData {
  productId: number;
  quantity: number;
  note?: string;
}

export const addStock = async (data: StockChangeData) => {
  if (data.quantity <= 0) {
    throw new Error("Quantity must be greater than zero");
  }

  return prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({
      where: {
        id: data.productId,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    if (!product.isActive) {
      throw new Error(`Product "${product.name}" is inactive`);
    }

    const updatedProduct = await tx.product.update({
      where: {
        id: data.productId,
      },
      data: {
        stock: {
          increment: data.quantity,
        },
      },
    });

    const transaction = await tx.inventoryTransaction.create({
      data: {
        type: "PURCHASE",
        quantity: data.quantity,
        note: data.note ?? `Stock added for ${product.name}`,
        productId: data.productId,
      },
    });

    return {
      product: updatedProduct,
      transaction,
    };
  });
};

export const adjustStock = async (data: StockChangeData) => {
  if (data.quantity === 0) {
    throw new Error("Adjustment quantity cannot be zero");
  }

  return prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({
      where: {
        id: data.productId,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    const newStock = product.stock + data.quantity;

    if (newStock < 0) {
      throw new Error(
        `Stock cannot be negative. Current stock: ${product.stock}`
      );
    }

    const updatedProduct = await tx.product.update({
      where: {
        id: data.productId,
      },
      data: {
        stock: newStock,
      },
    });

    const transaction = await tx.inventoryTransaction.create({
      data: {
        type: "ADJUSTMENT",
        quantity: data.quantity,
        note: data.note ?? `Stock adjustment for ${product.name}`,
        productId: data.productId,
      },
    });

    return {
      product: updatedProduct,
      transaction,
    };
  });
};

export const getInventoryTransactions = async () => {
  return prisma.inventoryTransaction.findMany({
    include: {
      product: {
        select: {
          id: true,
          name: true,
          sku: true,
          stock: true,
          minStock: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getProductInventoryHistory = async (
  productId: number
) => {
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    select: {
      id: true,
      name: true,
      sku: true,
      stock: true,
      minStock: true,
      isActive: true,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  const transactions = await prisma.inventoryTransaction.findMany({
    where: {
      productId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    product,
    transactions,
  };
};

export const getLowStockProducts = async () => {
  return prisma.product.findMany({
    where: {
      isActive: true,
      stock: {
        lte: prisma.product.fields.minStock,
      },
    },
    include: {
      category: true,
    },
    orderBy: {
      stock: "asc",
    },
  });
};