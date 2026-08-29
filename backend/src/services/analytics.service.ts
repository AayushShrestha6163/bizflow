import prisma from "../config/prisma.js";

/**
 * Get overall business analytics summary
 */
export const getAnalyticsSummary = async () => {
  const [sales, products] = await Promise.all([
    prisma.sale.findMany({
      where: {
        status: {
          not: "CANCELLED",
        },
      },
      select: {
        id: true,
        totalAmount: true,
      },
    }),

    prisma.product.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        stock: true,
        price: true,
        minStock: true,
      },
    }),
  ]);

  const totalOrders = sales.length;

  const totalRevenue = sales.reduce(
    (sum, sale) => sum + Number(sale.totalAmount),
    0
  );

  const averageOrderValue =
    totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const totalProducts = products.length;

  const totalStock = products.reduce(
    (sum, product) => sum + product.stock,
    0
  );

  const inventoryValue = products.reduce(
    (sum, product) =>
      sum + product.stock * Number(product.price),
    0
  );

  const lowStockProducts = products.filter(
    (product) => product.stock <= product.minStock
  ).length;

  return {
    totalOrders,
    totalRevenue,
    averageOrderValue,
    totalProducts,
    totalStock,
    inventoryValue,
    lowStockProducts,
  };
};

/**
 * Get sales analytics
 */
export const getSalesAnalytics = async () => {
  const sales = await prisma.sale.findMany({
    where: {
      status: {
        not: "CANCELLED",
      },
    },
    select: {
      id: true,
      invoiceNo: true,
      totalAmount: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalSales = sales.length;

  const totalRevenue = sales.reduce(
    (sum, sale) => sum + Number(sale.totalAmount),
    0
  );

  return {
    totalSales,
    totalRevenue,
    sales,
  };
};

/**
 * Get top-selling products
 */
export const getTopProducts = async () => {
  const saleItems = await prisma.saleItem.findMany({
    where: {
      sale: {
        status: {
          not: "CANCELLED",
        },
      },
    },
    select: {
      quantity: true,
      unitPrice: true,
      product: {
        select: {
          id: true,
          name: true,
          sku: true,
        },
      },
    },
  });

  const productMap = new Map<
    number,
    {
      id: number;
      name: string;
      sku: string;
      quantitySold: number;
      revenue: number;
    }
  >();

  for (const item of saleItems) {
    const productId = item.product.id;

    const quantitySold = Number(item.quantity);
    const revenue =
      quantitySold * Number(item.unitPrice);

    const existing = productMap.get(productId);

    if (existing) {
      existing.quantitySold += quantitySold;
      existing.revenue += revenue;
    } else {
      productMap.set(productId, {
        id: item.product.id,
        name: item.product.name,
        sku: item.product.sku,
        quantitySold,
        revenue,
      });
    }
  }

  return Array.from(productMap.values()).sort(
    (a, b) => b.quantitySold - a.quantitySold
  );
};

/**
 * Get category sales analytics
 */
export const getCategoryAnalytics = async () => {
  const saleItems = await prisma.saleItem.findMany({
    where: {
      sale: {
        status: {
          not: "CANCELLED",
        },
      },
    },
    select: {
      quantity: true,
      unitPrice: true,
      product: {
        select: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  const categoryMap = new Map<
    number,
    {
      id: number;
      name: string;
      quantitySold: number;
      revenue: number;
    }
  >();

  for (const item of saleItems) {
    const category = item.product.category;

    if (!category) {
      continue;
    }

    const quantitySold = Number(item.quantity);
    const revenue =
      quantitySold * Number(item.unitPrice);

    const existing = categoryMap.get(category.id);

    if (existing) {
      existing.quantitySold += quantitySold;
      existing.revenue += revenue;
    } else {
      categoryMap.set(category.id, {
        id: category.id,
        name: category.name,
        quantitySold,
        revenue,
      });
    }
  }

  return Array.from(categoryMap.values()).sort(
    (a, b) => b.revenue - a.revenue
  );
};

/**
 * Get inventory analytics
 */
export const getInventoryAnalytics = async () => {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      sku: true,
      stock: true,
      minStock: true,
      price: true,
    },
  });

  const totalProducts = products.length;

  const totalStock = products.reduce(
    (sum, product) => sum + product.stock,
    0
  );

  const inventoryValue = products.reduce(
    (sum, product) =>
      sum + product.stock * Number(product.price),
    0
  );

  const lowStockProducts = products.filter(
    (product) => product.stock <= product.minStock
  );

  return {
    totalProducts,
    totalStock,
    inventoryValue,
    lowStockCount: lowStockProducts.length,
    lowStockProducts,
  };
};