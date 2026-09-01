import type {Viewport} from 'next';
import {Lexend, Inter} from 'next/font/google';
import {createRootMetadata, THEME_COLOR} from '@/lib/site';
import {GoogleAnalytics} from './components/analytics/GoogleAnalytics';
import {ScrollPeekCharacter} from './components/scroll-peek/ScrollPeekCharacter';
import {QaGremlin} from './components/qa-gremlin/QaGremlin';
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

export const metadata = createRootMetadata();

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: THEME_COLOR,
};

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const isProduction = process.env.NODE_ENV === 'production';

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${lexend.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('ugne-theme');var d=s==='dark'||(!s&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
        {GA_MEASUREMENT_ID && isProduction ? (
          <>
            {/* Plain script tags so GA is in static HTML and fires before React hydrates. */}
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}');`,
              }}
            />
          </>
        ) : null}
      </head>
      <body className="bg-background text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container antialiased" suppressHydrationWarning>
        <Snowfall />
        <ScrollPeekCharacter />
        <QaGremlin />
        {children}
        <GoogleAnalytics />
      </body>
    </html>
  );
}
