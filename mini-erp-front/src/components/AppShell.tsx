"use client"

import { usePathname } from "next/navigation"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"

const PUBLIC_PATHS = ["/login"]

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p))

  if (isPublic) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto bg-slate-50 transition-colors duration-200 dark:bg-zinc-950">
          <div className="p-4 sm:p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
