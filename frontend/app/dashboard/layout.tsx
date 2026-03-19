import type React from "react"
import { SidebarNav } from "@/app/components/sidebar-nav"
import { HeaderNav } from "@/app/components/header-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <SidebarNav />
      <div className="ml-64">
        <HeaderNav />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
