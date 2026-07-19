import type {Metadata} from 'next';
import {siteUrl} from '@/lib/site';
import {CheeseRedirect} from '../components/cheese/CheeseRedirect';

export const metadata: Metadata = {
  alternates: {
    canonical: siteUrl('/say-cheese/'),
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function CheeseRedirectPage() {
  return <CheeseRedirect />;
}
