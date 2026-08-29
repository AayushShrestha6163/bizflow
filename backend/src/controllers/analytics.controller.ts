import type { Request, Response } from "express";

import {
  getAnalyticsSummary,
  getSalesAnalytics,
  getTopProducts,
  getCategoryAnalytics,
  getInventoryAnalytics,
} from "../services/analytics.service.js";

/**
 * Get overall analytics summary
 */
export const getSummary = async (
  _req: Request,
  res: Response
) => {
  try {
    const summary = await getAnalyticsSummary();

    return res.status(200).json({
      summary,
    });
  } catch (error) {
  console.error("Analytics summary error:", error);

  return res.status(500).json({
    message:
      error instanceof Error
        ? error.message
        : "Internal server error",
    });
  }
};

/**
 * Get sales analytics
 */
export const getSales = async (
  _req: Request,
  res: Response
) => {
  try {
    const analytics = await getSalesAnalytics();

    return res.status(200).json({
      sales: analytics,
    });
  } catch (error) {
    console.error("Sales analytics error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

/**
 * Get top-selling products
 */
export const getTopSellingProducts = async (
  _req: Request,
  res: Response
) => {
  try {
    const products = await getTopProducts();

    return res.status(200).json({
      products,
    });
  } catch (error) {
    console.error("Top products analytics error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

/**
 * Get category analytics
 */
export const getCategories = async (
  _req: Request,
  res: Response
) => {
  try {
    const categories = await getCategoryAnalytics();

    return res.status(200).json({
      categories,
    });
  } catch (error) {
    console.error("Category analytics error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

/**
 * Get inventory analytics
 */
export const getInventory = async (
  _req: Request,
  res: Response
) => {
  try {
    const inventory = await getInventoryAnalytics();

    return res.status(200).json({
      inventory,
    });
  } catch (error) {
    console.error("Inventory analytics error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};