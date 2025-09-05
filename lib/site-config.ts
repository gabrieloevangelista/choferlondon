// Configurações do site
export const siteConfig = {
  name: "Chofer em Londres",
  description: "Tours personalizados e transfers de luxo em Londres",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://clr-alpha.vercel.app", // URL base do site para URLs canônicos
  ogImage: "/images/og-image.jpg",
  links: {
    twitter: "https://twitter.com/choferemLondres",
    instagram: "https://instagram.com/choferemLondres",
    facebook: "https://facebook.com/choferemLondres",
    whatsapp: "https://wa.me/447123456789", // Substitua pelo número correto
  },
  contact: {
    email: "contato@choferemLondres.com",
    phone: "+44 7123 456789", // Substitua pelo número correto
  },
}