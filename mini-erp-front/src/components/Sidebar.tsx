"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Tag,
  Boxes,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/pedidos", label: "Pedidos", icon: ShoppingCart },
  { href: "/produtos", label: "Produtos", icon: Package },
  { href: "/clientes", label: "Clientes", icon: Users },
  { href: "/categorias", label: "Categorias", icon: Tag },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-60 shrink-0 flex-col border-r border-slate-200 bg-white transition-colors duration-200 dark:border-zinc-800 dark:bg-zinc-900 lg:flex">
      {/* Logo */}
      <div className="flex items-center gap-2.5 border-b border-slate-200 px-5 py-4.5 dark:border-zinc-800">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 dark:bg-indigo-500">
          <Boxes className="h-4 w-4 text-white" />
        </div>
        <span className="text-[15px] font-bold tracking-tight text-slate-900 dark:text-zinc-50">
          Mini ERP
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-0.5 p-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-r-md border-l-2 px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700 dark:border-indigo-500 dark:bg-zinc-800 dark:text-zinc-100"
                  : "border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-200 px-5 py-4 dark:border-zinc-800">
        <p className="text-xs text-slate-400 dark:text-zinc-500">
          Mini ERP v1.0.0
        </p>
      </div>
    </aside>
  );
}
