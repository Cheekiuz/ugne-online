import {createPageMetadata, PAGE_ROUTES, SITE_NAME, SITE_URL} from '@/lib/site';
import {HomePage} from './components/home/HomePage';

export const metadata = createPageMetadata(PAGE_ROUTES.home);

const homeJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  name: PAGE_ROUTES.home.title,
  description: PAGE_ROUTES.home.description,
  url: SITE_URL,
  mainEntity: {
    '@type': 'Person',
    name: SITE_NAME,
    url: SITE_URL,
    description: PAGE_ROUTES.home.description,
    jobTitle: 'QA Engineer',
    knowsAbout: ['Tennis', 'Quality Assurance', 'Software Testing'],
    sameAs: ['https://www.instagram.com/ugne_le_'],
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(homeJsonLd)}}
      />
      <HomePage />
    </>
  );
}
