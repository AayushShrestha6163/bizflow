import { api } from "../lib/api";

export interface AIInsights {
  overview: {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    estimatedProfit: number;
    profitMargin: number;
  };

  salesInsights: {
    bestSellingProducts: Array<{
      id: number;
      name: string;
      sku: string;
      quantitySold: number;
      revenue: number;
      estimatedProfit: number;
    }>;
    totalProductsSold: number;
    salesTrend?: unknown[];
  };

  categoryInsights?: {
    categories: unknown[];
  };

  inventoryInsights: {
    lowStockCount: number;
    lowStockProducts: Array<{
      id: number;
      name: string;
      sku: string;
      currentStock: number;
      minimumStock: number;
    }>;
    stockRiskProducts: Array<{
      id: number;
      name: string;
      sku: string;
      currentStock: number;
      averageDailySales: number;
      estimatedDaysRemaining: number;
    }>;
    inventoryMovement?: {
      purchases: number;
      sales: number;
      returns: number;
      adjustments: number;
    };
  };

  recommendations: string[];
}

export async function getAIInsights(
  token: string
): Promise<{
  success: boolean;
  insights: AIInsights;
}> {
  return api("/ai/insights", {
    method: "GET",
    token,
  });
}