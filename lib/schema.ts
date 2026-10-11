export function articleSchema({
  title,
  description,
  slug,
  publishedTime,
  modifiedTime,
  authorName,
  canonicalBase,
}: {
  title: string;
  description: string;
  slug: string;
  publishedTime: string;
  modifiedTime: string;
  authorName: string;
  canonicalBase: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: `${canonicalBase}/blog/${slug}/`,
    datePublished: publishedTime,
    dateModified: modifiedTime,
    author: {
      '@type': 'Person',
      name: authorName,
      url: canonicalBase,
    },
    publisher: {
      '@id': `${canonicalBase}/#organization`,
    },
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function serviceSchema({
  name,
  description,
  url,
  serviceType,
  canonicalBase,
}: {
  name: string;
  description: string;
  url: string;
  serviceType: string;
  canonicalBase: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url,
    serviceType,
    provider: { '@id': `${canonicalBase}/#organization` },
    areaServed: { '@type': 'Country', name: 'France' },
  };
}

export function courseSchema({
  name,
  description,
  url,
  canonicalBase,
  inLanguage,
}: {
  name: string;
  description: string;
  url: string;
  canonicalBase: string;
  inLanguage: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name,
    description,
    url,
    inLanguage,
    provider: {
      '@type': 'Organization',
      '@id': `${canonicalBase}/#organization`,
      name: 'Vision Human Consulting',
      sameAs: canonicalBase,
    },
  };
}
