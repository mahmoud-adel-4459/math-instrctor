import React, { useEffect, useState } from 'react';
import { CheckCircle2, BookOpen, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../../seo/SEOHead';
import { NotificationsService } from '../../services/notifications.service';
import type { Notification } from '../../types';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    NotificationsService.getNotifications()
      .then((res) => setNotifications(res.data))
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, []);

  const markAllRead = async () => {
    await NotificationsService.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <>
      <SEOHead title="مركز الإشعارات" description="عرض جميع التنبيهات وإشعارات الكورسات والامتحانات." noindex />

      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white">مركز الإشعارات والتنبيهات</h1>
            <p className="text-xs text-slate-400 mt-1">تنبيهات فورية بإضافة الدروس الجديدة وتحديثات الكورسات</p>
          </div>

          <button
            onClick={() => void markAllRead()}
            className="text-xs text-cyan-400 font-bold hover:underline flex items-center gap-1"
          >
            <CheckCircle2 className="w-4 h-4" /> تحديد الكل كـ مقروء
          </button>
        </div>

        {loading ? (
          <div className="text-center text-slate-400 py-12">جاري تحميل الإشعارات...</div>
        ) : notifications.length === 0 ? (
          <div className="glass-panel p-10 rounded-3xl text-center text-slate-400">لا توجد إشعارات حالياً</div>
        ) : (
          <div className="space-y-4">
            {notifications.map((item) => (
              <div
                key={item.id}
                className={`glass-panel p-5 rounded-2xl border transition-all ${
                  !item.isRead
                    ? 'border-blue-500/40 bg-blue-950/30 glow-blue'
                    : 'border-blue-900/30 opacity-80'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      item.type === 'course'
                        ? 'bg-blue-600/20 text-blue-400'
                        : 'bg-amber-600/20 text-amber-400'
                    }`}
                  >
                    {item.type === 'course' ? <BookOpen className="w-5 h-5" /> : <Award className="w-5 h-5" />}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white">{item.title}</h3>
                      <span className="text-[11px] text-slate-400">{item.createdAt}</span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{item.message}</p>

                    {item.link && (
                      <div className="pt-2">
                        <Link to={item.link} className="text-xs text-blue-400 font-bold hover:underline">
                          عرض التفاصيل ←
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
