
import { Router } from "express";

import {
  getBusinessInsights,
} from "../controllers/ai.controller.js";

import {
  authenticate,
} from "../middleware/auth.middleware.js";

const router = Router();

// All AI routes require authentication
router.use(authenticate);

// Get AI-powered business insights
router.get(
  "/insights",
  getBusinessInsights
);

export default router;
