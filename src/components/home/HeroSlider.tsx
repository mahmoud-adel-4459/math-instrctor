import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  Sparkles,
  PlayCircle,
} from 'lucide-react';
import { Button } from '../common/Button';
import { INSTRUCTOR_NAME, PLATFORM_MOTTO } from '../../utils/constants';
import { cmsService } from '../../services/cms.service';
import { apiOrigin } from '../../services/apiClient';

export interface ImageSlide {
  id: number;
  imageUrl: string;
  badgeText: string;
  title: string;
  subtitle: string;
  primaryBtnText: string;
  primaryBtnLink: string;
  secondaryBtnText: string;
  secondaryBtnLink: string;
}

export const DEFAULT_SLIDES: ImageSlide[] = [
  {
    id: 0,
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1920&auto=format&fit=crop&q=80',
    badgeText: 'خبرة تتجاوز 27 عامًا',
    title: `احترف الرياضيات واضمن درجات التقفيل مع ${INSTRUCTOR_NAME}`,
    subtitle: `منصة تعليمية أُنشئت لتكون رفيقًا لكل طالب يسعى إلى التفوق وإتقان الرياضيات. «${PLATFORM_MOTTO}»`,
    primaryBtnText: 'تصفح الكورسات والمنهج',
    primaryBtnLink: '/courses',
    secondaryBtnText: 'عن المنصة والأستاذ',
    secondaryBtnLink: '/about',
  },
  {
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=1920&auto=format&fit=crop&q=80',
    badgeText: 'نظام البابل شيت الحديث 2026',
    title: 'تدرب على أحدث أسئلة امتحانات الثانوية مع التصحيح الفوري',
    subtitle: 'اختبارات تفاعلية محاكية للامتحانات الرسمية مع نماذج إجابة شارحة بالخطوات التوضيحية.',
    primaryBtnText: 'تصفح الكورسات',
    primaryBtnLink: '/courses',
    secondaryBtnText: 'إنشاء حساب طالب',
    secondaryBtnLink: '/register',
  },
  {
    id: 2,
    imageUrl: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=1920&auto=format&fit=crop&q=80',
    badgeText: 'مذكرات ومجموعاتPDF',
    title: 'شرح مبسط، خطط دراسية واضحة ومراجعات شاملة',
    subtitle: 'حمل مذكرات الشرح والتمارين المحلولة مع متابعة دورية تساعدك على بناء الثقة بنفسك.',
    primaryBtnText: 'استكشف المنهج',
    primaryBtnLink: '/courses',
    secondaryBtnText: 'عن الأستاذ والخبرة',
    secondaryBtnLink: '/about',
  },
];

function resolveImageUrl(imagePath?: string, fallbackIndex = 0): string {
  if (!imagePath || typeof imagePath !== 'string' || imagePath.trim() === '') {
    return DEFAULT_SLIDES[fallbackIndex % DEFAULT_SLIDES.length].imageUrl;
  }
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  if (imagePath.startsWith('/storage') || imagePath.startsWith('/media') || imagePath.startsWith('/uploads')) {
    return `${apiOrigin}${imagePath}`;
  }
  if (!imagePath.startsWith('/')) {
    return `${apiOrigin}/storage/${imagePath}`;
  }
  return `${apiOrigin}${imagePath}`;
}

function mapHeroSlides(rawSlides: any[]): ImageSlide[] {
  return rawSlides.map((s, idx) => {
    const fallback = DEFAULT_SLIDES[idx % DEFAULT_SLIDES.length] || DEFAULT_SLIDES[0];
    return {
      id: idx,
      imageUrl: resolveImageUrl(s.image, idx),
      badgeText: s.badge || s.badge_text || fallback.badgeText,
      title: s.title || fallback.title,
      subtitle: s.subtitle !== undefined && s.subtitle !== null && s.subtitle !== '' 
        ? s.subtitle 
        : fallback.subtitle,
      primaryBtnText: s.primary_btn_text || fallback.primaryBtnText,
      primaryBtnLink: s.primary_btn_link || fallback.primaryBtnLink,
      secondaryBtnText: s.secondary_btn_text || fallback.secondaryBtnText,
      secondaryBtnLink: s.secondary_btn_link || fallback.secondaryBtnLink,
    };
  });
}

function getInitialSlides(): ImageSlide[] {
  const cached = cmsService.getCachedPage('home');
  const heroData = cmsService.getSection<{ slides?: any[] }>(cached, 'hero');
  if (heroData?.slides && Array.isArray(heroData.slides) && heroData.slides.length > 0) {
    return mapHeroSlides(heroData.slides);
  }
  return DEFAULT_SLIDES;
}

export const HeroSlider: React.FC = () => {
  const [slides, setSlides] = useState<ImageSlide[]>(getInitialSlides);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let isMounted = true;
    cmsService.getPage('home', true).then((payload) => {
      if (!isMounted || !payload) return;
      const heroData = cmsService.getSection<{ slides?: any[] }>(payload, 'hero');
      if (heroData?.slides && Array.isArray(heroData.slides) && heroData.slides.length > 0) {
        setSlides(mapHeroSlides(heroData.slides));
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-play timer
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section
      className="hero-slider-section relative w-full overflow-hidden -mt-3 mb-12"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 100% Full Width Widescreen Image Slider Container */}
      <div className="hero-slider-container relative w-full h-[500px] sm:h-[580px] lg:h-[640px] overflow-hidden bg-slate-950 border-b border-blue-500/30 shadow-2xl">
        
        {/* Background Slide Image */}
        {slides.map((slide, idx) => {
          const isActive = currentIndex === idx;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img
                src={slide.imageUrl}
                alt={slide.title}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = DEFAULT_SLIDES[idx % DEFAULT_SLIDES.length].imageUrl;
                }}
                className="w-full h-full object-cover scale-105 transition-transform duration-10000 ease-linear"
              />
              
              {/* Dark Cinematic Overlay */}
              <div className="hero-slider-overlay absolute inset-0" />

              {/* Text & Button Overlay Container aligned with grid */}
              <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-12 lg:px-16 flex flex-col justify-center max-w-3xl space-y-4 sm:space-y-6 text-right z-10">
                
                {/* Badge */}
                <div>
                  <span className="slide-badge inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-slate-900/90 text-blue-300 text-[11px] sm:text-xs font-bold border border-blue-500/30 shadow-md backdrop-blur-md">
                    <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
                    <span>{slide.badgeText}</span>
                  </span>
                </div>

                {/* Main Title */}
                <h1 className="text-2xl sm:text-5xl lg:text-6xl font-black text-white leading-snug sm:leading-tight drop-shadow-2xl">
                  {slide.title}
                </h1>

                {/* Subtitle */}
                <p className="text-xs sm:text-base text-slate-200 leading-relaxed max-w-xl font-semibold drop-shadow-lg line-clamp-3 sm:line-clamp-none">
                  {slide.subtitle}
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4 pt-1 sm:pt-2">
                  <Link to={slide.primaryBtnLink} className="w-full sm:w-auto">
                    <Button variant="gradient" size="md" icon={ArrowLeft} iconPosition="left" className="w-full justify-center">
                      {slide.primaryBtnText}
                    </Button>
                  </Link>
                  <Link to={slide.secondaryBtnLink} className="w-full sm:w-auto">
                    <Button variant="secondary" size="md" icon={PlayCircle} className="w-full justify-center">
                      {slide.secondaryBtnText}
                    </Button>
                  </Link>
                </div>

              </div>
            </div>
          );
        })}

        {/* Side Arrows Controls */}
        <button
          onClick={handlePrev}
          className="slider-arrow absolute right-2 sm:right-8 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3.5 rounded-full bg-slate-950/70 hover:bg-blue-600 text-white border border-blue-500/40 backdrop-blur-md transition-all opacity-90 hover:opacity-100 hover:scale-110 shadow-2xl"
          title="الصورة السابقة"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>

        <button
          onClick={handleNext}
          className="slider-arrow absolute left-2 sm:left-8 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3.5 rounded-full bg-slate-950/70 hover:bg-blue-600 text-white border border-blue-500/40 backdrop-blur-md transition-all opacity-90 hover:opacity-100 hover:scale-110 shadow-2xl"
          title="الصورة التالية"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>

        {/* Bottom Pagination Dots */}
        <div className="slider-dots-container absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 bg-slate-950/70 px-5 py-2.5 rounded-full border border-blue-500/40 backdrop-blur-md">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentIndex(idx)}
              className={`h-3 rounded-full transition-all duration-300 ${
                currentIndex === idx
                  ? 'w-9 bg-blue-500 shadow-lg shadow-blue-500/90'
                  : 'w-3 bg-slate-600 hover:bg-slate-400'
              }`}
              title={`صورة ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
