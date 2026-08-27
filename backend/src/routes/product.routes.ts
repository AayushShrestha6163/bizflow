import { Router } from "express";
import {
  create,
  getAll,
  getById,
  update,
  remove,
} from "../controllers/product.controller.js";
import {
  authenticate,
  authorize,
} from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);

// Any logged-in user can view products
router.get("/", getAll);
router.get("/:id", getById);

// Only ADMIN and MANAGER can create/update products
router.post(
  "/",
  authorize("ADMIN", "MANAGER"),
  create
);

router.put(
  "/:id",
  authorize("ADMIN", "MANAGER"),
  update
);

// Only ADMIN can delete products
router.delete(
  "/:id",
  authorize("ADMIN"),
  remove
);

export default router;