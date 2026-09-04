
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import DashboardLayout from "../components/layout/DashboardLayout";
import {
  getAnalyticsSummary,
  getSalesAnalytics,
} from "../services/analytics.service";
import {
  getToken,
  getStoredUser,
} from "../features/auth/auth.service";

import type {
  AnalyticsSummary,
  SalesAnalytics,
} from "../types/analytics";

export default function DashboardPage() {
  const [summary, setSummary] =
    useState<AnalyticsSummary | null>(null);

  const [sales, setSales] =
    useState<SalesAnalytics | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = getStoredUser();

  useEffect(() => {
    async function loadDashboard() {
      const token = getToken();

      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        setLoading(true);
        setError("");

        const [summaryResponse, salesResponse] =
          await Promise.all([
            getAnalyticsSummary(token),
            getSalesAnalytics(token),
          ]);

        setSummary(summaryResponse.summary);
        setSales(salesResponse.sales);
      } catch (err) {
        console.error("Dashboard error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const stats = [
    {
      title: "Total Revenue",
      value: summary
        ? `Rs. ${summary.totalRevenue.toLocaleString()}`
        : "—",
      description: "From completed sales",
    },
    {
      title: "Total Orders",
      value: summary
        ? summary.totalOrders.toLocaleString()
        : "—",
      description: "Completed orders",
    },
    {
      title: "Products",
      value: summary
        ? summary.totalProducts.toLocaleString()
        : "—",
      description: "Active products",
    },
    {
      title: "Total Stock",
      value: summary
        ? summary.totalStock.toLocaleString()
        : "—",
      description: "Units currently available",
    },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Good day {user?.name ? `, ${user.name}` : ""} 👋
        </h2>

        <p className="mt-2 text-slate-500">
          Here is what is happening with your business today.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-500">
              {stat.title}
            </p>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              {loading ? "..." : stat.value}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              {stat.description}
            </p>
          </div>
        ))}
      </div>

      {/* Secondary Stats */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Inventory Value
          </p>

          <p className="mt-3 text-2xl font-bold text-slate-900">
            {loading
              ? "..."
              : `Rs. ${summary?.inventoryValue.toLocaleString() ?? "0"}`}
          </p>

          <p className="mt-2 text-xs text-slate-400">
            Current value of available inventory
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Low Stock Products
          </p>

          <p className="mt-3 text-2xl font-bold text-slate-900">
            {loading
              ? "..."
              : summary?.lowStockProducts ?? 0}
          </p>

          <p className="mt-2 text-xs text-slate-400">
            Products that may need restocking
          </p>
        </div>
      </div>

      {/* Main Cards */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Sales Overview */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900">
                Sales Overview
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Recent sales performance
              </p>
            </div>

            <Link
              href="/analytics"
              className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-200"
            >
              View Analytics
            </Link>
          </div>

          <div className="mt-6">
            {loading ? (
              <div className="flex h-64 items-center justify-center rounded-xl bg-slate-50">
                <p className="text-sm text-slate-400">
                  Loading sales data...
                </p>
              </div>
            ) : sales?.sales?.length ? (
              <div className="space-y-3">
                {sales.sales.slice(-7).map((item) => (
                  <div
                    key={item.date}
                    className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        {item.date}
                      </p>

                      <p className="text-xs text-slate-400">
                        {item.sales} sale
                        {item.sales !== 1 ? "s" : ""}
                      </p>
                    </div>

                    <p className="font-semibold text-slate-900">
                      Rs. {item.revenue.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-xl bg-slate-50">
                <div className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                    ↗
                  </div>

                  <p className="mt-3 text-sm font-medium text-slate-600">
                    No sales data yet
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Complete a sale to see analytics.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900">
            Quick Actions
          </h3>

          <div className="mt-5 space-y-3">
            <Link
              href="/products"
              className="block rounded-xl border border-slate-200 p-4 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <p className="font-medium text-slate-900">
                Manage Products
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Add and manage your products
              </p>
            </Link>

            <Link
              href="/sales"
              className="block rounded-xl border border-slate-200 p-4 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <p className="font-medium text-slate-900">
                Record Sale
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Create a new business sale
              </p>
            </Link>

            <Link
              href="/inventory"
              className="block rounded-xl border border-slate-200 p-4 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <p className="font-medium text-slate-900">
                Check Inventory
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Monitor current stock levels
              </p>
            </Link>

            <Link
              href="/ai"
              className="block rounded-xl bg-slate-900 p-4 text-white transition hover:bg-slate-800"
            >
              <p className="font-medium">
                ✦ AI Business Insights
              </p>

              <p className="mt-1 text-xs text-slate-300">
                Get intelligent recommendations
              </p>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
