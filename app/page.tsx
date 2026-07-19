import {createPageMetadata, PAGE_ROUTES} from '@/lib/site';
import {HomePage} from './components/home/HomePage';

export const metadata = createPageMetadata(PAGE_ROUTES.home);

export default function Home() {
  return <HomePage />;
}
