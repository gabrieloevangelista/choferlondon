import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { siteConfig } from "../lib/site-config"
import "./globals.css"
import { LayoutWrapper } from "../components/layout-wrapper"

// Configure the Inter font (a popular sans-serif font)
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Chofer em Londres",
  description: "Tours personalizados e transfers de luxo em Londres",
  icons: {
    icon: "/LogoMain.png",
  },
  generator: 'v0.dev',
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: '/',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  )
}