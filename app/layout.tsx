import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#BE123C',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: '24 Crofts',
  description:
    'A secure matrimonial platform connecting film professionals with curated profiles, categorized departments, and integrated promotional media advertising features.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '24 Crofts',
  },
  icons: {
    icon: '/icon.svg',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: '24 Crofts',
    description:
      'A secure matrimonial platform connecting film professionals with curated profiles, categorized departments, and integrated promotional media advertising features.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '24 Crofts',
    description:
      'A secure matrimonial platform connecting film professionals with curated profiles, categorized departments, and integrated promotional media advertising features.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: '24 Crofts (24crofts.com)',
    url: 'https://24crofts.com',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
    description:
      'A secure matrimonial platform connecting film professionals with curated profiles, categorized departments, and integrated promotional media advertising features.',
    offers: {
      '@type': 'Offer',
      price: '1499',
      priceCurrency: 'INR',
    },
  };

  return (
    <html lang="te">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Noto+Sans+Devanagari:wght@400;600;700&family=Noto+Sans+Telugu:wght@400;600;700&family=Outfit:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        suppressHydrationWarning
        className="font-sans antialiased bg-[#FAF9F6] text-[#141413]"
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
