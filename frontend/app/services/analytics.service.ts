import { api } from "../lib/api";
import type {
  AnalyticsSummary,
  SalesAnalytics,
  TopProduct,
  CategoryAnalytics,
} from "../types/analytics";

export async function getAnalyticsSummary(
  token: string
): Promise<{ summary: AnalyticsSummary }> {
  return api<{ summary: AnalyticsSummary }>(
    "/analytics/summary",
    {
      method: "GET",
      token,
    }
  );
}

export async function getSalesAnalytics(
  token: string
): Promise<{ sales: SalesAnalytics }> {
  return api<{ sales: SalesAnalytics }>(
    "/analytics/sales",
    {
      method: "GET",
      token,
    }
  );
}

export async function getTopProducts(
  token: string
): Promise<{ products: TopProduct[] }> {
  return api<{ products: TopProduct[] }>(
    "/analytics/top-products",
    {
      method: "GET",
      token,
    }
  );
}

export async function getCategoryAnalytics(
  token: string
): Promise<{ categories: CategoryAnalytics[] }> {
  return api<{ categories: CategoryAnalytics[] }>(
    "/analytics/categories",
    {
      method: "GET",
      token,
    }
  );
}