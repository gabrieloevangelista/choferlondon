import { LayoutWrapper } from "../../components/layout-wrapper"
import Link from "next/link"
import { FileText, Shield, Calendar, Cookie } from "lucide-react"

export default function Legal() {
  return (
    <LayoutWrapper>
      <div className="container-custom py-16">
        <h1 className="text-3xl font-bold text-primary mb-12 text-center">Informações Legais</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Link
            href="/legal/termos-de-uso"
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 flex items-start"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 text-primary flex-shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Termos de Uso</h2>
              <p className="text-gray-600">Condições gerais para utilização dos nossos serviços.</p>
            </div>
          </Link>

          <Link
            href="/legal/politica-de-privacidade"
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 flex items-start"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 text-primary flex-shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Política de Privacidade</h2>
              <p className="text-gray-600">Como coletamos, usamos e protegemos seus dados pessoais.</p>
            </div>
          </Link>

          <Link
            href="/legal/politica-de-cookies"
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 flex items-start"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 text-primary flex-shrink-0">
              <Cookie className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Política de Cookies</h2>
              <p className="text-gray-600">Informações sobre como utilizamos cookies em nosso site.</p>
            </div>
          </Link>

          <Link
            href="/legal/politica-de-cancelamento"
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 flex items-start"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 text-primary flex-shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Política de Cancelamento</h2>
              <p className="text-gray-600">Condições para cancelamento e reembolso de reservas.</p>
            </div>
          </Link>
        </div>
      </div>
    </LayoutWrapper>
  )
}
