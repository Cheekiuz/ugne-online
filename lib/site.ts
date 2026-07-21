import type {Metadata} from 'next';

export const SITE_URL = 'https://ugne.online';
export const SITE_NAME = 'Ugnė';
export const PERSON_IMAGE = '/cc34d4a1-65a9-47d8-82e2-ce055bec3b13.jpeg';
export const DEFAULT_OG_IMAGE = PERSON_IMAGE;
export const THEME_COLOR = '#506300';

export const DEFAULT_DESCRIPTION =
  'Personal site of Ugnė — tennis court competitor and QA engineer in Vilnius. Match stories, career statistics, sponsorship, and the parallels between high-stakes testing and competitive tennis.';

export type SiteRoute = {
  path: string;
  title: string;
  description: string;
  ogImage?: string;
};

export const PAGE_ROUTES = {
  home: {
    path: '/',
    title: 'Enter - Ugnė',
    description:
      "Step inside Ugnė's personal site — QA engineer, tennis court competitor in Vilnius, and professional overthinker.",
    ogImage: PERSON_IMAGE,
  },
  homePage: {
    path: '/home/',
    title: 'Ugnė - Court Competitor',
    description: DEFAULT_DESCRIPTION,
    ogImage: PERSON_IMAGE,
  },
  statistics: {
    path: '/statistics/',
    title: 'Career Statistics - Ugnė',
    description:
      "Career statistics for a QA engineer who also plays tennis in Vilnius. Numbers don't lie. I just adjust them.",
    ogImage: '/career-statistics-hero.png',
  },
  sponsorship: {
    path: '/sponsorship/',
    title: 'Sponsorship - Ugnė',
    description:
      "Sponsorship opportunities for Ugnė's personal site. Funding dreams since approximately last Tuesday. Tiers from €4.90.",
    ogImage: '/sponsorship-hero.png',
  },
  sayCheese: {
    path: '/say-cheese/',
    title: 'Say Cheese - Ugnė',
    description:
      "The Smile Wall on Ugnė's personal site — leave an anonymous smile if you dare. Real visitors. Mostly real smiles.",
    ogImage: '/cheese-hero.png',
  },
} as const satisfies Record<string, SiteRoute>;

export const SITE_ROUTES = Object.values(PAGE_ROUTES);

export function siteUrl(path: string): string {
  if (path === '/') {
    return `${SITE_URL}/`;
  }

  return `${SITE_URL}${path}`;
}

function buildSocialImages(imagePath: string, alt: string): NonNullable<Metadata['openGraph']>['images'] {
  return [
    {
      url: imagePath,
      width: 1200,
      height: 630,
      alt,
    },
  ];
}

export function createPageMetadata({title, description, path, ogImage}: SiteRoute): Metadata {
  const url = siteUrl(path);
  const imagePath = ogImage ?? DEFAULT_OG_IMAGE;
  const imageAlt = `${title} — ${SITE_NAME}`;

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
      images: buildSocialImages(imagePath, imageAlt),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imagePath],
    },
  };
}

export function createRootMetadata(): Metadata {
  const imageAlt = `${SITE_NAME} — Court Competitor`;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: 'Ugnė - Court Competitor',
      template: '%s',
    },
    description: DEFAULT_DESCRIPTION,
    icons: {
      icon: '/favicon.png',
      apple: '/favicon.png',
    },
    manifest: '/manifest.webmanifest',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    openGraph: {
      siteName: SITE_NAME,
      type: 'website',
      locale: 'en_US',
      title: 'Ugnė - Court Competitor',
      description: DEFAULT_DESCRIPTION,
      url: siteUrl('/home/'),
      images: buildSocialImages(DEFAULT_OG_IMAGE, imageAlt),
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Ugnė - Court Competitor',
      description: DEFAULT_DESCRIPTION,
      images: [DEFAULT_OG_IMAGE],
    },
    verification: {
      google: '5PH4VVPYwr2dn4CEljdd3POi1ZgUtHlvjVGpFu81q-c',
    },
  };
}
