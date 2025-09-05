import type { Metadata } from 'next';
import { siteConfig } from './site-config';

type MetadataProps = {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
  noIndex?: boolean;
};

/**
 * Gera metadados para páginas, incluindo URL canônico
 * 
 * @param props Propriedades de metadados
 * @returns Objeto Metadata para uso com Next.js
 */
export function generateMetadata(props: MetadataProps): Metadata {
  const {
    title,
    description = siteConfig.description,
    path,
    ogImage = siteConfig.ogImage,
    noIndex = false,
  } = props;

  // Título completo com nome do site
  const fullTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  
  // URL canônico
  const canonicalPath = path || '/';
  
  return {
    title: fullTitle,
    description,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: `${siteConfig.url}${canonicalPath}`,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: 'pt_BR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
  };
}