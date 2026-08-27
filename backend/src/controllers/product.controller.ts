import type { Request, Response } from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../services/product.service.js";

const parseId = (value: string | string[] | undefined) => {
  if (typeof value !== "string") {
    return null;
  }

  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
};

export const create = async (req: Request, res: Response) => {
  try {
    const {
      name,
      sku,
      description,
      price,
      costPrice,
      stock,
      minStock,
      categoryId,
    } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        message: "Product name is required",
      });
    }

    if (!sku || typeof sku !== "string" || !sku.trim()) {
      return res.status(400).json({
        message: "SKU is required",
      });
    }

    if (typeof price !== "number" || price < 0) {
      return res.status(400).json({
        message: "Valid price is required",
      });
    }

    if (typeof costPrice !== "number" || costPrice < 0) {
      return res.status(400).json({
        message: "Valid cost price is required",
      });
    }

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      return res.status(400).json({
        message: "Valid category ID is required",
      });
    }

    if (
      stock !== undefined &&
      (!Number.isInteger(stock) || stock < 0)
    ) {
      return res.status(400).json({
        message: "Stock must be a non-negative integer",
      });
    }

    if (
      minStock !== undefined &&
      (!Number.isInteger(minStock) || minStock < 0)
    ) {
      return res.status(400).json({
        message: "Minimum stock must be a non-negative integer",
      });
    }

    const product = await createProduct({
  name: name.trim(),
  sku: sku.trim(),
  ...(typeof description === "string" && description.trim()
    ? { description: description.trim() }
    : {}),
  price,
  costPrice,
  stock,
  minStock,
  categoryId,
});

    return res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Product with this SKU already exists"
    ) {
      return res.status(409).json({
        message: error.message,
      });
    }

    if (
      error instanceof Error &&
      error.message === "Category not found"
    ) {
      return res.status(404).json({
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
    const products = await getProducts();

    return res.status(200).json({
      products,
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
    const id = parseId(req.params.id);

    if (!id) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const product = await getProductById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      product,
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
    const id = parseId(req.params.id);

    if (!id) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const {
      name,
      sku,
      description,
      price,
      costPrice,
      stock,
      minStock,
      categoryId,
    } = req.body;

    const data: Record<string, unknown> = {};

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
          message: "Product name must be a valid string",
        });
      }

      data.name = name.trim();
    }

    if (sku !== undefined) {
      if (typeof sku !== "string" || !sku.trim()) {
        return res.status(400).json({
          message: "SKU must be a valid string",
        });
      }

      data.sku = sku.trim();
    }

    if (description !== undefined) {
      if (description !== null && typeof description !== "string") {
        return res.status(400).json({
          message: "Description must be a string",
        });
      }

      data.description =
        description === null ? null : description.trim();
    }

    if (price !== undefined) {
      if (typeof price !== "number" || price < 0) {
        return res.status(400).json({
          message: "Price must be a non-negative number",
        });
      }

      data.price = price;
    }

    if (costPrice !== undefined) {
      if (typeof costPrice !== "number" || costPrice < 0) {
        return res.status(400).json({
          message: "Cost price must be a non-negative number",
        });
      }

      data.costPrice = costPrice;
    }

    if (stock !== undefined) {
      if (!Number.isInteger(stock) || stock < 0) {
        return res.status(400).json({
          message: "Stock must be a non-negative integer",
        });
      }

      data.stock = stock;
    }

    if (minStock !== undefined) {
      if (!Number.isInteger(minStock) || minStock < 0) {
        return res.status(400).json({
          message: "Minimum stock must be a non-negative integer",
        });
      }

      data.minStock = minStock;
    }

    if (categoryId !== undefined) {
      if (!Number.isInteger(categoryId) || categoryId <= 0) {
        return res.status(400).json({
          message: "Category ID must be a positive integer",
        });
      }

      data.categoryId = categoryId;
    }

    const product = await updateProduct(
      id,
      data as Parameters<typeof updateProduct>[1]
    );

    return res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Product not found"
    ) {
      return res.status(404).json({
        message: error.message,
      });
    }

    if (
      error instanceof Error &&
      error.message === "Product with this SKU already exists"
    ) {
      return res.status(409).json({
        message: error.message,
      });
    }

    if (
      error instanceof Error &&
      error.message === "Category not found"
    ) {
      return res.status(404).json({
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
    const id = parseId(req.params.id);

    if (!id) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    await deleteProduct(id);

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Product not found"
    ) {
      return res.status(404).json({
        message: error.message,
      });
    }

    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};