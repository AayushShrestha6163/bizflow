import type { Request, Response } from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../services/category.service.js";

export const create = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        message: "Category name is required",
      });
    }

    const category = await createCategory(name.trim());

    return res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Category already exists"
    ) {
      return res.status(409).json({
        message: error.message,
      });
    }

    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getAll = async (_req: Request, res: Response) => {
  try {
    const categories = await getCategories();

    return res.status(200).json({
      categories,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "Invalid category ID",
      });
    }

    const category = await getCategoryById(id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    return res.status(200).json({
      category,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "Invalid category ID",
      });
    }

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        message: "Category name is required",
      });
    }

    const category = await updateCategory(id, name.trim());

    return res.status(200).json({
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Category not found"
    ) {
      return res.status(404).json({
        message: error.message,
      });
    }

    if (
      error instanceof Error &&
      error.message === "Category already exists"
    ) {
      return res.status(409).json({
        message: error.message,
      });
    }

    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "Invalid category ID",
      });
    }

    await deleteCategory(id);

    return res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Category not found"
    ) {
      return res.status(404).json({
        message: error.message,
      });
    }

    if (
      error instanceof Error &&
      error.message ===
        "Cannot delete a category that contains products"
    ) {
      return res.status(409).json({
        message: error.message,
      });
    }

    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};