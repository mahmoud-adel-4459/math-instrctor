import type { Course, BreadcrumbItem } from '../types';

export const getOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'Math Instructor — منصة تعليم الرياضيات',
  url: 'https://math-instrctor.vercel.app',
  logo: 'https://math-instrctor.vercel.app/favicon.svg',
  description: 'منصة تعليمة مخصصة لتعليم وفهم الرياضيات للمرحلة الثانوية والإعدادية بأسلوب حديث وتطبيقات تفاعلية.',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'EG',
    addressLocality: 'Cairo',
  },
});

export const getInstructorPersonSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'أ. أحمد قابيل',
  jobTitle: 'مدرس رياضيات بخبرة تتجاوز 27 عامًا',
  worksFor: {
    '@type': 'EducationalOrganization',
    name: 'Math with Kabil Platform',
  },
  sameAs: ['https://math-instrctor.vercel.app/about'],
});

export const getCourseSchema = (course: Course) => ({
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: course.title,
  description: course.description,
  provider: {
    '@type': 'Organization',
    name: 'Math Instructor Platform',
    sameAs: 'https://math-instrctor.vercel.app',
  },
  instructor: {
    '@type': 'Person',
    name: course.instructorName,
  },
  isAccessibleForFree: true,
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: course.rating,
    reviewCount: course.reviewCount,
    bestRating: '5',
    worstRating: '1',
  },
});

export const getBreadcrumbSchema = (items: BreadcrumbItem[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.label,
    item: item.path ? `https://math-instrctor.vercel.app${item.path}` : undefined,
  })),
});

export const getFAQPageSchema = (faqs: Array<{ question: string; answer: string }>) => ({
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
});
