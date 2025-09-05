import { LayoutWrapper } from "../../../components/layout-wrapper"

export default function PoliticaDeCancelamento() {
  return (
    <LayoutWrapper>
      <div className="container-custom py-16">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Política de Cancelamento</h1>

          <div className="prose prose-blue max-w-none">
            <p className="text-gray-600 mb-6">Última atualização: {new Date().toLocaleDateString("pt-BR")}</p>

            <p className="text-gray-600 mb-6">
              Na Chofer em Londres, entendemos que planos podem mudar. Nossa política de cancelamento foi desenvolvida
              para ser justa tanto para nossos clientes quanto para nossa equipe. Leia atentamente as seguintes
              condições:
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Reservas e Pagamentos</h2>
            <p className="text-gray-600 mb-4">
              1.1. Para confirmar uma reserva, é necessário o pagamento de um sinal de 50% do valor total do serviço.
            </p>
            <p className="text-gray-600 mb-4">
              1.2. O pagamento restante deve ser efetuado no dia do serviço, antes do início do mesmo.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Política de Cancelamento para Tours</h2>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                2.1. Cancelamentos com mais de 48 horas de antecedência
              </h3>
              <p className="text-gray-600 mb-4">
                Se você cancelar sua reserva com mais de 48 horas de antecedência da data e hora agendadas, você
                receberá um reembolso total do sinal pago.
              </p>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                2.2. Cancelamentos entre 24 e 48 horas de antecedência
              </h3>
              <p className="text-gray-600 mb-4">
                Para cancelamentos feitos entre 24 e 48 horas antes da data e hora agendadas, você receberá um reembolso
                de 50% do sinal pago.
              </p>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                2.3. Cancelamentos com menos de 24 horas de antecedência
              </h3>
              <p className="text-gray-600 mb-4">
                Infelizmente, para cancelamentos feitos com menos de 24 horas de antecedência, não oferecemos reembolso
                do sinal pago.
              </p>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">
              3. Política de Cancelamento para Transfers de Aeroporto
            </h2>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                3.1. Cancelamentos com mais de 24 horas de antecedência
              </h3>
              <p className="text-gray-600 mb-4">
                Se você cancelar seu transfer com mais de 24 horas de antecedência, você receberá um reembolso total do
                sinal pago.
              </p>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                3.2. Cancelamentos com menos de 24 horas de antecedência
              </h3>
              <p className="text-gray-600 mb-4">
                Para cancelamentos feitos com menos de 24 horas de antecedência, será cobrada uma taxa de cancelamento
                de 50% do valor total do serviço.
              </p>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Atrasos e No-Shows</h2>
            <p className="text-gray-600 mb-4">
              4.1. Para transfers de aeroporto, nossos motoristas aguardarão até 60 minutos após o horário de pouso
              programado sem custo adicional. Após este período, poderão ser aplicadas taxas de espera.
            </p>
            <p className="text-gray-600 mb-4">
              4.2. Para tours e outros serviços, nossos motoristas aguardarão até 30 minutos após o horário agendado.
              Após este período, o serviço poderá ser considerado como &ldquo;no-show&rdquo;.
            </p>
            <p className="text-gray-600 mb-4">
              4.3. Em caso de &ldquo;no-show&rdquo; (quando o cliente não comparece sem aviso prévio), não haverá reembolso do valor
              pago.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Alterações de Reserva</h2>
            <p className="text-gray-600 mb-4">
              5.1. Alterações de data e hora podem ser feitas sem custo adicional, desde que solicitadas com pelo menos
              48 horas de antecedência e sujeitas à disponibilidade.
            </p>
            <p className="text-gray-600 mb-4">
              5.2. Alterações solicitadas com menos de 48 horas de antecedência estarão sujeitas à disponibilidade e
              poderão incorrer em taxas adicionais.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">6. Cancelamentos por Nossa Parte</h2>
            <p className="text-gray-600 mb-4">
              6.1. Em raras ocasiões, podemos precisar cancelar um serviço devido a circunstâncias imprevistas (como
              condições climáticas extremas, problemas mecânicos ou doença do motorista).
            </p>
            <p className="text-gray-600 mb-4">
              6.2. Nestes casos, ofereceremos um reembolso total ou a opção de reagendar para outra data sem custo
              adicional.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">7. Reembolsos</h2>
            <p className="text-gray-600 mb-4">
              7.1. Todos os reembolsos serão processados para o método de pagamento original dentro de 7 a 14 dias
              úteis.
            </p>
            <p className="text-gray-600 mb-4">7.2. Taxas de processamento de pagamento não são reembolsáveis.</p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">8. Contato</h2>
            <p className="text-gray-600 mb-4">
              Para solicitar um cancelamento ou alteração, entre em contato conosco o mais rápido possível através do
              e-mail bookings@choferemlondres.com ou pelo telefone +44 20 1234 5678.
            </p>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}
