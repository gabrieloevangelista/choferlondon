"use client"

import { WhatsAppIcon } from "./icons/whatsapp-icon"

export function FloatingContactButton() {
  const phoneNumber = "+447753144044"

  return (
    <a
      href={`https://wa.me/${phoneNumber.replace(/\+/g, "")}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-50 w-16 h-16 bg-green-500 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 hover:shadow-xl"
      aria-label="Contato via WhatsApp"
    >
      <WhatsAppIcon className="w-8 h-8 text-white" />
    </a>
  )
}
