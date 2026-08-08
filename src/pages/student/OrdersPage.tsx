import React, { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { SEOHead } from '../../seo/SEOHead';
import { OrdersService } from '../../services/orders.service';
import { formatCurrency } from '../../utils/formatters';
import type { Order } from '../../types';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    OrdersService.getStudentOrders().then((res) => {
      if (res.data) setOrders(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <SEOHead title="طلبات الشراء والمعاملات" description="عرض سجل المعاملات المالية وفواتير الاشتراك في المنصة." noindex />

      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-black text-white">طلبات الشراء والاشتراكات</h1>
          <p className="text-xs text-slate-400 mt-1">عرض جميع المعاملات المالية وفواتير الاشتراك في الكورسات</p>
        </div>

        {loading ? (
          <div className="text-center text-slate-400 py-12">جاري تحميل المعاملات...</div>
        ) : (
          <div className="glass-panel rounded-3xl border border-blue-900/40 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-bold">
                  <tr>
                    <th className="p-4">رقم الطلب</th>
                    <th className="p-4">الكورس التعليمي</th>
                    <th className="p-4">تاريخ الطلب</th>
                    <th className="p-4">طريقة الدفع</th>
                    <th className="p-4">المبلغ</th>
                    <th className="p-4">حالة الطلب</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200 font-semibold">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-4 font-mono dir-ltr text-blue-400 font-bold">{order.id}</td>
                      <td className="p-4 font-bold text-white">{order.courseTitle}</td>
                      <td className="p-4 text-slate-400">{order.createdAt}</td>
                      <td className="p-4 text-slate-300">{order.paymentMethod}</td>
                      <td className="p-4 font-bold text-white">{formatCurrency(order.amount)}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> مكتمل ومدفوع
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
