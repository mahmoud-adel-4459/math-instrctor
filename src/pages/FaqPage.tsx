import React, { useState } from 'react';
import {
  HelpCircle,
  Search,
  ChevronDown,
  MessageCircle,
  BookOpen,
  FileCheck2,
  CreditCard,
  UserCheck,
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';

interface FaqItem {
  id: string;
  category: 'subscription' | 'videos' | 'exams' | 'support';
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq_1',
    category: 'subscription',
    question: 'كيف يمكنني الاشتراك في كورسات مادة الرياضيات؟',
    answer: 'يمكنك الاشتراك بسهولة من خلال تصفح صفحة "الكورسات"، اختيار الصف الدراسي وفرع الرياضيات المطلوب، ثم الضغط على زر "دخول الكورس" واتباع خطوات تفعيل الاشتراك.',
  },
  {
    id: 'faq_2',
    category: 'subscription',
    question: 'ما هي طرق الدفع المتاحة على المنصة؟',
    answer: 'نوفر طرق دفع إلكترونية متعددة وآمنة تناسب الجميع: فودافون كاش (Vodafone Cash)، بطاقات المشتريات (Visa / Mastercard)، وفوري (Fawry).',
  },
  {
    id: 'faq_3',
    category: 'videos',
    question: 'هل يمكنني إعادة مشاهدة حصص الفيديو أكثر من مرة؟',
    answer: 'نعم بالتأكيد! بمجرد اشتراكك في الكورس، تتاح لك فيديوهات الشرح بجودة HD لمشاهدتها في أي وقت وأكثر من مرة طوال العام الدراسي بدون حد أقصى.',
  },
  {
    id: 'faq_4',
    category: 'videos',
    question: 'هل توجد مذكرات وملفات PDF قابلة للطباعة مع الشرح؟',
    answer: 'نعم، كل درس يحتوي على مذكرة شرح ملخصة بصيغة PDF، بالإضافة إلى ملخصات القوانين ومذكرات تمارين البابل شيت التي يمكنك تحميلها وطباعتها بسهولة.',
  },
  {
    id: 'faq_5',
    category: 'exams',
    question: 'كيف يتم تصحيح الامتحانات الالكترونية على المنصة؟',
    answer: 'تتم عملية التصحيح فورياً وآلياً بنظام البابل شيت الحديث، وتظهر لك النتيجة النهائية والدرجة مع استعراض خطوات الحل النموذجية وتفسير الإجابات الصحيحة لكل سؤال.',
  },
  {
    id: 'faq_6',
    category: 'exams',
    question: 'هل يحق لي إعادة الامتحان أكثر من مرة؟',
    answer: 'نعم، يتيح لك النظام 3 محاولات لكل امتحان لتتمكن من مراجعة أخطائك وتحسين درجتك والوصول للتقفيل بنسبة 100%.',
  },
  {
    id: 'faq_7',
    category: 'support',
    question: 'كيف يمكن لولي الأمر متابعة مستوى الطالب ودرجاته؟',
    answer: 'يوفر نظام لوحة المتابعة إحصائيات دقيقة لعدد ساعات المشاهدة ودرجات الامتحانات، كما يمكن إرسال تقارير دورية عبر الواتساب لولي الأمر لمتابعة الالتزام.',
  },
  {
    id: 'faq_8',
    category: 'support',
    question: 'ماذا أفعل إذا واجهت مسألة صعبة لم أستطع فهمها؟',
    answer: 'تحت كل فيديو يوجد قسم خاص باستفسارات الطلاب، حيث يمكنك ترك سؤالك وسيقوم الأستاذ قابيل أو فريق المساعدين بالإجابة الشافية عليك.',
  },
];

export const FaqPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>('faq_1');

  const categories = [
    { id: 'all', label: 'جميع الأسئلة', icon: HelpCircle },
    { id: 'subscription', label: 'الاشتراك والدفع', icon: CreditCard },
    { id: 'videos', label: 'الشرح والمذكرات', icon: BookOpen },
    { id: 'exams', label: 'الامتحانات والتصحيح', icon: FileCheck2 },
    { id: 'support', label: 'الدعم ومتابعة الطالب', icon: UserCheck },
  ];

  const filteredFaqs = FAQ_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header Banner */}
      <div className="text-center space-y-4">
        <Badge variant="cyan">مركز المساعدة والإرشادات</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          الأسئلة الشائعة والإجابات عنها
        </h1>
        <p className="text-sm text-slate-300 max-w-xl mx-auto">
          إليك إجابات شاملة لأكثر الاستفسارات تكراراً حول الكورسات، طريقة الشرح، نظام الامتحانات، ووسائل الدفع.
        </p>
      </div>

      {/* Search Input & Category Filters */}
      <div className="glass-panel p-6 rounded-3xl border border-blue-900/40 space-y-6">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="ابحث عن سؤالك هنا..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-blue-900/40 text-sm rounded-2xl pl-4 pr-11 py-3 text-white focus:outline-none focus:border-blue-500 placeholder:text-slate-500"
          />
          <Search className="w-5 h-5 text-blue-400 absolute right-4 top-3.5 pointer-events-none" />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 scale-105'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4 text-blue-400" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Accordion Questions List */}
      <div className="space-y-4">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => {
            const isExpanded = expandedId === faq.id;
            return (
              <div
                key={faq.id}
                className="glass-panel rounded-2xl border border-blue-900/30 overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleExpand(faq.id)}
                  className="w-full p-5 flex items-center justify-between text-right hover:bg-slate-800/40 transition-colors"
                >
                  <span className="text-sm font-bold text-white flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-xs shrink-0">
                      ؟
                    </span>
                    <span>{faq.question}</span>
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-blue-400 transition-transform duration-300 shrink-0 ${
                      isExpanded ? 'rotate-180 text-cyan-400' : ''
                    }`}
                  />
                </button>

                {isExpanded && (
                  <div className="px-6 pb-5 pt-1 border-t border-slate-800/60 text-xs text-slate-300 leading-relaxed animate-in fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="glass-panel p-12 text-center text-slate-400 rounded-3xl">
            لم يتم العثور على أسئلة تطابق بحثك.
          </div>
        )}
      </div>

      {/* Support CTA Box */}
      <div className="glass-panel rounded-3xl p-8 border border-blue-900/50 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-right">
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-white">لم تجد إجابة لسؤالك؟</h3>
          <p className="text-xs text-slate-300">فريق الدعم المباشر متواجد للإجابة على كافة استفساراتك طوال اليوم.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a href="https://wa.me/201012345678" target="_blank" rel="noreferrer">
            <Button variant="primary" size="md" icon={MessageCircle}>
              تواصل عبر الواتساب
            </Button>
          </a>
        </div>
      </div>

    </div>
  );
};
