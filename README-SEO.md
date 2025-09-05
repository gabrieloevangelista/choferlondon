# Implementação de URLs Canônicos SEO-friendly

Este documento descreve a implementação de URLs canônicos SEO-friendly no projeto Chofer em Londres.

## O que são URLs Canônicos?

URLs canônicos são URLs que os mecanismos de busca consideram como a versão "oficial" ou "preferida" de uma página. Eles são usados para evitar conteúdo duplicado quando várias URLs podem acessar o mesmo conteúdo.

## Implementação

### 1. Configuração do Site

O arquivo `lib/site-config.ts` contém a configuração básica do site, incluindo a URL base para os URLs canônicos.

```typescript
export const siteConfig = {
  name: "Chofer em Londres",
  description: "Tours personalizados e transfers de luxo em Londres",
  url: "https://www.choferemLondres.com", // URL base do site
  // ... outras configurações
}
```

### 2. Geração de Metadados

O arquivo `lib/metadata.ts` contém uma função para gerar metadados para as páginas, incluindo URLs canônicos.

```typescript
export function generateMetadata(props: MetadataProps): Metadata {
  // ... código para gerar metadados
  return {
    // ... outros metadados
    alternates: {
      canonical: canonicalPath,
    },
    // ... outros metadados
  };
}
```

### 3. Hook para URLs Canônicos

O arquivo `components/seo/canonical-url.tsx` contém um hook para gerar URLs canônicos para uso em componentes client.

```typescript
export function useCanonicalUrl(customPath?: string): string {
  const pathname = usePathname();
  const path = customPath || pathname;
  
  // Remove query parameters e hash fragments
  const cleanPath = path.split('?')[0].split('#')[0];
  
  // Constrói a URL canônica completa
  return `${siteConfig.url}${cleanPath}`;
}
```

### 4. Metadados para Páginas Estáticas

Cada página estática tem um arquivo `metadata.ts` que define seus metadados, incluindo o URL canônico.

Exemplo para a página principal:

```typescript
export const metadata = generateMetadata({
  title: 'Home',
  description: 'Tours personalizados e transfers de luxo em Londres com motorista brasileiro',
  path: '/',
});
```

### 5. Metadados para Páginas Dinâmicas

Páginas dinâmicas, como detalhes de tour, têm uma função `generateMetadata` que gera metadados com base nos parâmetros da rota.

Exemplo para a página de detalhes de tour:

```typescript
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
) {
  // ... código para obter dados do tour
  return {
    // ... outros metadados
    alternates: {
      canonical: `/tour/${params.id}`,
    },
    // ... outros metadados
  };
}
```

## Benefícios para SEO

1. **Evita conteúdo duplicado**: Os URLs canônicos ajudam os mecanismos de busca a entender qual versão de uma página deve ser indexada.

2. **Melhora o ranking**: Ao consolidar sinais de SEO em uma única URL, os URLs canônicos podem melhorar o ranking da página nos resultados de busca.

3. **Facilita o rastreamento**: Os URLs canônicos ajudam os mecanismos de busca a rastrear o site de forma mais eficiente.

## Próximos Passos

1. **Sitemap XML**: Implementar um sitemap XML para ajudar os mecanismos de busca a descobrir e indexar todas as páginas do site.

2. **Breadcrumbs estruturados**: Implementar breadcrumbs estruturados para melhorar a navegação e o SEO.

3. **Schema.org**: Implementar marcação Schema.org para fornecer mais contexto sobre o conteúdo do site aos mecanismos de busca.