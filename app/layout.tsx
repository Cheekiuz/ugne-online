import type {Metadata, Viewport} from 'next';
import {Lexend, Inter} from 'next/font/google';
import {DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL} from '@/lib/site';
import {GoogleAnalytics} from './components/analytics/GoogleAnalytics';
import {ScrollPeekCharacter} from './components/scroll-peek/ScrollPeekCharacter';
import {Snowfall} from './components/snow/Snowfall';
import './globals.css'; // Global styles

const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-lexend',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Ugnė - Court Competitor',
    template: '%s',
  },
  description: DEFAULT_DESCRIPTION,
  icons: {
    icon: '/favicon.png',
  },
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
  },
  twitter: {
    card: 'summary_large_image',
  },
  verification: {
    google: '5PH4VVPYwr2dn4CEljdd3POi1ZgUtHlvjVGpFu81q-c',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${lexend.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('ugne-theme');var d=s==='dark'||(!s&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body className="bg-background text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container antialiased" suppressHydrationWarning>
        <Snowfall />
        <ScrollPeekCharacter />
        {children}
        <GoogleAnalytics />
      </body>
    </html>
  );
}
