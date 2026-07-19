import type {Metadata} from 'next';

export const SITE_URL = 'https://ugne.online';
export const SITE_NAME = 'Ugnė';
export const DEFAULT_DESCRIPTION =
  'Personal site of Ugnė — tennis court competitor and QA engineer in Vilnius. Match stories, career statistics, sponsorship, and the parallels between high-stakes testing and competitive tennis.';

export type SiteRoute = {
  path: string;
  title: string;
  description: string;
};

export const PAGE_ROUTES = {
  home: {
    path: '/',
    title: 'Enter - Ugnė',
    description: 'Step inside Ugnė\'s personal site — court competitor, QA engineer, and professional overthinker.',
  },
  homePage: {
    path: '/home/',
    title: 'Ugnė - Court Competitor',
    description: DEFAULT_DESCRIPTION,
  },
  statistics: {
    path: '/statistics/',
    title: 'Career Statistics - Ugnė',
    description: "Numbers don't lie. I just adjust them.",
  },
  sponsorship: {
    path: '/sponsorship/',
    title: 'Sponsorship - Ugnė',
    description: 'Funding dreams since approximately last Tuesday.',
  },
  sayCheese: {
    path: '/say-cheese/',
    title: 'Say Cheese - Ugnė',
    description: 'Real smiles donated. Leave one if you dare.',
  },
} as const satisfies Record<string, SiteRoute>;

export const SITE_ROUTES = Object.values(PAGE_ROUTES);

export function siteUrl(path: string): string {
  if (path === '/') {
    return `${SITE_URL}/`;
  }

  return `${SITE_URL}${path}`;
}

export function createPageMetadata({title, description, path}: SiteRoute): Metadata {
  const url = siteUrl(path);

  return {
    title,
    description,
    alternates: {
      canonical: url,
      types: {
        'text/plain': '/llms.txt',
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}
