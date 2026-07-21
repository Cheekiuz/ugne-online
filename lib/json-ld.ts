import {DEFAULT_DESCRIPTION, PERSON_IMAGE, SITE_NAME, SITE_URL, siteUrl, type SiteRoute} from './site';

export const INSTAGRAM_URL = 'https://www.instagram.com/ugne_le_';

export function buildPersonJsonLd(description = DEFAULT_DESCRIPTION) {
  return {
    '@type': 'Person',
    name: SITE_NAME,
    url: SITE_URL,
    description,
    image: siteUrl(PERSON_IMAGE),
    jobTitle: 'QA Engineer',
    homeLocation: {
      '@type': 'City',
      name: 'Vilnius',
      containedInPlace: {
        '@type': 'Country',
        name: 'Lithuania',
      },
    },
    knowsAbout: ['Tennis', 'Quality Assurance', 'Software Testing'],
    sameAs: [INSTAGRAM_URL],
  };
}

export function buildProfilePageJsonLd(route: SiteRoute) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name: route.title,
    description: route.description,
    url: siteUrl(route.path),
    mainEntity: buildPersonJsonLd(route.description),
  };
}

export function buildFaqPageJsonLd(
  items: ReadonlyArray<{question: string; answer: string}>,
  pageUrl: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
    url: pageUrl,
  };
}
