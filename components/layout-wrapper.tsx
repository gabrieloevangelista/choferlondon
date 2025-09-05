"use client"

import type React from "react"
import { Header } from "./header"
import { Footer } from "./footer"
import { MobileTabbar } from "./mobile-tabbar"
import { FloatingContactButton } from "./floating-contact-button"
import { ClientOnly } from "./client-only"
import { Shield, Clock, Award, Heart } from "lucide-react"

interface LayoutWrapperProps {
  children: React.ReactNode
  noPaddingTop?: boolean
}

export function LayoutWrapper({ children, noPaddingTop = false }: LayoutWrapperProps) {
  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden" suppressHydrationWarning>
      <Header />
      <main className={`flex-grow w-full ${noPaddingTop ? 'pt-0' : 'pt-20'} pb-24 md:pb-0 overflow-x-hidden`}>{children}</main>

      {/* Features Section - Moved from footer */}
      <div className="bg-gray-900 pt-10 mb-0 flex items-center">
        <div className="container-custom flex items-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center pt-4 pb-10 w-full">
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-blue-400/40 flex items-center justify-center mr-4 shadow-md border border-blue-300">
                <Shield className="w-6 h-6 text-blue-300" />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-white font-medium">Segurança</p>
                <p className="text-gray-400 text-sm">Motoristas profissionais</p>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-blue-400/40 flex items-center justify-center mr-4 shadow-md border border-blue-300">
                <Clock className="w-6 h-6 text-blue-300" />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-white font-medium">Pontualidade</p>
                <p className="text-gray-400 text-sm">Sempre no horário</p>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-blue-400/40 flex items-center justify-center mr-4 shadow-md border border-blue-300">
                <Award className="w-6 h-6 text-blue-300" />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-white font-medium">Qualidade</p>
                <p className="text-gray-400 text-sm">Serviço de excelência</p>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-blue-400/40 flex items-center justify-center mr-4 shadow-md border border-blue-300">
                <Heart className="w-6 h-6 text-blue-300" />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-white font-medium">Satisfação</p>
                <p className="text-gray-400 text-sm">Clientes satisfeitos</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <ClientOnly>
        <MobileTabbar />
        <FloatingContactButton />
      </ClientOnly>
    </div>
  )
}