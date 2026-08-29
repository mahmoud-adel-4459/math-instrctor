import React, { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Clock,
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  RotateCcw,
  Image as ImageIcon,
  Upload,
  FileText,
  Trash2,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { SEOHead } from '../../seo/SEOHead';
import { QuizzesService } from '../../services/quizzes.service';
import { apiClient } from '../../services/apiClient';
import { MathText } from '../../components/common/MathText';
import type { Quiz, QuizAttempt } from '../../types';

export const QuizPage: React.FC = () => {
  const { courseSlug, quizId } = useParams<{ courseSlug: string; quizId: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [status, setStatus] = useState<'idle' | 'running' | 'completed'>('idle');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState<QuizAttempt | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (!quizId) {
      setLoading(false);
      return;
    }
    QuizzesService.getQuizById(quizId)
      .then((res) => {
        if (res.data) {
          setQuiz(res.data);
          setTimeLeft(res.data.durationMinutes * 60);
        }
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'تعذر تحميل الاختبار'))
      .finally(() => setLoading(false));
  }, [quizId]);

  const finishQuiz = useCallback(async () => {
    if (!attemptId || !quiz) return;
    const timeSpent = quiz.durationMinutes * 60 - timeLeft;
    await QuizzesService.saveAnswers(attemptId, answers);
    const res = await QuizzesService.submitAttempt(attemptId, {
      quizId: quiz.id,
      quizTitle: quiz.title,
      courseSlug: courseSlug || '',
      answers,
      timeSpentSeconds: timeSpent,
    });
    if (res.data) {
      setResult(res.data);
      setStatus('completed');
    }
  }, [attemptId, quiz, answers, timeLeft, courseSlug]);

  // Timer countdown hook
  useEffect(() => {
    if (status !== 'running' || !quiz) return;
    if (timeLeft <= 0) {
      void finishQuiz();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [status, timeLeft, quiz, finishQuiz]);

  if (loading) return <div className="text-center py-12 text-slate-400">جاري تحميل الاختبار...</div>;
  if (!quiz) return <div className="text-center py-12 text-slate-400">الاختبار غير موجود</div>;

  const handleStart = async () => {
    setError('');
    try {
      const started = await QuizzesService.startAttempt(quiz.id);
      setAttemptId(started.data.attemptId);
      if (started.data.timeRemainingSeconds != null) {
        setTimeLeft(started.data.timeRemainingSeconds);
      }
      setStatus('running');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر بدء الكويز');
    }
  };

  const handleOptionSelect = (optionId: string) => {
    const qId = quiz.questions[currentIndex].id;
    const next = { ...answers, [qId]: optionId };
    setAnswers(next);
    if (attemptId) {
      void QuizzesService.saveAnswers(attemptId, next);
    }
  };

  const handleEssayTextChange = (text: string) => {
    const qId = quiz.questions[currentIndex].id;
    const existing = typeof answers[qId] === 'object' ? answers[qId] : {};
    const next = {
      ...answers,
      [qId]: {
        ...existing,
        answerText: text,
      },
    };
    setAnswers(next);
  };

  const handleEssayImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await apiClient.postForm<{ data: { url: string; path: string } }>('/student/upload-answer-image', formData);
      const qId = quiz.questions[currentIndex].id;
      const existing = typeof answers[qId] === 'object' ? answers[qId] : {};
      const next = {
        ...answers,
        [qId]: {
          ...existing,
          answerImage: res?.data?.url || (res as any)?.url,
        },
      };
      setAnswers(next);
    } catch (err: any) {
      setError(err?.message || 'تعذر رفع صورة الإجابة');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const removeEssayImage = (qId: string) => {
    const existing = typeof answers[qId] === 'object' ? answers[qId] : {};
    const next = {
      ...answers,
      [qId]: {
        ...existing,
        answerImage: undefined,
      },
    };
    setAnswers(next);
  };

  const handleSubmit = async () => {
    await finishQuiz();
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

          {error && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/30 text-xs text-red-300">{error}</div>
          )}

          <Button variant="primary" size="lg" fullWidth onClick={handleStart}>
            ابدأ الكويز الآن
          </Button>
        </div>
      </div>
    );
  }

  // 2. COMPLETED / RESULTS SCREEN
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
              {(result.review || []).map((q, idx) => (
                <div
                  key={q.questionId}
                  className={`p-4 rounded-2xl border text-xs space-y-2 ${
                    q.isCorrect
                      ? 'bg-emerald-950/20 border-emerald-500/30'
                      : 'bg-red-950/20 border-red-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">
                      س{idx + 1}: <MathText text={q.questionText} />
                    </span>
                    {q.isCorrect ? (
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
                      <strong className="text-cyan-400">الشرح: </strong> <MathText text={q.explanation} />
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. RUNNING QUIZ SCREEN
  const currentQuestion = quiz.questions[currentIndex];
  const currentAnswer = answers[currentQuestion.id];
  const selectedOptionId = typeof currentAnswer === 'string' ? currentAnswer : currentAnswer?.selectedOptionId;
  const isEssay = currentQuestion.type === 'essay';

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6 pb-12">
      <SEOHead title={`${quiz.title} — السؤال ${currentIndex + 1}`} noindex />

      {/* Header Info */}
      <div className="glass-panel p-4 rounded-2xl border border-blue-900/30 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-white">{quiz.title}</h2>
          <p className="text-xs text-slate-400">
            سؤال {currentIndex + 1} من {quiz.questions.length} • ({isEssay ? 'سؤال مقالي' : 'اختيار من متعدد'})
          </p>
        </div>

        <div className="flex items-center gap-2 text-amber-400 font-mono text-sm font-extrabold bg-slate-900/80 px-3 py-1.5 rounded-xl border border-amber-500/30">
          <Clock className="w-4 h-4" />
          <span>{formatTimer(timeLeft)}</span>
        </div>
      </div>

      {/* Question Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-blue-900/40 space-y-6 shadow-xl bg-slate-950/70">
        <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
          <MathText text={currentQuestion.text} />
        </h3>

        {/* Question Image if present */}
        {currentQuestion.image && (
          <div className="rounded-2xl overflow-hidden border border-blue-900/30 bg-slate-900/80 p-2 max-w-lg mx-auto">
            <img
              src={currentQuestion.image}
              alt="توضيح السؤال"
              className="w-full h-auto max-h-80 object-contain rounded-xl"
            />
          </div>
        )}

        {/* Essay Answer Inputs */}
        {isEssay ? (
          <div className="space-y-4 pt-2 border-t border-slate-800">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-cyan-400" />
                اكتب خطوات وإجابة السؤال المقالي:
              </label>
              <textarea
                value={typeof currentAnswer === 'object' ? currentAnswer?.answerText || '' : ''}
                onChange={(e) => handleEssayTextChange(e.target.value)}
                placeholder="اكتب خطوات الحل أو الناتج النهائي هنا..."
                rows={4}
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500 resize-none font-mono"
              />
            </div>

            {/* Photo of Solution Upload */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                أو ارفع صورة لحلك في ورقة خارجية 📷:
              </label>

              {typeof currentAnswer === 'object' && currentAnswer?.answerImage ? (
                <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentAnswer.answerImage}
                      alt="صورة الحل المرفوعة"
                      className="w-16 h-16 object-cover rounded-xl border border-slate-700"
                    />
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> تم إرفاق صورة الحل بنجاح
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeEssayImage(currentQuestion.id)}
                    className="p-2 text-red-400 hover:bg-red-950/40 rounded-xl transition-colors"
                    title="حذف الصورة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-2xl bg-slate-900/40 cursor-pointer transition-colors">
                  <Upload className="w-8 h-8 text-slate-500 mb-2" />
                  <span className="text-xs font-bold text-slate-300">
                    {uploadingImage ? 'جاري رفع الصورة...' : 'اضغط لاختيار صورة من هاتفك أو جهازك'}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1">يدعم JPG, PNG, WEBP (حتى 10MB)</span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingImage}
                    onChange={handleEssayImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        ) : (
          /* MCQ Options */
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
                  <MathText text={option.text} />
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
        )}

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
