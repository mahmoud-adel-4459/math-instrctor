import React from 'react';
import { Helmet } from 'react-helmet-async';
import type { SEOConfig } from '../types';

interface SEOHeadProps extends Partial<SEOConfig> {
  title: string;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description = 'منصة تعليم الرياضيات المخصصة للمرحلة الثانوية والإعدادية مع أحدث واجهات التعلم والتصحيح الإلكتروني.',
  canonical,
  ogImage = 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&h=630&auto=format&fit=crop&q=80',
  ogType = 'website',
  noindex = false,
  jsonLd,
}) => {
  const fullTitle = `${title} | Math Instructor — منصة تعليم الرياضيات`;
  const currentUrl = canonical || (typeof window !== 'undefined' ? window.location.href : '');

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}
      <html lang="ar" dir="rtl" />

      {/* Canonical Link */}
      {currentUrl && <link rel="canonical" href={currentUrl} />}

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Math Instructor Platform" />
      <meta property="og:locale" content="ar_EG" />
      {currentUrl && <meta property="og:url" content={currentUrl} />}

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};
