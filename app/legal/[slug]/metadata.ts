type Props = {
  params: { slug: string };
};

// Mapeamento de slugs para títulos e descrições
const legalPages = {
  'termos-de-uso': {
    title: 'Termos de Uso',
    description: 'Termos e condições de uso dos serviços de Chofer em Londres',
  },
  'politica-de-privacidade': {
    title: 'Política de Privacidade',
    description: 'Como tratamos e protegemos seus dados pessoais',
  },
  'politica-de-cookies': {
    title: 'Política de Cookies',
    description: 'Como utilizamos cookies em nosso site',
  },
  'politica-de-cancelamento': {
    title: 'Política de Cancelamento',
    description: 'Regras e condições para cancelamento de tours e transfers',
  },
};

export async function generateMetadata(
  { params }: Props
) {
  // Obter informações da página com base no slug
  const pageInfo = legalPages[params.slug as keyof typeof legalPages] || {
    title: 'Informação Legal',
    description: 'Informações legais sobre nossos serviços',
  };
  
  // Gerar metadados com URL canônico
  return {
    title: pageInfo.title,
    description: pageInfo.description,
    alternates: {
      canonical: `/legal/${params.slug}`,
    },
  };
}