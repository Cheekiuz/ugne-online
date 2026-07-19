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
      <article id="site-summary" className="sr-only">
        <h1>Ugnė - Court Competitor</h1>
        <p>
          Personal website of Ugnė, a tennis court competitor and QA engineer in Vilnius, Lithuania.
          The site covers match stories, career statistics, sponsorship, and the parallels between
          high-stakes software testing and competitive tennis.
        </p>
        <h2>Pages</h2>
        <ul>
          <li>
            <a href="https://ugne.online/">Home</a> — court competitor intro and match moments
          </li>
          <li>
            <a href="https://ugne.online/statistics/">Career Statistics</a> — tennis and QA stats
          </li>
          <li>
            <a href="https://ugne.online/sponsorship/">Sponsorship</a> — sponsorship opportunities
          </li>
          <li>
            <a href="https://ugne.online/say-cheese/">Say Cheese</a> — visitor smile wall
          </li>
        </ul>
        <p>
          Contact: <a href="https://www.instagram.com/ugne_le_">Instagram @ugne_le_</a>
        </p>
      </article>
      <noscript>
        <main>
          <h1>Ugnė - Court Competitor</h1>
          <p>
            Personal website of Ugnė, a tennis court competitor and QA engineer in Vilnius,
            Lithuania. Where technical precision meets kinetic energy.
          </p>
          <p>
            Ugnė explores the parallels between high-stakes QA engineering and competitive tennis:
            precision, strategy, stamina, and execution under pressure.
          </p>
          <h2>Match highlights</h2>
          <ul>
            <li>The Comeback Set — secured a tie-break from 0-5 down in the second set.</li>
            <li>Clay Court Endurance — a 3-hour marathon match won through defensive play.</li>
            <li>The Perfect Ace — fastest serve after six months of biomechanical focus.</li>
          </ul>
          <h2>Preferred courts</h2>
          <ul>
            <li>SEB Arena — indoor hard courts in Vilnius.</li>
            <li>Bernardinai — open-air courts beside Bernardine Garden.</li>
          </ul>
          <h2>Site pages</h2>
          <ul>
            <li><a href="https://ugne.online/statistics/">Career Statistics</a></li>
            <li><a href="https://ugne.online/sponsorship/">Sponsorship</a></li>
            <li><a href="https://ugne.online/say-cheese/">Say Cheese</a></li>
          </ul>
          <p>
            <a href="https://www.instagram.com/ugne_le_">Challenge me on Instagram</a>
          </p>
          <p>
            Plain-text summary: <a href="https://ugne.online/llms.txt">llms.txt</a>
          </p>
        </main>
      </noscript>
      <HomePage />
    </>
  );
}
