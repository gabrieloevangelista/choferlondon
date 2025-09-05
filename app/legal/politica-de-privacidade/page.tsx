import { LayoutWrapper } from "../../../components/layout-wrapper"
import Link from "next/link"

export default function PoliticaDePrivacidade() {
  return (
    <LayoutWrapper>
      <div className="container-custom py-16">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold text-primary mb-8">Política de Privacidade</h1>

          <div className="prose prose-blue max-w-none">
            <p className="text-gray-600 mb-6">Última atualização: {new Date().toLocaleDateString("pt-BR")}</p>

            <p className="text-gray-600 mb-6">
              A Chofer em Londres está comprometida em proteger sua privacidade. Esta Política de Privacidade explica
              como coletamos, usamos, divulgamos e protegemos suas informações pessoais.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Informações que Coletamos</h2>
            <p className="text-gray-600 mb-4">Podemos coletar os seguintes tipos de informações:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-600">
              <li>Informações de contato (nome, e-mail, telefone, endereço)</li>
              <li>Informações de reserva (datas, destinos, preferências)</li>
              <li>Informações de pagamento (dados de cartão de crédito, informações bancárias)</li>
              <li>Informações de passaporte ou identificação (quando necessário para reservas específicas)</li>
              <li>Comunicações que você nos envia</li>
              <li>Dados de uso do site (através de cookies e tecnologias similares)</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Como Usamos Suas Informações</h2>
            <p className="text-gray-600 mb-4">Utilizamos suas informações para:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-600">
              <li>Processar e confirmar suas reservas</li>
              <li>Fornecer os serviços solicitados</li>
              <li>Comunicar-nos com você sobre suas reservas e serviços</li>
              <li>Enviar informações sobre promoções e novos serviços (com seu consentimento)</li>
              <li>Melhorar nossos serviços e experiência do usuário</li>
              <li>Cumprir obrigações legais e regulatórias</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Base Legal para Processamento</h2>
            <p className="text-gray-600 mb-4">Processamos suas informações pessoais com base em:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-600">
              <li>Execução de contrato (quando você faz uma reserva conosco)</li>
              <li>Consentimento (para marketing e comunicações promocionais)</li>
              <li>Interesses legítimos (para melhorar nossos serviços)</li>
              <li>Obrigações legais (para cumprir requisitos fiscais e outras leis aplicáveis)</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Compartilhamento de Informações</h2>
            <p className="text-gray-600 mb-4">Podemos compartilhar suas informações com:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-600">
              <li>Nossos motoristas e guias que prestarão os serviços</li>
              <li>Parceiros de negócios envolvidos na prestação dos serviços solicitados</li>
              <li>Provedores de serviços de pagamento para processar transações</li>
              <li>Autoridades governamentais quando exigido por lei</li>
            </ul>
            <p className="text-gray-600 mb-4">
              Não vendemos ou alugamos suas informações pessoais a terceiros para fins de marketing.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Transferências Internacionais</h2>
            <p className="text-gray-600 mb-4">
              Como operamos no Reino Unido e atendemos clientes de diversos países, suas informações pessoais podem ser
              transferidas para fora do seu país de residência. Implementamos salvaguardas apropriadas para proteger
              suas informações durante essas transferências, em conformidade com as leis de proteção de dados
              aplicáveis.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">6. Segurança de Dados</h2>
            <p className="text-gray-600 mb-4">
              Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações pessoais
              contra acesso não autorizado, perda ou alteração. No entanto, nenhum método de transmissão pela Internet
              ou método de armazenamento eletrônico é 100% seguro.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">7. Retenção de Dados</h2>
            <p className="text-gray-600 mb-4">
              Mantemos suas informações pessoais pelo tempo necessário para cumprir os propósitos para os quais foram
              coletadas, incluindo obrigações legais, contábeis ou de relatórios. O período de retenção específico varia
              dependendo do tipo de informação e dos requisitos legais aplicáveis.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">8. Seus Direitos</h2>
            <p className="text-gray-600 mb-4">Dependendo da sua localização, você pode ter o direito de:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-600">
              <li>Acessar as informações pessoais que temos sobre você</li>
              <li>Corrigir informações imprecisas</li>
              <li>Solicitar a exclusão de suas informações (sujeito a obrigações legais)</li>
              <li>Retirar seu consentimento para marketing direto</li>
              <li>Solicitar a limitação do processamento de seus dados</li>
              <li>Solicitar a portabilidade de seus dados</li>
              <li>Opor-se ao processamento de seus dados em determinadas circunstâncias</li>
            </ul>
            <p className="text-gray-600 mb-4">
              Para exercer qualquer um desses direitos, entre em contato conosco através dos dados fornecidos na seção
              &ldquo;Contato&rdquo; abaixo.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">9. Cookies e Tecnologias Similares</h2>
            <p className="text-gray-600 mb-4">
              Nosso site utiliza cookies e tecnologias similares para melhorar sua experiência de navegação. Para mais
              informações, consulte nossa{" "}
              <Link href="/legal/politica-de-cookies" className="text-primary hover:underline">
                Política de Cookies
              </Link>
              .
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">10. Crianças</h2>
            <p className="text-gray-600 mb-4">
              Nossos serviços não são direcionados a pessoas menores de 18 anos. Não coletamos intencionalmente
              informações pessoais de crianças. Se você acredita que coletamos informações de uma criança, entre em
              contato conosco imediatamente.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">11. Alterações nesta Política</h2>
            <p className="text-gray-600 mb-4">
              Podemos atualizar esta Política de Privacidade periodicamente. A versão mais recente estará sempre
              disponível em nosso site, com a data da última atualização. Recomendamos que você revise esta política
              regularmente.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">12. Contato</h2>
            <p className="text-gray-600 mb-4">
              Se você tiver dúvidas sobre esta Política de Privacidade ou quiser exercer seus direitos, entre em contato
              conosco através do e-mail privacy@choferemlondres.com ou pelo telefone +44 7753 144044.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">13. Autoridade Supervisora</h2>
            <p className="text-gray-600 mb-4">
              Se você estiver no Reino Unido ou na União Europeia e acreditar que não resolvemos adequadamente suas
              preocupações, você tem o direito de apresentar uma reclamação à autoridade de proteção de dados do seu
              país.
            </p>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}
