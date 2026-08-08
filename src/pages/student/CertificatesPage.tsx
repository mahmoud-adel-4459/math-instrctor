import React, { useEffect, useState } from 'react';
import { Award, Download, Calendar, CheckCircle } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { SEOHead } from '../../seo/SEOHead';
import { CertificatesService } from '../../services/certificates.service';
import type { Certificate } from '../../types';

export const CertificatesPage: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    CertificatesService.getStudentCertificates().then((res) => {
      if (res.data) setCertificates(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <SEOHead title="الشهادات المكتسبة" description="استعرض وحمّل شهادات الإتمام المكتسبة في مادة الرياضيات." noindex />

      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-black text-white">شهادات إتمام الكورسات</h1>
          <p className="text-xs text-slate-400 mt-1">شهادات موثوقة وموثقة بإتمام المناهج والامتحانات النهائية</p>
        </div>

        {loading ? (
          <div className="text-center text-slate-400 py-12">جاري تحميل الشهادات...</div>
        ) : certificates.length === 0 ? (
          <div className="glass-panel p-10 rounded-3xl text-center text-slate-400">
            لا توجد شهادات مكتسبة حتى الآن. أكمل الكورسات والامتحانات للحصول عليها!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="glass-panel rounded-3xl p-6 border border-amber-500/30 flex flex-col justify-between space-y-6 glow-cyan"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <Award className="w-7 h-7" />
                    </div>
                    <Badge variant="cyan">شهادة رسمية</Badge>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white mb-1">{cert.courseTitle}</h3>
                    <p className="text-xs text-slate-400">اسم الطالب: {cert.studentName}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs flex justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      تاريخ الإصدار: {cert.issueDate}
                    </span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      التقدير: {cert.grade}
                    </span>
                  </div>
                </div>

                <Button variant="primary" fullWidth size="md" icon={Download} iconPosition="left">
                  تحميل الشهادة (PDF)
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
