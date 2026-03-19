"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Person,
  Description,
  CalendarMonth,
  Group,
  Message,
  Work,
  Business,
  Settings,
  Logout,
} from "@mui/icons-material"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Inicio", icon: Home },
  { href: "/dashboard/profile", label: "Mi Perfil", icon: Person },
  { href: "/dashboard/documents", label: "Documentos", icon: Description },
  { href: "/dashboard/calendar", label: "Calendario", icon: CalendarMonth },
  { href: "/dashboard/noticias", label: "Noticias", icon: Group },
  { href: "/dashboard/users", label: "Usuarios", icon: Work },
]


export function SidebarNav() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-primary text-primary-foreground flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-primary-foreground/10">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-card/10 backdrop-blur flex items-center justify-center">
            <Business className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold tracking-tight">AXIOMA S.A.</h2>
            <p className="text-xs text-primary-foreground/70">Intranet</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-card/15 text-primary-foreground"
                  : "text-primary-foreground/70 hover:bg-card/10 hover:text-primary-foreground",
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-primary-foreground/10 space-y-1">
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-primary-foreground/70 hover:bg-card/10 hover:text-primary-foreground transition-all duration-200"
        >
          <Settings className="w-5 h-5" />
          Configuración
        </Link>
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-primary-foreground/70 hover:bg-card/10 hover:text-primary-foreground transition-all duration-200"
        >
          <Logout className="w-5 h-5" />
          Cerrar Sesión
        </Link>
      </div>
    </aside>
  )
}
