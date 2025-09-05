import { LayoutWrapper } from "../../../components/layout-wrapper"

export default function PoliticaDeCookies() {
  return (
    <LayoutWrapper>
      <div className="container-custom py-16">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Política de Cookies</h1>

          <div className="prose prose-blue max-w-none">
            <p className="text-gray-600 mb-6">Última atualização: {new Date().toLocaleDateString("pt-BR")}</p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. O que são Cookies?</h2>
            <p className="text-gray-600 mb-4">
              Cookies são pequenos arquivos de texto que são armazenados no seu dispositivo (computador, tablet ou
              celular) quando você visita um site. Eles permitem que o site reconheça seu dispositivo e lembre-se de
              determinadas informações sobre sua visita.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Como Utilizamos os Cookies</h2>
            <p className="text-gray-600 mb-4">Utilizamos cookies pelos seguintes motivos:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-600">
              <li>
                <strong>Cookies Essenciais:</strong> Necessários para o funcionamento básico do site, permitindo
                recursos como navegação e acesso a áreas seguras.
              </li>
              <li>
                <strong>Cookies de Preferências:</strong> Permitem que o site lembre de informações que mudam a forma
                como o site se comporta ou aparece, como seu idioma preferido.
              </li>
              <li>
                <strong>Cookies Estatísticos:</strong> Ajudam-nos a entender como os visitantes interagem com o site,
                coletando e relatando informações anonimamente.
              </li>
              <li>
                <strong>Cookies de Marketing:</strong> Utilizados para rastrear visitantes em sites. A intenção é exibir
                anúncios relevantes e envolventes para o usuário individual.
              </li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Tipos de Cookies que Utilizamos</h2>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">3.1. Cookies Próprios</h3>
              <p className="text-gray-600 mb-4">
                São cookies definidos por nós e usados para melhorar sua experiência em nosso site.
              </p>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">3.2. Cookies de Terceiros</h3>
              <p className="text-gray-600 mb-4">
                São cookies definidos por nossos parceiros, como Google Analytics, para nos ajudar a entender como você
                usa nosso site e melhorar nossos serviços.
              </p>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Controle de Cookies</h2>
            <p className="text-gray-600 mb-4">
              A maioria dos navegadores permite que você controle cookies através das configurações. Você pode
              configurar seu navegador para recusar todos os cookies ou para indicar quando um cookie está sendo
              enviado. No entanto, algumas funcionalidades do site podem não funcionar corretamente se você desabilitar
              os cookies.
            </p>
            <p className="text-gray-600 mb-4">
              Você também pode optar por não participar de cookies de terceiros para publicidade comportamental
              visitando{" "}
              <a
                href="http://www.youronlinechoices.eu/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                www.youronlinechoices.eu
              </a>
              .
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Alterações nesta Política</h2>
            <p className="text-gray-600 mb-4">
              Podemos atualizar nossa Política de Cookies periodicamente. Recomendamos que você revise esta página
              regularmente para estar ciente de quaisquer alterações.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">6. Contato</h2>
            <p className="text-gray-600 mb-4">
              Se você tiver dúvidas sobre nossa Política de Cookies, entre em contato conosco através do e-mail
              info@choferemlondres.com ou pelo telefone +44 20 1234 5678.
            </p>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}
