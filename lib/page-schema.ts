import { breadcrumbSchema, courseSchema, faqSchema, serviceSchema } from '@/lib/schema';
import { canonicalBase, getCanonicalUrl } from '@/lib/seo';
import { getSiteContent, type Locale } from '@/lib/i18n';

/** Structured data for each inner route, built from the same content JSON. */

function crumbs(locale: Locale, items: Array<{ name: string; path: string }>) {
  const home = getSiteContent(locale).common.homeLabel;
  return breadcrumbSchema([
    { name: home, url: getCanonicalUrl(locale) },
    ...items.map((item) => ({ name: item.name, url: getCanonicalUrl(locale, item.path) })),
  ]);
}

export function simplePageSchema(locale: Locale, name: string, path: string) {
  return [crumbs(locale, [{ name, path }])];
}

export function offersIndexSchema(locale: Locale) {
  const { offersPage } = getSiteContent(locale);
  return [
    crumbs(locale, [{ name: offersPage.badge, path: '/offres' }]),
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: offersPage.offers.map((offer, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: getCanonicalUrl(locale, `/offres/${offer.slug}`),
        name: `${offer.title} (${offer.tier})`,
      })),
    },
  ];
}

export function offerSchema(locale: Locale, slug: string) {
  const { offersPage } = getSiteContent(locale);
  const offer = offersPage.offers.find((item) => item.slug === slug);
  if (!offer) return [];
  const path = `/offres/${slug}`;
  return [
    crumbs(locale, [
      { name: offersPage.badge, path: '/offres' },
      { name: offer.title, path },
    ]),
    serviceSchema({
      name: `${offer.title} (${offer.tier})`,
      description: offer.summary,
      url: getCanonicalUrl(locale, path),
      serviceType: offer.title,
      canonicalBase,
    }),
  ];
}

export function trainingsIndexSchema(locale: Locale) {
  const { trainingsPage } = getSiteContent(locale);
  return [
    crumbs(locale, [{ name: trainingsPage.badge, path: '/formations' }]),
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: trainingsPage.trainings.map((training, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: getCanonicalUrl(locale, `/formations/${training.slug}`),
        name: training.title,
      })),
    },
  ];
}

export function trainingSchema(locale: Locale, slug: string) {
  const { trainingsPage } = getSiteContent(locale);
  const training = trainingsPage.trainings.find((item) => item.slug === slug);
  if (!training) return [];
  const path = `/formations/${slug}`;
  return [
    crumbs(locale, [
      { name: trainingsPage.badge, path: '/formations' },
      { name: training.sector, path },
    ]),
    courseSchema({
      name: training.title,
      description: training.summary,
      url: getCanonicalUrl(locale, path),
      canonicalBase,
      inLanguage: locale,
    }),
  ];
}

export function homeFaqSchema(locale: Locale) {
  return faqSchema(getSiteContent(locale).home.faq.items);
}
