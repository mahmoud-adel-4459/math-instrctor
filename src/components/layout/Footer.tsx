import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Video,
  Send,
  Globe,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { SUBJECT_BRANCHES, INSTRUCTOR_NAME, INSTRUCTOR_TITLE, PLATFORM_MOTTO } from '../../utils/constants';
import { cmsService, type SiteConfig } from '../../services/cms.service';

export const Footer: React.FC = () => {
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);

  useEffect(() => {
    cmsService.getSiteConfig().then((cfg) => {
      if (cfg) setSiteConfig(cfg);
    });
  }, []);

  const phone = siteConfig?.contact?.phone || '01012345678';
  const email = siteConfig?.contact?.email || 'info@mathinstructor.test';
  const facebookUrl = siteConfig?.social?.facebook || '#';
  const youtubeUrl = siteConfig?.social?.youtube || '#';
  const instagramUrl = siteConfig?.social?.instagram || '#';

  return (
    <footer className="bg-slate-950 border-t border-blue-900/40 pt-16 pb-8 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand Info & Instructor Bio */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center">
              <Link to="/">
                <img
                  src="/logo.png"
                  alt="ARTMEL Math with Kabil"
                  className="h-16 sm:h-20 w-auto object-contain rounded-2xl"
                />
              </Link>
            </div>

            <p className="text-sm leading-relaxed text-slate-300">
              المنصة التعليمية الأولى المتخصصة في شرح وتسهيل علوم الرياضيات للثانوية العامة والإعدادية، تحت إشراف{' '}
              <strong className="text-blue-400 font-bold">{INSTRUCTOR_NAME}</strong> — {INSTRUCTOR_TITLE}.
            </p>
            <p className="text-xs text-cyan-300 font-semibold italic">
              «{PLATFORM_MOTTO}»
            </p>

            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-emerald-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>مناهج رسمية ومعتمدة</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-amber-400">
                <Award className="w-4 h-4 text-amber-400" />
                <span>نظام البابل شيت 2026</span>
              </div>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">صفحات المنصة</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>الرئيسية</span>
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>الكورسات والمنهج</span>
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>الكورسات والاختبارات</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                  <span>عن المنصة والأستاذ</span>
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                  <span>الأسئلة الشائعة</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Subject Branches Column */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">فروع الرياضيات</h4>
            <ul className="space-y-2.5 text-xs">
              {SUBJECT_BRANCHES.map((b) => (
                <li key={b.id}>
                  <Link
                    to="/courses"
                    className="hover:text-blue-400 transition-colors flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>{b.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Support Column */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">التواصل والدعم الفني</h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-center gap-3 text-slate-300">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span dir="ltr">{phone}</span>
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{email}</span>
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span>القاهرة، جمهورية مصر العربية</span>
              </li>
            </ul>

            <div className="pt-2">
              <p className="text-xs font-semibold text-slate-400 mb-2">تابعنا على شبكات التواصل:</p>
              <div className="flex items-center gap-2">
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-red-600/20 hover:text-red-400 text-slate-400 border border-slate-800 transition-colors"
                  title="يوتيوب"
                >
                  <Video className="w-4 h-4" />
                </a>
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-blue-600/20 hover:text-blue-400 text-slate-400 border border-slate-800 transition-colors"
                  title="فيسبوك"
                >
                  <Globe className="w-4 h-4" />
                </a>
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-pink-600/20 hover:text-pink-400 text-slate-400 border border-slate-800 transition-colors"
                  title="انستجرام"
                >
                  <Send className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="flex items-center gap-1.5 flex-wrap">
            <span>© {new Date().getFullYear()} منصة ماث وذ قابيل (Math with Kabil). جميع الحقوق محفوظة.</span>
            <span>• تم التصميم والتطوير بواسطة</span>
            <a
              href="https://www.qeematech.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 font-bold hover:text-cyan-300 hover:underline transition-colors"
            >
              قيمة تك
            </a>
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <Link to="/privacy" className="hover:text-cyan-400 transition-colors">سياسة الخصوصية</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-cyan-400 transition-colors">شروط الاستخدام</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-cyan-400 transition-colors">تواصل معنا</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
