import { Router } from "express";

import {
  getSummary,
  getSales,
  getTopSellingProducts,
  getCategories,
  getInventory,
} from "../controllers/analytics.controller.js";

import {
  authenticate,
  authorize,
} from "../middleware/auth.middleware.js";

const router = Router();

// All analytics routes require authentication
router.use(authenticate);

// Analytics can be viewed by ADMIN and MANAGER
router.use(authorize("ADMIN", "MANAGER"));

// Overall business summary
router.get("/summary", getSummary);

// Sales analytics
router.get("/sales", getSales);

// Top-selling products
router.get("/top-products", getTopSellingProducts);

// Category analytics
router.get("/categories", getCategories);

// Inventory analytics
router.get("/inventory", getInventory);

export default router;