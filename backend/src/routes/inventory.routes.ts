import { Router } from "express";
import {
  add,
  adjust,
  getTransactions,
  getHistory,
  getLowStock,
} from "../controllers/inventory.controller.js";
import {
  authenticate,
  authorize,
} from "../middleware/auth.middleware.js";

const router = Router();

// All inventory routes require authentication
router.use(authenticate);

// Inventory history and low-stock information
router.get("/transactions", getTransactions);
router.get("/history/:productId", getHistory);
router.get("/low-stock", getLowStock);

// Add stock — ADMIN and MANAGER
router.post(
  "/add",
  authorize("ADMIN", "MANAGER"),
  add
);

// Manual stock adjustment — ADMIN and MANAGER
router.post(
  "/adjust",
  authorize("ADMIN", "MANAGER"),
  adjust
);

export default router;