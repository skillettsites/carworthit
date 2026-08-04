import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { organizationSchema, websiteSchema } from '@/lib/schema';
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from '@/lib/constants';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `Price My Car by VIN, US Car Value Check | ${SITE_NAME}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `Price My Car by VIN, US Car Value Check | ${SITE_NAME}`,
    description: SITE_DESCRIPTION,
  },
  alternates: { canonical: SITE_URL },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg text-ink">
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <GoogleAnalytics />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
