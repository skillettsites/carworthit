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
  // Deliberately NO `url` or `title` here. Next.js inherits the whole
  // openGraph object into any page that does not set its own, so pinning them
  // at the root made 19 of 21 routes announce themselves as the homepage:
  // /pricing and /about both emitted og:url = https://carworthit.com. Next
  // fills og:title from each page's own resolved title when it is absent here,
  // which is what we want. The homepage sets its own url in page.tsx.
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_US',
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    description: SITE_DESCRIPTION,
  },
  // Explicitly the homepage. Every other page sets its own; without that, a
  // page inherits this and declares itself a duplicate of the homepage, which
  // is how six real pages were quietly telling Google not to index them.
  alternates: { canonical: SITE_URL },
  // Let AI assistants and search previews quote generously rather than
  // truncating to a snippet, since being quoted accurately is the whole point.
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg text-ink">
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <GoogleAnalytics />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
