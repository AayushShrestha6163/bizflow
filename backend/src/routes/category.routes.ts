import { Router } from "express";
import {
  create,
  getAll,
  getById,
  update,
  remove,
} from "../controllers/category.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.post("/", authorize("ADMIN", "MANAGER"), create);
router.get("/", getAll);
router.get("/:id", getById);
router.put("/:id", authorize("ADMIN", "MANAGER"), update);
router.delete("/:id", authorize("ADMIN"), remove);

export default router;