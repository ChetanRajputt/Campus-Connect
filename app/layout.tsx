// app/layout.tsx
// यह main layout है जो सभी pages को wrap करता है
// This is the main layout that wraps all pages

import type { Metadata } from 'next';
import ThemeWrapper from '@/components/ThemeWrapper';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'CampusConnect+',
  description: 'College Social Media Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeWrapper>
          {children}
        </ThemeWrapper>
      </body>
    </html>
  );
}
