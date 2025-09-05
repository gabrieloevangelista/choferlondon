"use client"

import { Home, MapIcon, Plane, Phone, Info } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ClientOnly } from "./client-only"
import { useSafePathname } from "../hooks/use-safe-pathname"

const navItems = [
  { name: "Início", href: "/", icon: Home },
  { name: "Tours", href: "/tours", icon: MapIcon },
  { name: "Transfer", href: "/transfer", icon: Plane },
  { name: "Sobre", href: "/sobre", icon: Info },
  { name: "Contato", href: "/contato", icon: Phone },
]

export function MobileTabbar() {
  const currentPath = useSafePathname()

  return (
    <ClientOnly>
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-padding">
        <nav className="flex justify-around items-center py-2 px-1">
          {navItems.map((item) => {
            const isActive = currentPath === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center py-2 px-2 rounded-lg transition-all duration-200 min-w-0 flex-1",
                  isActive
                    ? "text-primary bg-blue-50"
                    : "text-gray-600 hover:text-primary hover:bg-gray-50"
                )}
                prefetch={false}
              >
                <item.icon className={cn("w-5 h-5 mb-1", isActive ? "text-primary" : "text-gray-600")} />
                <span className={cn("text-xs font-medium truncate", isActive ? "text-primary" : "text-gray-600")}>
                  {item.name}
                </span>
              </Link>
            )
          })}
        </nav>
      </div>
    </ClientOnly>
  )
}