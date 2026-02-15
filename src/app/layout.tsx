import type { Metadata, Viewport } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';

// Primary font for body text
const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

// Heading font
const poppins = Poppins({
  variable: '--font-heading',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

// SEO Metadata
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'Guru Rani - Electric Scooters for India',
    template: '%s | Guru Rani',
  },
  description:
    'Discover Guru Rani electric scooters - designed for Indian roads. Experience superior range, performance, and savings. Book a test ride today!',
  keywords: [
    'electric scooter',
    'EV',
    'electric vehicle',
    'Guru Rani',
    'e-scooter India',
    'electric bike',
    'eco-friendly transport',
  ],
  authors: [{ name: 'Guru Rani' }],
  creator: 'Guru Rani',
  publisher: 'Guru Rani',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: '/',
    siteName: 'Guru Rani',
    title: 'Guru Rani - Electric Scooters for India',
    description:
      'Discover Guru Rani electric scooters - designed for Indian roads. Experience superior range, performance, and savings.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Guru Rani Electric Scooters',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guru Rani - Electric Scooters for India',
    description:
      'Discover Guru Rani electric scooters - designed for Indian roads. Experience superior range, performance, and savings.',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/site.webmanifest',
};

// Viewport settings
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#112D4E',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="min-h-screen bg-background text-text-primary antialiased">
        {/* Skip link for accessibility */}
        <a
          href="#main-content"
          className="skip-link focus-ring"
        >
          Skip to main content
        </a>

        {/* Main content */}
        <div id="main-content">{children}</div>
      </body>
    </html>
  );
}
