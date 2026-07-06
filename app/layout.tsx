import type {Metadata} from 'next';
import { Lexend, Inter } from 'next/font/google';
import {GoogleAnalytics} from './components/analytics/GoogleAnalytics';
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
  title: 'Ugnė - Court Competitor',
  description: 'Where technical precision meets kinetic energy.',
  icons: {
    icon: '/favicon.png',
  },
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
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=door_front"
        />
      </head>
      <body className="bg-background text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container antialiased" suppressHydrationWarning>
        {children}
        <GoogleAnalytics />
      </body>
    </html>
  );
}
