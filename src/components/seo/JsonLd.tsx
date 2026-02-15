interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Organization Schema
export function OrganizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Guru Rani',
    description: 'Electric scooters designed for Indian roads',
    url: 'https://gururani.in',
    logo: 'https://gururani.in/logo.png',
    sameAs: [
      'https://www.facebook.com/gururani',
      'https://www.instagram.com/gururani',
      'https://twitter.com/gururani',
      'https://www.youtube.com/gururani',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-1800-123-456',
      contactType: 'customer service',
      areaServed: 'IN',
      availableLanguage: ['en', 'hi'],
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
    },
  };

  return <JsonLd data={data} />;
}

// Product Schema
interface ProductJsonLdProps {
  name: string;
  description: string;
  image?: string;
  brand?: string;
  price: number;
  currency?: string;
  availability?: string;
  url: string;
}

export function ProductJsonLd({
  name,
  description,
  image,
  brand = 'Guru Rani',
  price,
  currency = 'INR',
  availability = 'https://schema.org/InStock',
  url,
}: ProductJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image,
    brand: {
      '@type': 'Brand',
      name: brand,
    },
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: currency,
      availability,
      url,
      seller: {
        '@type': 'Organization',
        name: 'Guru Rani',
      },
    },
  };

  return <JsonLd data={data} />;
}

// FAQ Schema
interface FAQItem {
  question: string;
  answer: string;
}

interface FAQJsonLdProps {
  faqs: FAQItem[];
}

export function FAQJsonLd({ faqs }: FAQJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return <JsonLd data={data} />;
}

// Blog/Article Schema
interface ArticleJsonLdProps {
  title: string;
  description: string;
  image?: string;
  author: string;
  publishedAt: string;
  url: string;
}

export function ArticleJsonLd({
  title,
  description,
  image,
  author,
  publishedAt,
  url,
}: ArticleJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image,
    author: {
      '@type': 'Organization',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Guru Rani',
      logo: {
        '@type': 'ImageObject',
        url: 'https://gururani.in/logo.png',
      },
    },
    datePublished: publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };

  return <JsonLd data={data} />;
}

// Local Business Schema for Dealers
interface LocalBusinessJsonLdProps {
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  latitude: number;
  longitude: number;
}

export function LocalBusinessJsonLd({
  name,
  address,
  city,
  state,
  pincode,
  phone,
  latitude,
  longitude,
}: LocalBusinessJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    name,
    telephone: phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address,
      addressLocality: city,
      addressRegion: state,
      postalCode: pincode,
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude,
      longitude,
    },
    parentOrganization: {
      '@type': 'Organization',
      name: 'Guru Rani',
    },
  };

  return <JsonLd data={data} />;
}

// Breadcrumb Schema
interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbJsonLdProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <JsonLd data={data} />;
}

export default JsonLd;
