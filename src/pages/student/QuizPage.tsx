import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, HelpCircle, CheckCircle2, XCircle, ArrowLeft, RotateCcw } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { SEOHead } from '../../seo/SEOHead';
import { QuizzesService } from '../../services/quizzes.service';
import type { Quiz, QuizAttempt } from '../../types';

export const QuizPage: React.FC = () => {
  const { courseSlug, quizId } = useParams<{ courseSlug: string; quizId: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [status, setStatus] = useState<'idle' | 'running' | 'completed'>('idle');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState<QuizAttempt | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    QuizzesService.getQuizById(quizId || 'quiz_calc_1').then((res) => {
      if (res.data) {
        setQuiz(res.data);
        setTimeLeft(res.data.durationMinutes * 60);
      }
      setLoading(false);
    });
  }, [quizId]);

  // Timer countdown hook
  useEffect(() => {
    if (status !== 'running' || !quiz) return;
    if (timeLeft <= 0) {
      const timeSpent = quiz.durationMinutes * 60;
      QuizzesService.submitQuizAttempt(quiz.id, answers, timeSpent).then((res) => {
        if (res.data) {
          setResult(res.data);
          setStatus('completed');
        }
      });
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [status, timeLeft, quiz, answers]);

  if (loading) return <div className="text-center py-12 text-slate-400">جاري تحميل الاختبار...</div>;
  if (!quiz) return <div className="text-center py-12 text-slate-400">الاختبار غير موجود</div>;

  const handleStart = () => {
    setStatus('running');
  };

  const handleOptionSelect = (optionId: string) => {
    const qId = quiz.questions[currentIndex].id;
    setAnswers((prev) => ({ ...prev, [qId]: optionId }));
  };

  const handleSubmit = async () => {
    const timeSpent = quiz.durationMinutes * 60 - timeLeft;
    const res = await QuizzesService.submitQuizAttempt(quiz.id, answers, timeSpent);
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

  // 1. IDLE / START SCREEN
  if (status === 'idle') {
    return (
      <div className="max-w-2xl mx-auto py-12 space-y-6">
        <SEOHead title={`${quiz.title} — بداية الاختبار`} noindex />

        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-blue-900/40 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center mx-auto glow-cyan">
            <HelpCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <Badge variant="cyan">كويز تفاعلي</Badge>
            <h1 className="text-2xl font-black text-white">{quiz.title}</h1>
            <p className="text-xs text-slate-300">{quiz.description}</p>
          </div>

          <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block mb-1">عدد الأسئلة</span>
              <span className="font-bold text-white text-sm">{quiz.questionsCount} أسئلة</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">الزمن المتاح</span>
              <span className="font-bold text-white text-sm">{quiz.durationMinutes} دقيقة</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">درجة النجاح</span>
              <span className="font-bold text-emerald-400 text-sm">{quiz.passPercentage}%</span>
            </div>
          </div>

          <Button variant="primary" size="lg" fullWidth onClick={handleStart}>
            ابدأ الكويز الآن
          </Button>
        </div>
      </div>
    );
  }

  // 2. COMPLETED / RESULT SCREEN
  if (status === 'completed' && result) {
    return (
      <div className="max-w-2xl mx-auto py-12 space-y-6">
        <SEOHead title={`${quiz.title} — النتيجة`} noindex />

        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-blue-900/40 text-center space-y-6 shadow-2xl">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto text-3xl font-extrabold ${
              result.passed
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 glow-cyan'
                : 'bg-red-500/20 text-red-400 border border-red-500/40'
            }`}
          >
            {result.percentage}%
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white">
              {result.passed ? 'تهانينا! لقد اجتزت الكويز بنجاح 🎉' : 'حاول مرة أخرى لتحسين درجتك'}
            </h2>
            <p className="text-xs text-slate-400">
              حصلت على {result.score} من {result.totalPoints} درجة
            </p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button variant="outline" icon={RotateCcw} onClick={() => setStatus('idle')}>
              إعادة الكويز
            </Button>
            <Link to={`/my-courses/${courseSlug}`}>
              <Button variant="primary" icon={ArrowLeft} iconPosition="left">
                العودة للدروس
              </Button>
            </Link>
          </div>

          {/* Detailed Question Review */}
          <div className="pt-6 border-t border-slate-800 text-right space-y-4">
            <h3 className="text-sm font-bold text-white">مراجعة إجابات الكويز:</h3>
            <div className="space-y-3">
              {quiz.questions.map((q, idx) => {
                const selectedOpt = result.answers[q.id];
                const isCorrect = selectedOpt === q.correctOptionId;
                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-2xl border text-xs space-y-2 ${
                      isCorrect
                        ? 'bg-emerald-950/20 border-emerald-500/30'
                        : 'bg-red-950/20 border-red-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">
                        س{idx + 1}: {q.text}
                      </span>
                      {isCorrect ? (
                        <span className="text-emerald-400 flex items-center gap-1 font-bold">
                          <CheckCircle2 className="w-4 h-4" /> إجابة صحيحة
                        </span>
                      ) : (
                        <span className="text-red-400 flex items-center gap-1 font-bold">
                          <XCircle className="w-4 h-4" /> إجابة خاطئة
                        </span>
                      )}
                    </div>
                    {q.explanation && (
                      <p className="text-slate-400 text-[11px] pt-1 border-t border-slate-800/60">
                        <strong className="text-cyan-400">الشرح: </strong> {q.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. RUNNING QUIZ SCREEN
  const currentQuestion = quiz.questions[currentIndex];
  const selectedOptionId = answers[currentQuestion.id];

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      <SEOHead title={`${quiz.title} — السؤال ${currentIndex + 1}`} noindex />

      {/* Header Info */}
      <div className="glass-panel p-4 rounded-2xl border border-blue-900/30 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-white">{quiz.title}</h2>
          <p className="text-xs text-slate-400">
            سؤال {currentIndex + 1} من {quiz.questions.length}
          </p>
        </div>

        <div className="flex items-center gap-2 text-amber-400 font-mono text-sm font-extrabold bg-slate-900/80 px-3 py-1.5 rounded-xl border border-amber-500/30">
          <Clock className="w-4 h-4" />
          <span>{formatTimer(timeLeft)}</span>
        </div>
      </div>

      {/* Question Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-blue-900/40 space-y-6 shadow-xl">
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
                    ? 'bg-blue-600/90 border-blue-400 text-white shadow-lg shadow-blue-600/30 glow-blue'
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

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <Button
            variant="outline"
            size="sm"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => prev - 1)}
          >
            السابق
          </Button>

          {currentIndex < quiz.questions.length - 1 ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setCurrentIndex((prev) => prev + 1)}
            >
              التالي
            </Button>
          ) : (
            <Button variant="cyan" size="sm" onClick={handleSubmit}>
              إنهاء وتسليم الكويز
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
