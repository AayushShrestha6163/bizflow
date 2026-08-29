import { Router } from "express";
import {
  create,
  getAll,
  getById,
  cancel,
} from "../controllers/sale.controller.js";
import {
  authenticate,
  authorize,
} from "../middleware/auth.middleware.js";

const router = Router();

// All sales routes require authentication
router.use(authenticate);

// View sales — ADMIN, MANAGER, STAFF
router.get("/", getAll);
router.get("/:id", getById);

// Create sale — all authenticated staff can make sales
router.post("/", authorize("ADMIN", "MANAGER", "STAFF"), create);

// Cancel sale — ADMIN and MANAGER only
router.patch(
  "/:id/cancel",
  authorize("ADMIN", "MANAGER"),
  cancel
);

export default router;