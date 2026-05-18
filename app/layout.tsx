// app/layout.tsx
// यह main layout है जो सभी pages को wrap करता है
// This is the main layout that wraps all pages

import type { Metadata, Viewport } from 'next';
import ThemeWrapper from '@/components/ThemeWrapper';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'CampusConnect+',
  description: 'College Social Media Platform',
  applicationName: 'CampusConnect+',
  keywords: ['college', 'social', 'campus', 'community'],
  authors: [{ name: 'CampusConnect' }],
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="theme-color" content="#0f172a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="CampusConnect+" />
      </head>
      <body>
        <ThemeWrapper>
          {children}
        </ThemeWrapper>
      </body>
    </html>
  );
}
