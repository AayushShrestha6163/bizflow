
import prisma from "../config/prisma.js";

/**
 * Generate business intelligence from current BizFlow data.
 *
 * This version is deterministic and rule-based.
 * It does not require an external AI provider.
 */
export const generateBusinessInsights = async () => {
  const [sales, products, saleItems, inventoryTransactions] =
    await Promise.all([
      // --------------------------------------------------
      // COMPLETED SALES
      // --------------------------------------------------
      prisma.sale.findMany({
        where: {
          status: "COMPLETED",
        },
        select: {
          id: true,
          invoiceNo: true,
          totalAmount: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      }),

      // --------------------------------------------------
      // ACTIVE PRODUCTS
      // --------------------------------------------------
      prisma.product.findMany({
        where: {
          isActive: true,
        },
        select: {
          id: true,
          name: true,
          sku: true,
          price: true,
          costPrice: true,
          stock: true,
          minStock: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),

      // --------------------------------------------------
      // COMPLETED SALE ITEMS
      // --------------------------------------------------
      prisma.saleItem.findMany({
        where: {
          sale: {
            status: "COMPLETED",
          },
        },
        select: {
          quantity: true,
          unitPrice: true,
          subtotal: true,
          sale: {
            select: {
              createdAt: true,
            },
          },
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
              costPrice: true,
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      }),

      // --------------------------------------------------
      // INVENTORY TRANSACTIONS
      // --------------------------------------------------
      prisma.inventoryTransaction.findMany({
        select: {
          id: true,
          type: true,
          quantity: true,
          note: true,
          createdAt: true,
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

  // ======================================================
  // OVERVIEW
  // ======================================================

  const totalRevenue = sales.reduce(
    (sum, sale) =>
      sum + Number(sale.totalAmount),
    0
  );

  const totalOrders = sales.length;

  const averageOrderValue =
    totalOrders > 0
      ? totalRevenue / totalOrders
      : 0;

  // ======================================================
  // PRODUCT SALES ANALYSIS
  // ======================================================

  const productSalesMap = new Map<
    number,
    {
      id: number;
      name: string;
      sku: string;
      quantitySold: number;
      revenue: number;
      estimatedProfit: number;
    }
  >();

  for (const item of saleItems) {
    const productId = item.product.id;

    const quantitySold = item.quantity;
    const revenue = Number(item.subtotal);

    const estimatedProfit =
      revenue -
      quantitySold *
        Number(item.product.costPrice);

    const existing =
      productSalesMap.get(productId);

    if (existing) {
      existing.quantitySold +=
        quantitySold;

      existing.revenue += revenue;

      existing.estimatedProfit +=
        estimatedProfit;
    } else {
      productSalesMap.set(productId, {
        id: item.product.id,
        name: item.product.name,
        sku: item.product.sku,
        quantitySold,
        revenue,
        estimatedProfit,
      });
    }
  }

  const productPerformance =
    Array.from(
      productSalesMap.values()
    ).sort(
      (a, b) =>
        b.quantitySold -
        a.quantitySold
    );

  const bestSellingProducts =
    productPerformance
      .slice(0, 5)
      .map((product) => ({
        ...product,
        revenue: Number(
          product.revenue.toFixed(2)
        ),
        estimatedProfit: Number(
          product.estimatedProfit.toFixed(2)
        ),
      }));

  // ======================================================
  // PROFIT ANALYSIS
  // ======================================================

  const estimatedProfit =
    productPerformance.reduce(
      (sum, product) =>
        sum +
        product.estimatedProfit,
      0
    );

  const profitMargin =
    totalRevenue > 0
      ? (estimatedProfit /
          totalRevenue) *
        100
      : 0;

  // ======================================================
  // CATEGORY PERFORMANCE
  // ======================================================

  const categoryMap = new Map<
    number,
    {
      id: number;
      name: string;
      quantitySold: number;
      revenue: number;
      estimatedProfit: number;
    }
  >();

  for (const item of saleItems) {
    const category =
      item.product.category;

    const categoryId =
      category.id;

    const quantitySold =
      item.quantity;

    const revenue =
      Number(item.subtotal);

    const estimatedProfit =
      revenue -
      quantitySold *
        Number(item.product.costPrice);

    const existing =
      categoryMap.get(categoryId);

    if (existing) {
      existing.quantitySold +=
        quantitySold;

      existing.revenue +=
        revenue;

      existing.estimatedProfit +=
        estimatedProfit;
    } else {
      categoryMap.set(categoryId, {
        id: category.id,
        name: category.name,
        quantitySold,
        revenue,
        estimatedProfit,
      });
    }
  }

  const categoryPerformance =
    Array.from(
      categoryMap.values()
    )
      .sort(
        (a, b) =>
          b.revenue - a.revenue
      )
      .map((category) => ({
        id: category.id,
        name: category.name,
        quantitySold:
          category.quantitySold,
        revenue: Number(
          category.revenue.toFixed(2)
        ),
        estimatedProfit: Number(
          category.estimatedProfit.toFixed(
            2
          )
        ),
      }));

  // ======================================================
  // SALES TREND
  // ======================================================

  const salesTrendMap = new Map<
    string,
    {
      orders: number;
      revenue: number;
    }
  >();

  for (const sale of sales) {
    const date =
      formatDate(sale.createdAt);

    const existing =
      salesTrendMap.get(date);

    if (existing) {
      existing.orders += 1;

      existing.revenue +=
        Number(sale.totalAmount);
    } else {
      salesTrendMap.set(date, {
        orders: 1,
        revenue:
          Number(sale.totalAmount),
      });
    }
  }

  const salesTrend =
    Array.from(
      salesTrendMap.entries()
    ).map(
      ([date, data]) => ({
        date,
        orders: data.orders,
        revenue: Number(
          data.revenue.toFixed(2)
        ),
      })
    );

  // ======================================================
  // INVENTORY ANALYSIS
  // ======================================================

  const lowStockProducts =
    products.filter(
      (product) =>
        product.stock <=
        product.minStock
    );

  // ======================================================
  // STOCK-OUT RISK
  // ======================================================

  const daysSinceSalesStart =
    getDaysSinceSalesStart(sales);

  const stockRiskProducts =
    products
      .filter((product) => {
        const performance =
          productSalesMap.get(
            product.id
          );

        if (!performance) {
          return false;
        }

        const averageDailySales =
          performance.quantitySold /
          Math.max(
            daysSinceSalesStart,
            1
          );

        const estimatedDaysRemaining =
          averageDailySales > 0
            ? product.stock /
              averageDailySales
            : Infinity;

        return (
          estimatedDaysRemaining <=
            7 &&
          product.stock >
            product.minStock
        );
      })
      .map((product) => {
        const performance =
          productSalesMap.get(
            product.id
          );

        const averageDailySales =
          performance
            ? performance.quantitySold /
              Math.max(
                daysSinceSalesStart,
                1
              )
            : 0;

        const estimatedDaysRemaining =
          averageDailySales > 0
            ? product.stock /
              averageDailySales
            : Infinity;

        return {
          id: product.id,
          name: product.name,
          sku: product.sku,
          currentStock:
            product.stock,
          averageDailySales:
            Number(
              averageDailySales.toFixed(
                2
              )
            ),
          estimatedDaysRemaining:
            Number(
              estimatedDaysRemaining.toFixed(
                1
              )
            ),
        };
      });

  // ======================================================
  // INVENTORY MOVEMENT
  // ======================================================

  const inventoryMovement = {
    purchases: 0,
    sales: 0,
    returns: 0,
    adjustments: 0,
  };

  for (const transaction of inventoryTransactions) {
    const quantity =
      transaction.quantity;

    switch (transaction.type) {
      case "PURCHASE":
        inventoryMovement.purchases +=
          quantity;
        break;

      case "SALE":
        inventoryMovement.sales +=
          Math.abs(quantity);
        break;

      case "RETURN":
        inventoryMovement.returns +=
          quantity;
        break;

      case "ADJUSTMENT":
        inventoryMovement.adjustments +=
          quantity;
        break;
    }
  }

  // ======================================================
  // RECOMMENDATIONS
  // ======================================================

  const recommendations: string[] =
    [];

  // Low stock recommendation
  if (lowStockProducts.length > 0) {
    recommendations.push(
      `${lowStockProducts.length} product(s) are at or below their minimum stock level. Consider restocking them.`
    );
  }

  // Stock risk recommendation
  if (
    stockRiskProducts.length > 0
  ) {
    recommendations.push(
      `${stockRiskProducts.length} product(s) may run out of stock within approximately 7 days based on current sales activity.`
    );
  }

  // Best-selling product
  const bestProduct =
    productPerformance[0];

  if (bestProduct) {
    recommendations.push(
      `${bestProduct.name} is currently your best-selling product with ${bestProduct.quantitySold} unit(s) sold.`
    );
  }

  // Best category
  const bestCategory =
    categoryPerformance[0];

  if (bestCategory) {
    recommendations.push(
      `${bestCategory.name} is currently the highest-revenue category with Rs. ${bestCategory.revenue.toFixed(2)} in sales.`
    );
  }

  // No sales
  if (totalOrders === 0) {
    recommendations.push(
      "There are no completed sales yet, so sales-based recommendations are limited."
    );
  }

  // Average order value
  if (
    totalOrders > 0 &&
    averageOrderValue > 0
  ) {
    recommendations.push(
      `Your current average order value is Rs. ${averageOrderValue.toFixed(2)}.`
    );
  }

  // Profit recommendation
  if (
    totalRevenue > 0 &&
    profitMargin < 10
  ) {
    recommendations.push(
      `Your estimated profit margin is ${profitMargin.toFixed(2)}%. Consider reviewing product pricing and costs.`
    );
  }

  // Healthy stock message
  if (
    lowStockProducts.length === 0 &&
    stockRiskProducts.length === 0 &&
    products.length > 0
  ) {
    recommendations.push(
      "Current inventory levels appear healthy based on minimum-stock settings and recent sales activity."
    );
  }

  // ======================================================
  // RETURN BUSINESS INTELLIGENCE
  // ======================================================

  return {
    overview: {
      totalOrders,

      totalRevenue:
        Number(
          totalRevenue.toFixed(2)
        ),

      averageOrderValue:
        Number(
          averageOrderValue.toFixed(2)
        ),

      estimatedProfit:
        Number(
          estimatedProfit.toFixed(2)
        ),

      profitMargin:
        Number(
          profitMargin.toFixed(2)
        ),
    },

    salesInsights: {
      bestSellingProducts,

      totalProductsSold:
        productPerformance.length,

      salesTrend,
    },

    categoryInsights: {
      categories:
        categoryPerformance,
    },

    inventoryInsights: {
      lowStockCount:
        lowStockProducts.length,

      lowStockProducts:
        lowStockProducts.map(
          (product) => ({
            id: product.id,
            name: product.name,
            sku: product.sku,
            currentStock:
              product.stock,
            minimumStock:
              product.minStock,
          })
        ),

      stockRiskProducts,

      inventoryMovement,
    },

    recommendations,
  };
};

/**
 * Calculate the number of days covered by sales data.
 */
const getDaysSinceSalesStart = (
  sales: { createdAt: Date }[]
): number => {
  if (sales.length === 0) {
    return 1;
  }

  const firstSale = sales[0];

  if (!firstSale) {
    return 1;
  }

  const oldestSale =
    sales.reduce(
      (oldest, sale) =>
        sale.createdAt <
        oldest
          ? sale.createdAt
          : oldest,
      firstSale.createdAt
    );

  const now = new Date();

  const difference =
    now.getTime() -
    oldestSale.getTime();

  const days =
    difference /
    (1000 * 60 * 60 * 24);

  return Math.max(days, 1);
};

/**
 * Convert Date to YYYY-MM-DD.
 */
const formatDate = (
  date: Date
): string => {
  return date
    .toISOString()
    .split("T")[0] ?? "";
};
