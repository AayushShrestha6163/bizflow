"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getStoredUser,
  logout,
} from "../../features/auth/auth.service";

interface StoredUser {
  name?: string;
  role?: string;
}

export default function Topbar() {
  const router = useRouter();

  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    const storedUser = getStoredUser();
    setUser(storedUser);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="fixed left-64 right-0 top-0 z-30 h-20 border-b border-slate-200 bg-white">
      <div className="flex h-full items-center justify-between px-8">

        {/* Left */}
        <div>
          <p className="text-sm text-slate-400">
            Business Management
          </p>

          <h1 className="text-xl font-bold text-slate-900">
            BizFlow
          </h1>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">

          {/* Notification */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-lg text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
          >
            ♢
          </button>

          {/* User */}
          <div className="flex items-center gap-3 border-l border-slate-200 pl-4">

            {/* Avatar */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-700">
              {user?.name
                ? user.name.charAt(0).toUpperCase()
                : "U"}
            </div>

            {/* User Information */}
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-slate-900">
                {user?.name || "User"}
              </p>

              <p className="text-xs text-slate-400">
                {user?.role || "STAFF"}
              </p>
            </div>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="ml-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Logout
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}