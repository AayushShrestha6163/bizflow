import { randomUUID } from "node:crypto";
import prisma from "../config/prisma.js";

interface SaleItemInput {
  productId: number;
  quantity: number;
}

interface CreateSaleData {
  userId: number;
  items: SaleItemInput[];
}

const generateInvoiceNumber = () => {
  return `INV-${Date.now()}-${randomUUID().slice(0, 8).toUpperCase()}`;
};

export const createSale = async (data: CreateSaleData) => {
  if (data.items.length === 0) {
    throw new Error("Sale must contain at least one product");
  }

  return prisma.$transaction(async (tx) => {
    let totalAmount = 0;

    const saleItems: {
      productId: number;
      quantity: number;
      unitPrice: number;
      subtotal: number;
    }[] = [];

    for (const item of data.items) {
      const product = await tx.product.findUnique({
        where: {
          id: item.productId,
        },
      });

      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }

      if (!product.isActive) {
        throw new Error(`Product "${product.name}" is inactive`);
      }

      if (product.stock < item.quantity) {
        throw new Error(
          `Insufficient stock for "${product.name}". Available: ${product.stock}`
        );
      }

      const unitPrice = Number(product.price);
      const subtotal = unitPrice * item.quantity;

      totalAmount += subtotal;

      saleItems.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice,
        subtotal,
      });
    }

    const sale = await tx.sale.create({
      data: {
        invoiceNo: generateInvoiceNumber(),
        totalAmount,
        userId: data.userId,
        items: {
          create: saleItems,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    for (const item of saleItems) {
      const stockUpdate = await tx.product.updateMany({
        where: {
          id: item.productId,
          stock: {
            gte: item.quantity,
          },
        },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });

      if (stockUpdate.count !== 1) {
        throw new Error(
          `Stock changed while processing product ${item.productId}. Please try again.`
        );
      }

      await tx.inventoryTransaction.create({
        data: {
          type: "SALE",
          quantity: -item.quantity,
          note: `Sale ${sale.invoiceNo}`,
          productId: item.productId,
        },
      });
    }

    return sale;
  });
};

export const getSales = async () => {
  return prisma.sale.findMany({
    include: {
      items: {
        include: {
          product: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getSaleById = async (id: number) => {
  return prisma.sale.findUnique({
    where: {
      id,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
};

export const cancelSale = async (id: number) => {
  return prisma.$transaction(async (tx) => {
    const sale = await tx.sale.findUnique({
      where: {
        id,
      },
        include: {
        items: true,
      },
    });

    if (!sale) {
      throw new Error("Sale not found");
    }

    if (sale.status === "CANCELLED") {
      throw new Error("Sale is already cancelled");
    }

    if (sale.status !== "COMPLETED") {
      throw new Error(
        `Cannot cancel a sale with status ${sale.status}`
      );
    }

    const updatedSale = await tx.sale.update({
      where: {
        id,
      },
      data: {
        status: "CANCELLED",
      },
    });

    for (const item of sale.items) {
      await tx.product.update({
        where: {
          id: item.productId,
        },
        data: {
          stock: {
            increment: item.quantity,
          },
        },
      });

      await tx.inventoryTransaction.create({
        data: {
          type: "RETURN",
          quantity: item.quantity,
          note: `Cancelled sale ${sale.invoiceNo}`,
          productId: item.productId,
        },
      });
    }

    return updatedSale;
  });
};