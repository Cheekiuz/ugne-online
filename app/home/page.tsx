import {createPageMetadata, PAGE_ROUTES} from '@/lib/site';
import {HomeRouteView} from '../components/home/HomeRouteView';

export const metadata = createPageMetadata(PAGE_ROUTES.homePage);

export default function HomePageRoute() {
  return <HomeRouteView route={PAGE_ROUTES.homePage} />;
}
