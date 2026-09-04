"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: "▦",
  },
  {
    name: "Products",
    href: "/products",
    icon: "▣",
  },
  {
    name: "Sales",
    href: "/sales",
    icon: "↗",
  },
  {
    name: "Inventory",
    href: "/inventory",
    icon: "▤",
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: "◩",
  },
  {
    name: "AI Insights",
    href: "/ai",
    icon: "✦",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-slate-950 text-white shadow-xl">
      
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-white/10 px-6">
        <h1 className="text-xl font-bold tracking-tight">
          Biz<span className="text-blue-400">Flow</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 p-4">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="flex h-6 w-6 items-center justify-center text-base">
                {item.icon}
              </span>

              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 p-4">
        <p className="text-xs text-slate-500">
          BizFlow Business Management
        </p>

        <p className="mt-1 text-xs text-slate-600">
          © 2026 BizFlow
        </p>
      </div>
    </aside>
  );
}