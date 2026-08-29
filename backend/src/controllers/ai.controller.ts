
import type { Request, Response } from "express";
import { generateBusinessInsights } from "../services/ai.service.js";

/**
 * Get AI-powered business insights.
 */
export const getBusinessInsights = async (
  _req: Request,
  res: Response
) => {
  try {
    const insights = await generateBusinessInsights();

    return res.status(200).json({
      success: true,
      insights,
    });
  } catch (error) {
    console.error(
      "AI business insights error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to generate business insights",
    });
  }
};

