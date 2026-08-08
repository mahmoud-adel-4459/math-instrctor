import React, { useEffect, useState } from 'react';
import { FileCheck, Award, Calendar, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { SEOHead } from '../../seo/SEOHead';
import { QuizzesService } from '../../services/quizzes.service';
import { ExamsService } from '../../services/exams.service';
import type { QuizAttempt, ExamAttempt } from '../../types';

export const ResultsPage: React.FC = () => {
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [examAttempts, setExamAttempts] = useState<ExamAttempt[]>([]);
  const [filter, setFilter] = useState<'all' | 'quizzes' | 'exams'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      QuizzesService.getStudentQuizAttempts(),
      ExamsService.getStudentExamAttempts(),
    ]).then(([qRes, eRes]) => {
      if (qRes.data) setQuizAttempts(qRes.data);
      if (eRes.data) setExamAttempts(eRes.data);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <SEOHead title="سجل نتائج الاختبارات" description="عرض جميع نتائج الكويزات والامتحانات السابقة للطلاب." noindex />

      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white">سجل النتائج والاختبارات</h1>
            <p className="text-xs text-slate-400 mt-1">تتبع مستواك ونتائج الكويزات والامتحانات التي أديتها</p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-2xl border border-blue-900/30">
            <button
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                filter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setFilter('quizzes')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                filter === 'quizzes' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              الكويزات
            </button>
            <button
              onClick={() => setFilter('exams')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                filter === 'exams' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              الامتحانات
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-slate-400 py-12">جاري تحميل النتائج...</div>
        ) : (
          <div className="space-y-4">
            {(filter === 'all' || filter === 'exams') &&
              examAttempts.map((attempt) => (
                <div
                  key={attempt.id}
                  className="glass-panel p-5 rounded-2xl border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center shrink-0">
                      <FileCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="cyan">امتحان شامل</Badge>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {attempt.completedAt}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white">{attempt.examTitle}</h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right sm:text-left">
                    <div>
                      <div className="text-lg font-black text-white">{attempt.percentage}%</div>
                      <span className="text-xs text-slate-400">
                        ({attempt.score} من {attempt.totalPoints})
                      </span>
                    </div>

                    {attempt.passed ? (
                      <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> ناجح
                      </span>
                    ) : (
                      <span className="p-2 rounded-xl bg-red-500/20 text-red-400 font-bold text-xs flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> راسم
                      </span>
                    )}
                  </div>
                </div>
              ))}

            {(filter === 'all' || filter === 'quizzes') &&
              quizAttempts.map((attempt) => (
                <div
                  key={attempt.id}
                  className="glass-panel p-5 rounded-2xl border border-blue-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="primary">كويز وحدة</Badge>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {attempt.completedAt}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white">{attempt.quizTitle}</h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-lg font-black text-white">{attempt.percentage}%</div>
                      <span className="text-xs text-slate-400">
                        ({attempt.score} من {attempt.totalPoints})
                      </span>
                    </div>

                    {attempt.passed ? (
                      <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> مجتاز
                      </span>
                    ) : (
                      <span className="p-2 rounded-xl bg-red-500/20 text-red-400 font-bold text-xs flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> لم يجتز
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </>
  );
};
