import {createPageMetadata, PAGE_ROUTES, siteUrl} from '@/lib/site';
import {LandingPage} from './components/home/LandingPage';

export const metadata = createPageMetadata(PAGE_ROUTES.home);

export default function Home() {
  return (
    <>
      <article id="site-summary" className="sr-only">
        <h1>Enter - Ugnė</h1>
        <p>Entry page for Ugnė&apos;s personal website. Open the door to enter the site.</p>
        <p>
          <a href={siteUrl('/home/')}>Home</a>
        </p>
      </article>
      <noscript>
        <main>
          <h1>Ugnė</h1>
          <p>
            <a href={siteUrl('/home/')}>Enter the site</a>
          </p>
        </main>
      </noscript>
      <LandingPage />
    </>
  );
}
