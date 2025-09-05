import { siteConfig } from '../lib/site-config';
import { getTours } from '../services/tour-service';

export default async function sitemap() {
  // Obter todos os tours para incluir no sitemap
  const tours = await getTours();
  
  // URLs estáticas
  const staticUrls = [
    '',
    '/tours',
    '/contato',
    '/sobre',
    '/transfer',
    '/legal',
    '/legal/termos-de-uso',
    '/legal/politica-de-privacidade',
    '/legal/politica-de-cookies',
    '/legal/politica-de-cancelamento',
  ].map(route => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));
  
  // URLs dinâmicas (tours)
  const tourUrls = tours.map(tour => ({
    url: `${siteConfig.url}/tour/${tour.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));
  
  return [...staticUrls, ...tourUrls];
}