"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, MapIcon, Plane, Info, Phone, Search, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { SearchModal } from "./search-modal"
import { Logo } from "./logo"

const navItems = [
  { name: "Início", href: "/", icon: Home },
  { name: "Tours", href: "/tours", icon: MapIcon },
  { name: "Transfer", href: "/transfer", icon: Plane },
  { name: "Sobre", href: "/sobre", icon: Info },
  { name: "Contato", href: "/contato", icon: Phone },
]

function HeaderContent() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleScroll = useCallback(() => {
    const scrolled = window.scrollY > 10
    setIsScrolled(scrolled)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const handleNavigation = useCallback(() => {
    setMobileMenuOpen(false)
  }, [])

  const handleSearchOpen = useCallback(() => {
    setIsSearchOpen(true)
  }, [])

  const handleSearchClose = useCallback(() => {
    setIsSearchOpen(false)
  }, [])

  const handleMobileMenuToggle = useCallback(() => {
    setMobileMenuOpen(prev => !prev)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 bg-white w-full",
          isScrolled ? "shadow-lg border-b border-gray-200" : "border-b border-gray-100",
        )}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group cursor-pointer">
              <div className="relative w-[70px] h-[70px] transition-all duration-300 group-hover:scale-105">
                <Logo />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:block">
              <ul className="flex space-x-2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-gray-100 cursor-pointer",
                          isActive
                            ? "text-blue-600 bg-blue-50"
                            : "text-gray-700 hover:text-gray-900"
                        )}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-2">
              <button
                onClick={handleSearchOpen}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-900 hover:bg-gray-200 hover:scale-105 transition-all cursor-pointer"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center space-x-2 md:hidden">
              <button
                onClick={handleSearchOpen}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-900 hover:bg-gray-200 transition-all cursor-pointer"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                onClick={handleMobileMenuToggle}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-900 hover:bg-gray-200 transition-all cursor-pointer"
                aria-label="Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 z-[9997] bg-white transition-all duration-300 ease-in-out transform pt-20 px-4 overflow-y-auto",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <nav className="py-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={handleNavigation}
                    className={cn(
                      "flex items-center px-4 py-3 rounded-md text-base font-medium transition-all duration-200 cursor-pointer",
                      isActive
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    )}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-[9996] bg-black/50 backdrop-blur-sm"
          onClick={handleNavigation}
        />
      )}

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={handleSearchClose} />
    </>
  )
}

export function Header() {
  return <HeaderContent />
}