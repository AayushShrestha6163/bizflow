import type { Request, Response } from "express";
import {
  addStock,
  adjustStock,
  getInventoryTransactions,
  getProductInventoryHistory,
  getLowStockProducts,
} from "../services/inventory.service.js";

const getNumber = (value: unknown) => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }

  return value;
};

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

export const add = async (req: Request, res: Response) => {
  try {
    const { productId, quantity, note } = req.body;

    if (
      !Number.isInteger(productId) ||
      productId <= 0
    ) {
      return res.status(400).json({
        message: "Product ID must be a positive integer",
      });
    }

    if (
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      return res.status(400).json({
        message: "Quantity must be a positive integer",
      });
    }

    if (
      note !== undefined &&
      note !== null &&
      typeof note !== "string"
    ) {
      return res.status(400).json({
        message: "Note must be a string",
      });
    }

    const result = await addStock({
      productId,
      quantity,
      ...(typeof note === "string" && note.trim()
        ? { note: note.trim() }
        : {}),
    });

    return res.status(200).json({
      message: "Stock added successfully",
      ...result,
    });
  } catch (error) {
    if (!(error instanceof Error)) {
      return res.status(500).json({
        message: "Internal server error",
      });
    }

    if (error.message === "Product not found") {
      return res.status(404).json({
        message: error.message,
      });
    }

    if (error.message.includes("inactive")) {
      return res.status(409).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const adjust = async (req: Request, res: Response) => {
  try {
    const { productId, quantity, note } = req.body;

    if (
      !Number.isInteger(productId) ||
      productId <= 0
    ) {
      return res.status(400).json({
        message: "Product ID must be a positive integer",
      });
    }

    const validQuantity = getNumber(quantity);

    if (
      validQuantity === null ||
      !Number.isInteger(validQuantity) ||
      validQuantity === 0
    ) {
      return res.status(400).json({
        message: "Adjustment quantity must be a non-zero integer",
      });
    }

    if (
      note !== undefined &&
      note !== null &&
      typeof note !== "string"
    ) {
      return res.status(400).json({
        message: "Note must be a string",
      });
    }

    const result = await adjustStock({
      productId,
      quantity: validQuantity,
      ...(typeof note === "string" && note.trim()
        ? { note: note.trim() }
        : {}),
    });

    return res.status(200).json({
      message: "Stock adjusted successfully",
      ...result,
    });
  } catch (error) {
    if (!(error instanceof Error)) {
      return res.status(500).json({
        message: "Internal server error",
      });
    }

    if (error.message === "Product not found") {
      return res.status(404).json({
        message: error.message,
      });
    }

    if (error.message.includes("Stock cannot be negative")) {
      return res.status(409).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getTransactions = async (
  _req: Request,
  res: Response
) => {
  try {
    const transactions = await getInventoryTransactions();

    return res.status(200).json({
      transactions,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getHistory = async (
  req: Request,
  res: Response
) => {
  try {
    const productId = parseId(req.params.productId);

    if (!productId) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const history = await getProductInventoryHistory(productId);

    return res.status(200).json(history);
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

export const getLowStock = async (
  _req: Request,
  res: Response
) => {
  try {
    const products = await getLowStockProducts();

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