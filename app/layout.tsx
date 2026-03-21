import type {Metadata} from 'next';
import { Lexend, Inter } from 'next/font/google';
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
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${lexend.variable} ${inter.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=door_front"
        />
      </head>
      <body className="bg-background text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
