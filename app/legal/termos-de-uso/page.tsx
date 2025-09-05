import { LayoutWrapper } from "../../../components/layout-wrapper"
import Link from "next/link"

export default function TermosDeUso() {
  return (
    <LayoutWrapper>
      <div className="container-custom py-16">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold text-primary mb-8">Termos de Uso</h1>

          <div className="prose prose-blue max-w-none">
            <p className="text-gray-600 mb-6">Última atualização: {new Date().toLocaleDateString("pt-BR")}</p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Aceitação dos Termos</h2>
            <p className="text-gray-600 mb-4">
              Ao acessar e utilizar os serviços oferecidos pela Chofer em Londres, você concorda com estes Termos de
              Uso. Se você não concordar com qualquer parte destes termos, solicitamos que não utilize nossos serviços.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Descrição dos Serviços</h2>
            <p className="text-gray-600 mb-4">
              A Chofer em Londres oferece serviços de transporte privativo e tours personalizados em Londres e
              arredores. Nossos serviços incluem, mas não se limitam a, transfers de aeroporto, city tours, e excursões
              para destinos próximos.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Reservas e Pagamentos</h2>
            <p className="text-gray-600 mb-4">
              3.1. As reservas podem ser feitas através do nosso site, por e-mail ou WhatsApp.
            </p>
            <p className="text-gray-600 mb-4">
              3.2. Para confirmar uma reserva, é necessário o pagamento de um sinal de 50% do valor total do serviço.
            </p>
            <p className="text-gray-600 mb-4">
              3.3. O pagamento restante deve ser efetuado no dia do serviço, antes do início do mesmo.
            </p>
            <p className="text-gray-600 mb-4">
              3.4. Aceitamos pagamentos via transferência bancária, PayPal e cartões de crédito.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Política de Cancelamento</h2>
            <p className="text-gray-600 mb-4">
              4.1. Cancelamentos com mais de 48 horas de antecedência: reembolso total do sinal pago.
            </p>
            <p className="text-gray-600 mb-4">
              4.2. Cancelamentos entre 24 e 48 horas de antecedência: reembolso de 50% do sinal pago.
            </p>
            <p className="text-gray-600 mb-4">
              4.3. Cancelamentos com menos de 24 horas de antecedência: não haverá reembolso.
            </p>
            <p className="text-gray-600 mb-4">
              4.4. Para mais detalhes, consulte nossa{" "}
              <Link href="/legal/politica-de-cancelamento" className="text-primary hover:underline">
                Política de Cancelamento
              </Link>
              .
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Responsabilidades</h2>
            <p className="text-gray-600 mb-4">
              5.1. A Chofer em Londres se compromete a fornecer serviços de alta qualidade, com motoristas profissionais
              e veículos seguros e confortáveis.
            </p>
            <p className="text-gray-600 mb-4">
              5.2. Não nos responsabilizamos por atrasos ou cancelamentos devido a circunstâncias fora de nosso
              controle, como condições climáticas extremas, greves, manifestações ou outros eventos de força maior.
            </p>
            <p className="text-gray-600 mb-4">
              5.3. Os clientes são responsáveis por garantir que possuem todos os documentos necessários para viagem,
              incluindo passaportes e vistos quando aplicável.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">6. Segurança e Privacidade</h2>
            <p className="text-gray-600 mb-4">
              6.1. Respeitamos sua privacidade e protegemos seus dados pessoais de acordo com nossa{" "}
              <Link href="/legal/politica-de-privacidade" className="text-primary hover:underline">
                Política de Privacidade
              </Link>
              .
            </p>
            <p className="text-gray-600 mb-4">
              6.2. Ao utilizar nossos serviços, você concorda com a coleta e uso de informações conforme descrito em
              nossa Política de Privacidade.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">7. Propriedade Intelectual</h2>
            <p className="text-gray-600 mb-4">
              7.1. Todo o conteúdo presente no site da Chofer em Londres, incluindo textos, imagens, logotipos, designs
              e software, é de propriedade exclusiva da empresa ou de seus fornecedores de conteúdo e está protegido por
              leis de direitos autorais.
            </p>
            <p className="text-gray-600 mb-4">
              7.2. É proibida a reprodução, distribuição, modificação ou uso de qualquer conteúdo do site sem
              autorização prévia por escrito.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">8. Alterações nos Termos</h2>
            <p className="text-gray-600 mb-4">
              Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor
              imediatamente após sua publicação no site. É responsabilidade do usuário verificar regularmente se houve
              atualizações.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">9. Lei Aplicável</h2>
            <p className="text-gray-600 mb-4">
              Estes Termos de Uso são regidos pelas leis do Reino Unido. Qualquer disputa relacionada a estes termos
              será submetida à jurisdição exclusiva dos tribunais de Londres.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">10. Contato</h2>
            <p className="text-gray-600 mb-4">
              Para quaisquer dúvidas ou esclarecimentos sobre estes Termos de Uso, entre em contato conosco através do
              e-mail info@choferemlondres.com ou pelo telefone +44 7753 144044.
            </p>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}
