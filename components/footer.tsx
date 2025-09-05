
import Link from "next/link"
import Image from "next/image"
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Car,
  Globe,
  Clock,
  Heart,
  Info,
  MapIcon,
} from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white shadow-lg">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 max-w-7xl pb-8 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div className="space-y-4">
            <div className="flex flex-col items-center md:items-start space-y-3 mb-6">
              <div className="relative w-[120px] h-[120px]">
                <Image
                  src="/LogoMain.png"
                  alt="Chofer em Londres Logo"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
              <h3 className="text-xl font-bold text-white">Chofer em Londres</h3>
            </div>
            <p className="text-gray-400 leading-relaxed text-sm md:text-base text-center md:text-left">
              Oferecemos serviços de transporte premium e tours personalizados em Londres, garantindo conforto,
              pontualidade e experiências inesquecíveis.
            </p>
            <div className="flex space-x-3 pt-2 justify-center md:justify-start">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 text-primary" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4 text-primary" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 text-primary" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 border-b border-gray-700 pb-2">Links Rápidos</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors flex items-center text-sm md:text-base">
                  <Globe className="w-4 h-4 mr-2 text-primary" />
                  Início
                </Link>
              </li>
              <li>
                <Link href="/tours" className="text-gray-400 hover:text-white transition-colors flex items-center text-sm md:text-base">
                  <MapIcon className="w-4 h-4 mr-2 text-primary" />
                  Tours
                </Link>
              </li>
              <li>
                <Link href="/transfer" className="text-gray-400 hover:text-white transition-colors flex items-center text-sm md:text-base">
                  <Car className="w-4 h-4 mr-2 text-primary" />
                  Transfer
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="text-gray-400 hover:text-white transition-colors flex items-center text-sm md:text-base">
                  <Info className="w-4 h-4 mr-2 text-primary" />
                  Sobre
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-gray-400 hover:text-white transition-colors flex items-center text-sm md:text-base">
                  <Phone className="w-4 h-4 mr-2 text-primary" />
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold mb-6 border-b border-gray-700 pb-2">Serviços</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/tours" className="text-gray-400 hover:text-white transition-colors flex items-center text-sm md:text-base">
                  <MapPin className="w-4 h-4 mr-2 text-primary" />
                  City Tour de Londres
                </Link>
              </li>
              <li>
                <Link href="/tours" className="text-gray-400 hover:text-white transition-colors flex items-center text-sm md:text-base">
                  <Clock className="w-4 h-4 mr-2 text-primary" />
                  Tour Histórico
                </Link>
              </li>
              <li>
                <Link href="/tours" className="text-gray-400 hover:text-white transition-colors flex items-center text-sm md:text-base">
                  <Globe className="w-4 h-4 mr-2 text-primary" />
                  Museus de Londres
                </Link>
              </li>
              <li>
                <Link href="/tours" className="text-gray-400 hover:text-white transition-colors flex items-center text-sm md:text-base">
                  <Heart className="w-4 h-4 mr-2 text-primary" />
                  Parques Reais
                </Link>
              </li>
              <li>
                <Link href="/transfer" className="text-gray-400 hover:text-white transition-colors flex items-center text-sm md:text-base">
                  <Car className="w-4 h-4 mr-2 text-primary" />
                  Transfer Aeroporto
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-6 border-b border-gray-700 pb-2">Contato</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-3 text-primary flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm md:text-base">Telefone</p>
                  <p className="text-gray-400 text-xs md:text-sm">+44 20 1234 5678</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-3 text-primary flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm md:text-base">Email</p>
                  <p className="text-gray-400 text-xs md:text-sm break-all">info@choferemlondres.com</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-3 text-primary flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm md:text-base">Endereço</p>
                  <p className="text-gray-400 text-xs md:text-sm">94 Burrows Rd, London NW10 5SH, Reino Unido</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 mb-4 md:mb-0 text-sm text-center md:text-left">
            &copy; {currentYear} Chofer em Londres. Todos os direitos reservados.
          </p>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
            <Link href="/legal/termos-de-uso" className="text-gray-400 hover:text-white transition-colors text-sm text-center">
              Termos de Uso
            </Link>
            <Link href="/legal/politica-de-privacidade" className="text-gray-400 hover:text-white transition-colors text-sm text-center">
              Política de Privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
