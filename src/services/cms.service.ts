import { apiClient } from './apiClient';

export interface CmsSection<T = Record<string, any>> {
  key: string;
  enabled: boolean;
  order: number;
  data: T;
}

export interface CmsPagePayload {
  page: string;
  title: string;
  seo: {
    title?: string;
    description?: string;
    canonical?: string;
    robots?: string;
  };
  sections: CmsSection[];
}

export interface SiteConfig {
  site_name: string;
  site_description: string;
  contact: {
    email: string;
    phone: string;
  };
  registration_enabled: boolean;
  social: {
    facebook: string;
    youtube: string;
    instagram: string;
  };
}

function getStoredPage(slug: string): CmsPagePayload | null {
  try {
    const raw = localStorage.getItem(`app_cms_page_${slug}`);
    return raw ? (JSON.parse(raw) as CmsPagePayload) : null;
  } catch {
    return null;
  }
}

function setStoredPage(slug: string, data: CmsPagePayload): void {
  try {
    localStorage.setItem(`app_cms_page_${slug}`, JSON.stringify(data));
  } catch {
    // Ignore
  }
}

function getStoredSiteConfig(): SiteConfig | null {
  try {
    const raw = localStorage.getItem('app_site_config');
    return raw ? (JSON.parse(raw) as SiteConfig) : null;
  } catch {
    return null;
  }
}

function setStoredSiteConfig(config: SiteConfig): void {
  try {
    localStorage.setItem('app_site_config', JSON.stringify(config));
  } catch {
    // Ignore
  }
}

// In-memory cache
const pageCache = new Map<string, { data: CmsPagePayload; time: number }>();
let siteConfigCache: { data: SiteConfig; time: number } | null = null;
const CACHE_TTL = 3 * 60 * 1000; // 3 minutes

export const cmsService = {
  /**
   * Synchronous getter for initial component state (0ms first paint)
   */
  getCachedPage(slug: string): CmsPagePayload | null {
    const mem = pageCache.get(slug);
    if (mem) return mem.data;
    return getStoredPage(slug);
  },

  /**
   * Fetch CMS page content by slug (home, about, faq, contact, courses, privacy, terms, etc.)
   * Uses Stale-While-Revalidate (SWR): Returns cached immediately while fetching fresh data
   */
  async getPage(slug: string, forceRefresh = false): Promise<CmsPagePayload | null> {
    const cached = pageCache.get(slug)?.data || getStoredPage(slug);

    if (!forceRefresh && cached) {
      const mem = pageCache.get(slug);
      if (mem && Date.now() - mem.time < CACHE_TTL) {
        return cached;
      }
    }

    try {
      const response = await apiClient.get<CmsPagePayload>(`/public/pages/${slug}`);
      if (response) {
        pageCache.set(slug, { data: response, time: Date.now() });
        setStoredPage(slug, response);
        return response;
      }
    } catch (error) {
      console.warn(`[cmsService] Failed to load CMS page "${slug}", using cached if available`, error);
      if (cached) return cached;
    }

    return cached || null;
  },

  /**
   * Fetch public site configuration (name, contact, social links)
   */
  async getSiteConfig(): Promise<SiteConfig> {
    const cached = siteConfigCache?.data || getStoredSiteConfig();
    if (cached && siteConfigCache && Date.now() - siteConfigCache.time < CACHE_TTL) {
      return cached;
    }

    const fallbackConfig: SiteConfig = cached || {
      site_name: 'Math Instructor',
      site_description: 'منصة تعليمية متخصصة في شرح الرياضيات',
      contact: {
        email: 'info@mathinstructor.test',
        phone: '01012345678',
      },
      registration_enabled: true,
      social: {
        facebook: 'https://facebook.com',
        youtube: 'https://youtube.com',
        instagram: 'https://instagram.com',
      },
    };

    try {
      const response = await apiClient.get<SiteConfig>('/public/site-config');
      if (response) {
        siteConfigCache = { data: response, time: Date.now() };
        setStoredSiteConfig(response);
        return response;
      }
    } catch (error) {
      console.warn('[cmsService] Failed to load site config, using fallback', error);
    }

    return fallbackConfig;
  },

  /**
   * Helper to extract a section by key from a page payload
   */
  getSection<T = Record<string, any>>(page: CmsPagePayload | null, key: string): T | null {
    if (!page || !page.sections) return null;
    const section = page.sections.find((s) => s.key === key && s.enabled !== false);
    return section ? (section.data as T) : null;
  },
};
