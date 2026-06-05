"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ChevronRight,
  Menu,
  Boxes,
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Tag,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import ThemeToggle from "./ThemeToggle"

const ROUTE_LABELS: Record<string, string> = {
  "/": "Dashboard",
  "/pedidos": "Pedidos",
  "/pedidos/novo": "Novo Pedido",
  "/produtos": "Produtos",
  "/clientes": "Clientes",
  "/categorias": "Categorias",
}

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/pedidos", label: "Pedidos", icon: ShoppingCart },
  { href: "/produtos", label: "Produtos", icon: Package },
  { href: "/clientes", label: "Clientes", icon: Users },
  { href: "/categorias", label: "Categorias", icon: Tag },
]

export default function Header() {
  const pathname = usePathname()
  const currentLabel =
    ROUTE_LABELS[pathname] ??
    pathname.split("/").filter(Boolean).pop() ??
    "App"

  const [isMenuAberto, setIsMenuAberto] = useState(false)

  return (
    <>
      {/* Menu lateral deslizante para mobile */}
      <Sheet open={isMenuAberto} onOpenChange={setIsMenuAberto}>
        <SheetContent>
          <SheetHeader>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 dark:bg-indigo-500">
                <Boxes className="h-4 w-4 text-white" />
              </div>
              <SheetTitle>Mini ERP</SheetTitle>
            </div>
          </SheetHeader>

          <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsMenuAberto(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-r-md border-l-2 px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700 dark:border-indigo-500 dark:bg-zinc-800 dark:text-zinc-100"
                      : "border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </Link>
              )
            })}
          </nav>

          <div className="shrink-0 border-t border-slate-200 px-5 py-4 dark:border-zinc-800">
            <p className="text-xs text-slate-400 dark:text-zinc-500">Mini ERP v1.0.0</p>
          </div>
        </SheetContent>
      </Sheet>

      <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 transition-colors duration-200 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-1">
          {/* Botão hambúrguer — visível somente em mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-slate-500 dark:text-zinc-400"
            onClick={() => setIsMenuAberto(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Abrir menu</span>
          </Button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-sm">
            <span className="hidden select-none text-slate-400 dark:text-zinc-500 lg:inline">
              Mini ERP
            </span>
            <ChevronRight className="hidden h-3.5 w-3.5 text-slate-300 dark:text-zinc-600 lg:block" />
            <span className="font-semibold text-slate-800 dark:text-zinc-100">
              {currentLabel}
            </span>
          </div>
        </div>

        {/* Ações do topo */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="flex h-8 w-8 select-none items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white ring-2 ring-white dark:bg-indigo-500 dark:ring-zinc-900">
            JD
          </div>
        </div>
      </header>
    </>
  )
}
