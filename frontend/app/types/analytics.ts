export interface AnalyticsSummary {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  totalProducts: number;
  totalStock: number;
  inventoryValue: number;
  lowStockProducts: number;
}

export interface SalesAnalytics {
  totalSales: number;
  totalRevenue: number;
  sales: Array<{
    date: string;
    sales: number;
    revenue: number;
  }>;
}

export interface TopProduct {
  id: number;
  name: string;
  sku: string;
  quantitySold: number;
  revenue: number;
}

export interface CategoryAnalytics {
  id: number;
  name: string;
  quantitySold: number;
  revenue: number;
}