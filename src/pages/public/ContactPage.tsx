import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { SEOHead } from '../../seo/SEOHead';
import { cmsService, type SiteConfig } from '../../services/cms.service';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);

  useEffect(() => {
    cmsService.getSiteConfig().then((cfg) => {
      if (cfg) setSiteConfig(cfg);
    });
  }, []);

  const supportPhone = siteConfig?.contact?.phone || '01012345678';
  const supportEmail = siteConfig?.contact?.email || 'support@mathinstructor.test';
  const whatsappNumber = supportPhone.replace(/[^0-9]/g, '').replace(/^0/, '20');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = [
      `الاسم: ${formData.name}`,
      `الهاتف: ${formData.phone}`,
      `البريد: ${formData.email}`,
      '',
      formData.message,
    ].join('\n');
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <SEOHead
        title="تواصل معنا"
        description="تواصل مع أستاذ الرياضيات وفريق الدعم الفني والاستفسارات الخاصة بالمنصة والكورسات."
        canonical="https://math-instrctor.vercel.app/contact"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="cyan">الدعم المباشر</Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">تواصل معنا واستفسر عن الكورسات</h1>
          <p className="text-sm text-slate-400">
            يسعدنا الإجابة على جميع استفسارات الطلاب وأولياء الأمور ومساعدتكم في اختيار الكورس المناسب.
            الرسالة تُفتح عبر واتساب حتى يصل الاستفسار مباشرة للدعم.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-3xl border border-blue-900/30 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white mb-1">الهاتف والواتساب</h3>
                <p className="text-xs text-slate-400 dir-ltr text-right">{supportPhone}</p>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-blue-900/30 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white mb-1">البريد الإلكتروني</h3>
                <a href={`mailto:${supportEmail}`} className="text-xs text-blue-400 hover:underline">
                  {supportEmail}
                </a>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-blue-900/30 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white mb-1">المقر والمواعيد</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  القاهرة، جمهورية مصر العربية <br />
                  يومياً من 9:00 صباحاً حتى 10:00 مساءً
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 glass-panel p-8 rounded-3xl border border-blue-900/40 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300">الاسم بالكامل</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="أحمد علي"
                    className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300">رقم الهاتف / الواتس</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="01012345678"
                    className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">البريد الإلكتروني</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ahmed@example.com"
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">نص الرسالة أو الاستفسار</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="اكتب استفسارك هنا..."
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <Button variant="primary" size="lg" fullWidth icon={MessageCircle} iconPosition="left">
                متابعة عبر واتساب
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
