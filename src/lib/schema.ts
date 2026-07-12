import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, PRODUCTS } from './constants';

// JSON-LD structured data. No fabricated ratings/reviews (real prices only).

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    logo: `${SITE_URL}/icon.png`,
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/report/{vin}` },
      'query-input': 'required name=vin',
    },
  };
}

export function serviceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Vehicle history and valuation report',
    name: `${SITE_NAME} Vehicle Report`,
    description: SITE_DESCRIPTION,
    provider: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    areaServed: { '@type': 'Country', name: 'United States' },
    offers: [
      { '@type': 'Offer', name: PRODUCTS.valuation.name, price: String(PRODUCTS.valuation.price), priceCurrency: 'USD' },
      { '@type': 'Offer', name: PRODUCTS.history.name, price: String(PRODUCTS.history.price), priceCurrency: 'USD' },
      { '@type': 'Offer', name: PRODUCTS.bundle.name, price: String(PRODUCTS.bundle.price), priceCurrency: 'USD' },
    ],
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function articleSchema(a: { title: string; description: string; slug: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.description,
    url: `${SITE_URL}/blog/${a.slug}`,
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/blog/${a.slug}`,
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.url })),
  };
}
