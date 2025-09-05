import { Car, Award, Users, Clock } from "lucide-react"
import Image from "next/image"

export default function Sobre() {
  return (
      <div className="container-custom mx-auto py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Sobre Chofer em Londres</h1>

        {/* Hero Section with Side-by-Side Layout for Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Image Section */}
          <div className="relative h-[500px] rounded-xl overflow-hidden shadow-lg">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bruno%20%281%29.jpg-0NUiBf9yqc9GdjkqGzIcJpd2Hg1h4p.jpeg"
              alt="Bruno - Chofer em Londres"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h2 className="text-2xl font-bold text-white mb-2">Bruno Reis</h2>
              <p className="text-white/90 text-lg">Fundador e seu motorista particular em Londres</p>
            </div>
          </div>

          {/* Text Section */}
          <div className="flex flex-col justify-center">
            <div className="bg-white p-8 rounded-xl shadow-md h-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Nossa História</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Fundada por Bruno Reis há mais de 20 anos, a Chofer em Londres é uma empresa especializada em oferecer
                serviços de transporte de alta qualidade para turistas e visitantes em Londres. Nossa missão é proporcionar
                uma experiência única e confortável, permitindo que nossos clientes aproveitem ao máximo sua estadia na
                cidade.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Hoje, contamos com uma equipe de motoristas brasileiros experientes e conhecedores da cidade, garantindo não
                apenas um transporte seguro e pontual, mas também um serviço personalizado que atende às necessidades
                específicas de cada cliente. Nossos motoristas oferecem um atendimento em português, tornando a experiência
                ainda mais confortável para visitantes brasileiros e portugueses.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Com mais de duas décadas de experiência, a Chofer em Londres se consolidou como referência em transfers e
                tours personalizados. Seja para tours turísticos, transfers de aeroporto ou deslocamentos pela cidade,
                estamos aqui para tornar sua viagem inesquecível com o melhor da hospitalidade brasileira em solo britânico.
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white p-5 rounded-lg shadow-md text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Car className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Veículos de Luxo</h3>
            <p className="text-gray-600">Frota moderna e confortável para sua comodidade.</p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-md text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Qualidade Premium</h3>
            <p className="text-gray-600">Serviço de excelência com atenção aos detalhes.</p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-md text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Motoristas Experientes</h3>
            <p className="text-gray-600">Profissionais que conhecem Londres como a palma da mão.</p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-md text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Disponibilidade 24/7</h3>
            <p className="text-gray-600">Serviço disponível a qualquer hora do dia ou da noite.</p>
          </div>
        </div>

        {/* Client Photos Gallery */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Nossos Clientes</h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-8">
            Confira alguns momentos especiais com nossos clientes em pontos turísticos de Londres e arredores. Estamos
            orgulhosos de proporcionar experiências inesquecíveis para visitantes de todo o mundo.
          </p>

          <div className="relative h-[600px] rounded-xl overflow-hidden">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/imagem%20clientes.jpg-n6vkgi2X4qRxHDJVuzgx05rorL7d5b.jpeg"
              alt="Clientes do Chofer em Londres"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Testimonials - Simplified */}
        <div className="bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">O que nossos clientes dizem</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-lg border border-gray-200">
              <p className="text-gray-600 italic mb-4">
                &ldquo;Serviço excepcional! O Bruno foi muito atencioso e conhecedor da cidade. Recomendo fortemente para quem
                quer conhecer Londres com conforto e praticidade.&rdquo;
              </p>
              <p className="text-gray-900 font-semibold">Maria S. - Brasil</p>
            </div>

            <div className="p-5 rounded-lg border border-gray-200">
              <p className="text-gray-600 italic mb-4">
                &ldquo;Experiência incrível! O tour foi personalizado de acordo com nossas preferências e o guia muito
                profissional. Voltaremos com certeza!&rdquo;
              </p>
              <p className="text-gray-900 font-semibold">João P. - Portugal</p>
            </div>
          </div>
        </div>
      </div>
  )
}
