"use client";

import { useEffect, useState } from "react";
import { api } from "../lib/api";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  sku: string;
  description?: string | null;
  price: number;
  costPrice: number;
  stock: number;
  minStock: number;
  category?: {
    id: number;
    name: string;
  } | null;
}

interface ProductsResponse {
  products: Product[];
}

interface CategoriesResponse {
  categories: Category[];
}

interface ProductResponse {
  product: Product;
}

interface ProductForm {
  name: string;
  sku: string;
  description: string;
  price: string;
  costPrice: string;
  stock: string;
  minStock: string;
  categoryId: string;
}

const emptyForm: ProductForm = {
  name: "",
  sku: "",
  description: "",
  price: "",
  costPrice: "",
  stock: "",
  minStock: "5",
  categoryId: "",
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const [editingProductId, setEditingProductId] =
    useState<number | null>(null);

  const [form, setForm] = useState<ProductForm>(emptyForm);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [productsData, categoriesData] = await Promise.all([
        api<ProductsResponse>("/products"),
        api<CategoriesResponse>("/categories"),
      ]);

      setProducts(productsData.products || []);
      setCategories(categoriesData.categories || []);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      return "Product name is required";
    }

    if (!form.sku.trim()) {
      return "SKU is required";
    }

    if (!form.price || Number(form.price) < 0) {
      return "Enter a valid selling price";
    }

    if (!form.costPrice || Number(form.costPrice) < 0) {
      return "Enter a valid cost price";
    }

    if (!form.categoryId) {
      return "Please select a category";
    }

    if (
      form.stock &&
      (!Number.isInteger(Number(form.stock)) ||
        Number(form.stock) < 0)
    ) {
      return "Stock must be a non-negative integer";
    }

    if (
      form.minStock &&
      (!Number.isInteger(Number(form.minStock)) ||
        Number(form.minStock) < 0)
    ) {
      return "Minimum stock must be a non-negative integer";
    }

    return "";
  };

  const buildProductBody = () => ({
    name: form.name.trim(),
    sku: form.sku.trim(),
    description: form.description.trim() || null,
    price: Number(form.price),
    costPrice: Number(form.costPrice),
    stock: form.stock ? Number(form.stock) : 0,
    minStock: form.minStock ? Number(form.minStock) : 5,
    categoryId: Number(form.categoryId),
  });

  const handleAddProduct = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSubmitting(true);

      await api("/products", {
        method: "POST",
        body: JSON.stringify(buildProductBody()),
      });

      setSuccess("Product created successfully!");

      setForm(emptyForm);
      setShowAddForm(false);

      await loadData();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to create product"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const openEditForm = async (productId: number) => {
    try {
      setError("");
      setSuccess("");
      setSubmitting(true);

      const data = await api<ProductResponse>(
        `/products/${productId}`
      );

      const product = data.product;

      setEditingProductId(product.id);

      setForm({
        name: product.name,
        sku: product.sku,
        description: product.description || "",
        price: String(product.price),
        costPrice: String(product.costPrice),
        stock: String(product.stock),
        minStock: String(product.minStock),
        categoryId: product.category?.id
          ? String(product.category.id)
          : "",
      });

      setShowEditForm(true);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load product"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateProduct = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!editingProductId) {
      return;
    }

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSubmitting(true);

      await api(`/products/${editingProductId}`, {
        method: "PUT",
        body: JSON.stringify(buildProductBody()),
      });

      setSuccess("Product updated successfully!");

      setShowEditForm(false);
      setEditingProductId(null);
      setForm(emptyForm);

      await loadData();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update product"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    const product = products.find(
      (item) => item.id === productId
    );

    if (!product) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");
      setSubmitting(true);

      await api(`/products/${productId}`, {
        method: "DELETE",
      });

      setSuccess("Product deleted successfully!");

      await loadData();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete product"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    if (submitting) {
      return;
    }

    setShowAddForm(false);
    setShowEditForm(false);
    setEditingProductId(null);
    setForm(emptyForm);
    setError("");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <Topbar />

      <main className="ml-64 pt-20">
        <div className="p-8">

          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="mb-1 text-sm font-medium text-blue-600">
                Inventory Management
              </p>

              <h1 className="text-3xl font-bold text-slate-900">
                Products
              </h1>

              <p className="mt-1 text-slate-500">
                Manage your products and inventory
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setForm(emptyForm);
                setError("");
                setSuccess("");
                setShowAddForm(true);
              }}
              className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white shadow-sm transition hover:bg-blue-500"
            >
              + Add Product
            </button>
          </div>

          {/* Success */}
          {success && (
            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
              {success}
            </div>
          )}

          {/* Error */}
          {error &&
            !showAddForm &&
            !showEditForm && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

          {/* Summary Cards */}
          {!loading && (
            <div className="mb-6 grid gap-4 md:grid-cols-3">

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">
                  Total Products
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {products.length}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">
                  Total Stock
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {products.reduce(
                    (total, product) =>
                      total + product.stock,
                    0
                  )}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">
                  Low Stock
                </p>

                <p className="mt-2 text-2xl font-bold text-red-600">
                  {
                    products.filter(
                      (product) =>
                        product.stock <=
                        product.minStock
                    ).length
                  }
                </p>
              </div>

            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <p className="text-slate-500">
                Loading products...
              </p>
            </div>
          )}

          {/* Product Table */}
          {!loading && (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-200 px-6 py-5">
                <h2 className="font-semibold text-slate-900">
                  Product List
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  View and manage all your products
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">

                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Product
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        SKU
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Category
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Price
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Stock
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {products.map((product) => {
                      const isLowStock =
                        product.stock <=
                        product.minStock;

                      return (
                        <tr
                          key={product.id}
                          className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                        >

                          <td className="px-6 py-5">
                            <div>
                              <p className="font-semibold text-slate-900">
                                {product.name}
                              </p>

                              {product.description && (
                                <p className="mt-1 max-w-xs truncate text-xs text-slate-400">
                                  {product.description}
                                </p>
                              )}
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600">
                              {product.sku}
                            </span>
                          </td>

                          <td className="px-6 py-5 text-sm text-slate-600">
                            {product.category?.name ||
                              "Uncategorized"}
                          </td>

                          <td className="px-6 py-5">
                            <span className="font-semibold text-slate-900">
                              Rs.{" "}
                              {product.price.toLocaleString()}
                            </span>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2">

                              <span
                                className={
                                  isLowStock
                                    ? "font-bold text-red-600"
                                    : "font-semibold text-green-600"
                                }
                              >
                                {product.stock}
                              </span>

                              {isLowStock && (
                                <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-600">
                                  Low stock
                                </span>
                              )}

                            </div>

                            <p className="mt-1 text-xs text-slate-400">
                              Min: {product.minStock}
                            </p>
                          </td>

                          <td className="px-6 py-5">

                            <button
                              type="button"
                              onClick={() =>
                                openEditForm(
                                  product.id
                                )
                              }
                              disabled={submitting}
                              className="mr-4 text-sm font-medium text-blue-600 transition hover:text-blue-800 disabled:opacity-50"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteProduct(
                                  product.id
                                )
                              }
                              disabled={submitting}
                              className="text-sm font-medium text-red-600 transition hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Delete
                            </button>

                          </td>
                        </tr>
                      );
                    })}
                  </tbody>

                </table>
              </div>

              {products.length === 0 && (
                <div className="p-12 text-center">
                  <p className="font-medium text-slate-700">
                    No products found
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Add your first product to get started.
                  </p>
                </div>
              )}

            </div>
          )}

        </div>
      </main>

      {/* Add/Edit Modal */}
      {(showAddForm || showEditForm) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {showEditForm
                    ? "Edit Product"
                    : "Add Product"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {showEditForm
                    ? "Update product information"
                    : "Add a new product to your inventory"}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={submitting}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
              >
                ×
              </button>

            </div>

            {/* Form */}
            <form
              onSubmit={
                showEditForm
                  ? handleUpdateProduct
                  : handleAddProduct
              }
              className="space-y-5 p-6"
            >

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2">

                {/* Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Product Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Wireless Keyboard"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* SKU */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    SKU *
                  </label>

                  <input
                    type="text"
                    name="sku"
                    value={form.sku}
                    onChange={handleChange}
                    placeholder="WK-001"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Selling Price */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Selling Price *
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="2500"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Cost Price */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Cost Price *
                  </label>

                  <input
                    type="number"
                    name="costPrice"
                    value={form.costPrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="1800"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Stock */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Initial Stock
                  </label>

                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    placeholder="20"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Minimum Stock */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Minimum Stock
                  </label>

                  <input
                    type="number"
                    name="minStock"
                    value={form.minStock}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    placeholder="5"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Category */}
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Category *
                  </label>

                  <select
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">
                      Select a category
                    </option>

                    {categories.map((category) => (
                      <option
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe the product..."
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting
                    ? showEditForm
                      ? "Updating..."
                      : "Creating..."
                    : showEditForm
                    ? "Update Product"
                    : "Create Product"}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}