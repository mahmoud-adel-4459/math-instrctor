import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, AlertTriangle, Flag, RotateCcw, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { SEOHead } from '../../seo/SEOHead';
import { ExamsService } from '../../services/exams.service';
import type { Exam, ExamAttempt } from '../../types';

export const ExamPage: React.FC = () => {
  const { courseSlug, examId } = useParams<{ courseSlug: string; examId: string }>();
  const [exam, setExam] = useState<Exam | null>(null);
  const [status, setStatus] = useState<'start_screen' | 'running' | 'completed'>('start_screen');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flaggedIds, setFlaggedIds] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [result, setResult] = useState<ExamAttempt | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ExamsService.getExamById(examId || 'exam_calc_final').then((res) => {
      if (res.data) {
        setExam(res.data);
        setTimeLeft(res.data.durationMinutes * 60);
      }
      setLoading(false);
    });
  }, [examId]);

  // Exam timer
  useEffect(() => {
    if (status !== 'running' || !exam) return;
    if (timeLeft <= 0) {
      setShowConfirmModal(false);
      const timeSpent = exam.durationMinutes * 60;
      ExamsService.submitExamAttempt(exam.id, answers, timeSpent).then((res) => {
        if (res.data) {
          setResult(res.data);
          setStatus('completed');
        }
      });
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [status, timeLeft, exam, answers]);

  if (loading) return <div className="text-center py-12 text-slate-400">جاري تحميل الامتحان...</div>;
  if (!exam) return <div className="text-center py-12 text-slate-400">الامتحان غير موجود</div>;

  const handleStartExam = () => {
    setStatus('running');
  };

  const handleOptionSelect = (optionId: string) => {
    const qId = exam.questions[currentIndex].id;
    setAnswers((prev) => ({ ...prev, [qId]: optionId }));
  };

  const toggleFlag = (qId: string) => {
    setFlaggedIds((prev) => (prev.includes(qId) ? prev.filter((id) => id !== qId) : [...prev, qId]));
  };

  const handleFinalSubmit = async () => {
    setShowConfirmModal(false);
    const timeSpent = exam.durationMinutes * 60 - timeLeft;
    const res = await ExamsService.submitExamAttempt(exam.id, answers, timeSpent);
    if (res.data) {
      setResult(res.data);
      setStatus('completed');
    }
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // 1. START SCREEN
  if (status === 'start_screen') {
    return (
      <div className="max-w-3xl mx-auto py-10 space-y-6">
        <SEOHead title={`${exam.title} — البداية`} noindex />

        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-purple-500/30 text-center space-y-6 shadow-2xl glow-cyan">
          <div className="w-20 h-20 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white">{exam.title}</h1>
            <p className="text-xs text-slate-300 leading-relaxed">{exam.description}</p>
          </div>

          <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block mb-1">الأسئلة</span>
              <span className="font-bold text-white text-sm">{exam.questionsCount} سؤالاً</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">الزمن</span>
              <span className="font-bold text-white text-sm">{exam.durationMinutes} دقيقة</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">نسبة النجاح</span>
              <span className="font-bold text-emerald-400 text-sm">{exam.passPercentage}%</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-300 text-right space-y-1">
            <h4 className="font-bold">تعليمات هامة قبل البداية:</h4>
            <ul className="list-disc list-inside space-y-1 opacity-90">
              <li>سيتم التسليم التلقائي للامتحان فور انتهاء الوقت المحدد.</li>
              <li>يمكنك التعديل والانتقال بين جميع الأسئلة طوال فترة الامتحان.</li>
            </ul>
          </div>

          <Button variant="primary" size="lg" fullWidth onClick={handleStartExam}>
            ابدأ الامتحان الآن
          </Button>
        </div>
      </div>
    );
  }

  // 2. COMPLETED / RESULTS SCREEN
  if (status === 'completed' && result) {
    return (
      <div className="max-w-3xl mx-auto py-10 space-y-6">
        <SEOHead title={`${exam.title} — نيجية الامتحان`} noindex />

        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-blue-900/40 text-center space-y-6 shadow-2xl">
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto text-4xl font-extrabold ${
              result.passed
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 glow-cyan'
                : 'bg-red-500/20 text-red-400 border border-red-500/40'
            }`}
          >
            {result.percentage}%
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white">
              {result.passed ? 'ممتاز! تم اجتياز الامتحان بنجاح 🎓' : 'للأسف لم تتجاوز الامتحان هذه المرة'}
            </h2>
            <p className="text-xs text-slate-400">
              مجموع الدرجات: {result.score} من {result.totalPoints}
            </p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button variant="outline" icon={RotateCcw} onClick={() => setStatus('start_screen')}>
              إعادة الامتحان
            </Button>
            <Link to={`/my-courses/${courseSlug}`}>
              <Button variant="primary" icon={ArrowLeft} iconPosition="left">
                العودة للدروس
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. RUNNING EXAM SCREEN
  const currentQuestion = exam.questions[currentIndex];
  const selectedOptionId = answers[currentQuestion.id];
  const isFlagged = flaggedIds.includes(currentQuestion.id);
  const answeredCount = Object.keys(answers).length;

  return (
    <>
      <SEOHead title={`${exam.title} — جارِ الحل`} noindex />

      <div className="space-y-6">
        {/* Exam Bar */}
        <div className="glass-panel p-4 rounded-2xl border border-purple-900/40 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">{exam.title}</h2>
            <p className="text-xs text-slate-400">
              المجاب عنها: {answeredCount} من {exam.questions.length} أسئلة
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-base font-extrabold bg-slate-900/90 px-4 py-2 rounded-xl border border-amber-500/40 glow-cyan">
              <Clock className="w-5 h-5 animate-pulse" />
              <span>{formatTimer(timeLeft)}</span>
            </div>

            <Button variant="cyan" size="sm" onClick={() => setShowConfirmModal(true)}>
              إنهاء الامتحان
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Question Stage */}
          <div className="lg:col-span-3 space-y-6">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-blue-900/40 space-y-6 shadow-xl relative">
              {/* Flag Toggle */}
              <button
                onClick={() => toggleFlag(currentQuestion.id)}
                className={`absolute top-6 left-6 p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  isFlagged
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    : 'text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <Flag className="w-4 h-4" />
                <span>{isFlagged ? 'تم تمييز السؤال' : 'تمييز للمراجعة'}</span>
              </button>

              <span className="text-xs text-blue-400 font-bold block">
                السؤال رقم {currentIndex + 1} ({currentQuestion.points} درجات):
              </span>

              <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                {currentQuestion.text}
              </h3>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedOptionId === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleOptionSelect(option.id)}
                      className={`w-full p-4 rounded-2xl border text-right text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-blue-600/90 border-blue-400 text-white shadow-lg glow-blue'
                          : 'bg-slate-900/60 border-slate-800 text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <span>{option.text}</span>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-white bg-white/20' : 'border-slate-600'
                        }`}
                      >
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((prev) => prev - 1)}
                >
                  السابق
                </Button>

                {currentIndex < exam.questions.length - 1 ? (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setCurrentIndex((prev) => prev + 1)}
                  >
                    التالي
                  </Button>
                ) : (
                  <Button variant="cyan" size="sm" onClick={() => setShowConfirmModal(true)}>
                    تسليم الامتحان
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Question Palette Sidebar */}
          <div className="space-y-4">
            <div className="glass-panel p-5 rounded-3xl border border-blue-900/30 space-y-4">
              <h4 className="text-xs font-bold text-white">جدول أسئلة الامتحان:</h4>
              <div className="grid grid-cols-4 gap-2">
                {exam.questions.map((q, idx) => {
                  const isAnswered = !!answers[q.id];
                  const isCur = idx === currentIndex;
                  const isFlag = flaggedIds.includes(q.id);

                  let bgClass = 'bg-slate-900 text-slate-400 border-slate-800';
                  if (isAnswered) bgClass = 'bg-blue-600 text-white border-blue-500';
                  if (isFlag) bgClass = 'bg-amber-500/20 text-amber-400 border-amber-500/40';
                  if (isCur) bgClass += ' ring-2 ring-cyan-400';

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-10 rounded-xl font-bold text-xs border flex items-center justify-center transition-all ${bgClass}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exit Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="تأكيد تسليم الامتحان"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setShowConfirmModal(false)}>
              إلغاء
            </Button>
            <Button variant="primary" size="sm" onClick={handleFinalSubmit}>
              تأكيد إنهاء الامتحان
            </Button>
          </>
        }
      >
        <p>
          هل أنت متأكد من رغبتك في تسليم كتاب الامتحان؟ <br />
          لقد أجبت عن <strong className="text-cyan-400">{answeredCount}</strong> من أصل{' '}
          <strong>{exam.questions.length}</strong> أسئلة.
        </p>
      </Modal>
    </>
  );
};
