import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import {
  createSale,
  getSales,
  getSaleById,
  cancelSale,
} from "../services/sale.service.js";

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

export const create = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Sale must contain at least one product",
      });
    }

    const validatedItems = items.map((item: unknown) => {
      if (
        typeof item !== "object" ||
        item === null ||
        !("productId" in item) ||
        !("quantity" in item)
      ) {
        throw new Error("Each sale item must contain productId and quantity");
      }

      const saleItem = item as {
        productId: unknown;
        quantity: unknown;
      };

      if (
        typeof saleItem.productId !== "number" ||
        !Number.isInteger(saleItem.productId) ||
        saleItem.productId <= 0
      ) {
        throw new Error("Product ID must be a positive integer");
      }

      if (
        typeof saleItem.quantity !== "number" ||
        !Number.isInteger(saleItem.quantity) ||
        saleItem.quantity <= 0
      ) {
        throw new Error("Quantity must be a positive integer");
      }

      return {
        productId: saleItem.productId,
        quantity: saleItem.quantity,
      };
    });

    const sale = await createSale({
      userId: user.userId,
      items: validatedItems,
    });

    return res.status(201).json({
      message: "Sale created successfully",
      sale,
    });
  } catch (error) {
    if (!(error instanceof Error)) {
      return res.status(500).json({
        message: "Internal server error",
      });
    }

    const validationErrors = [
      "Sale must contain at least one product",
      "Each sale item must contain productId and quantity",
      "Product ID must be a positive integer",
      "Quantity must be a positive integer",
    ];

    if (validationErrors.includes(error.message)) {
      return res.status(400).json({
        message: error.message,
      });
    }

    if (
      error.message.includes("not found") ||
      error.message.includes("inactive")
    ) {
      return res.status(404).json({
        message: error.message,
      });
    }

    if (
      error.message.includes("Insufficient stock") ||
      error.message.includes("Stock changed")
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
    const sales = await getSales();

    return res.status(200).json({
      sales,
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
        message: "Invalid sale ID",
      });
    }

    const sale = await getSaleById(id);

    if (!sale) {
      return res.status(404).json({
        message: "Sale not found",
      });
    }

    return res.status(200).json({
      sale,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const cancel = async (req: Request, res: Response) => {
  try {
    const id = parseId(req.params.id);

    if (!id) {
      return res.status(400).json({
        message: "Invalid sale ID",
      });
    }

    const sale = await cancelSale(id);

    return res.status(200).json({
      message: "Sale cancelled successfully",
      sale,
    });
  } catch (error) {
    if (!(error instanceof Error)) {
      return res.status(500).json({
        message: "Internal server error",
      });
    }

    if (
      error.message === "Sale not found"
    ) {
      return res.status(404).json({
        message: error.message,
      });
    }

    if (
      error.message === "Sale is already cancelled" ||
      error.message.includes("Cannot cancel")
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