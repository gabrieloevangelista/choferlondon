'use client';

import { siteConfig } from '../../lib/site-config';
import { useSafePathname } from '../../hooks/use-safe-pathname';



/**
 * Hook para gerar URL canônico para páginas
 * 
 * Uso:
 * const canonicalUrl = useCanonicalUrl();
 * const canonicalUrl = useCanonicalUrl('/caminho-personalizado');
 */

export function useCanonicalUrl(customPath?: string): string {
  const pathname = useSafePathname();
  const path = customPath || pathname;
  
  // Verifica se path não é null antes de usar split
  if (!path) {
    return `${siteConfig.url}/`;
  }
  
  // Remove query parameters e hash fragments (se houver)
  const cleanPath = path.split('?')[0].split('#')[0];
  
  // Constrói a URL canônica completa
  return `${siteConfig.url}${cleanPath}`;
}