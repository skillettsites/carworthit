import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, PRODUCTS, TIER_ORDER, ANALYST, MEDIA_EMAIL } from './constants';

// JSON-LD. Real prices and real facts only: no invented ratings, no review
// counts we do not have. Google's structured-data policies treat fabricated
// markup as spam, and a model that cites a made-up rating stops citing us.

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    logo: `${SITE_URL}/icon.png`,
    email: MEDIA_EMAIL,
    // No sameAs until real profiles exist. Absent is better than wrong:
    // sameAs asserts identity, so listing unrelated sites would tell Google
    // this organisation *is* those sites.
    employee: {
      '@type': 'Person',
      name: ANALYST.name,
      jobTitle: ANALYST.role,
      description: ANALYST.bio,
    },
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
    serviceType: 'Used car valuation and vehicle report',
    name: `${SITE_NAME} vehicle reports`,
    description: SITE_DESCRIPTION,
    provider: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    areaServed: { '@type': 'Country', name: 'United States' },
    // Generated from PRODUCTS rather than listed by hand. The hand-written
    // version silently omitted the third tier the day it was added, which is
    // exactly the drift this markup is supposed to prevent.
    offers: TIER_ORDER.map((id) => ({
      '@type': 'Offer',
      name: PRODUCTS[id].name,
      description: PRODUCTS[id].blurb,
      price: String(PRODUCTS[id].price),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    })),
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

export function articleSchema(a: {
  title: string;
  description: string;
  slug: string;
  datePublished?: string;
  dateModified?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.description,
    url: `${SITE_URL}/blog/${a.slug}`,
    mainEntityOfPage: `${SITE_URL}/blog/${a.slug}`,
    // Required for image-bearing Article rich results. Its absence was silently
    // disqualifying all 52 articles.
    image: [`${SITE_URL}/opengraph-image`],
    // A named author is what separates a citable source from anonymous content,
    // and every journalist platform and AI-citation heuristic looks for one.
    author: { '@type': 'Person', name: ANALYST.name, jobTitle: ANALYST.role, url: `${SITE_URL}/about` },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon.png` },
    },
    ...(a.datePublished ? { datePublished: a.datePublished } : {}),
    ...(a.dateModified ? { dateModified: a.dateModified } : {}),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

/** For explainer pages, which is what AI assistants actually quote back. */
export function howToSchema(name: string, description: string, steps: { name: string; text: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    step: steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}
