import React, { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Clock,
  AlertTriangle,
  Flag,
  RotateCcw,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Image as ImageIcon,
  Upload,
  FileText,
  Trash2,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { SEOHead } from '../../seo/SEOHead';
import { ExamsService } from '../../services/exams.service';
import { apiClient } from '../../services/apiClient';
import { MathText } from '../../components/common/MathText';
import type { Exam, ExamAttempt } from '../../types';

export const ExamPage: React.FC = () => {
  const { courseSlug, examId } = useParams<{ courseSlug: string; examId: string }>();
  const [exam, setExam] = useState<Exam | null>(null);
  const [status, setStatus] = useState<'start_screen' | 'running' | 'completed'>('start_screen');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [flaggedIds, setFlaggedIds] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [result, setResult] = useState<ExamAttempt | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (!examId) {
      setLoading(false);
      return;
    }
    ExamsService.getExamById(examId)
      .then((res) => {
        if (res.data) {
          setExam(res.data);
          setTimeLeft(res.data.durationMinutes * 60);
        }
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'تعذر تحميل الامتحان'))
      .finally(() => setLoading(false));
  }, [examId]);

  const finishExam = useCallback(async () => {
    if (!attemptId || !exam) return;
    const timeSpent = exam.durationMinutes * 60 - timeLeft;
    await ExamsService.saveAnswers(attemptId, answers);
    const res = await ExamsService.submitAttempt(attemptId, {
      examId: exam.id,
      examTitle: exam.title,
      courseSlug: courseSlug || '',
      answers,
      timeSpentSeconds: timeSpent,
    });
    if (res.data) {
      setResult(res.data);
      setStatus('completed');
    }
  }, [attemptId, exam, answers, timeLeft, courseSlug]);

  // Exam timer
  useEffect(() => {
    if (status !== 'running' || !exam) return;
    if (timeLeft <= 0) {
      setShowConfirmModal(false);
      void finishExam();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [status, timeLeft, exam, finishExam]);

  if (loading) return <div className="text-center py-12 text-slate-400">جاري تحميل الامتحان...</div>;
  if (!exam) return <div className="text-center py-12 text-slate-400">الامتحان غير موجود</div>;

  const handleStartExam = async () => {
    setError('');
    try {
      const started = await ExamsService.startAttempt(exam.id);
      setAttemptId(started.data.attemptId);
      if (started.data.timeRemainingSeconds != null) {
        setTimeLeft(started.data.timeRemainingSeconds);
      }
      setStatus('running');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر بدء الامتحان');
    }
  };

  const handleOptionSelect = (optionId: string) => {
    const qId = exam.questions[currentIndex].id;
    const next = { ...answers, [qId]: optionId };
    setAnswers(next);
    if (attemptId) {
      void ExamsService.saveAnswers(attemptId, next);
    }
  };

  const handleEssayTextChange = (text: string) => {
    const qId = exam.questions[currentIndex].id;
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
      const qId = exam.questions[currentIndex].id;
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

  const toggleFlag = (qId: string) => {
    setFlaggedIds((prev) => (prev.includes(qId) ? prev.filter((id) => id !== qId) : [...prev, qId]));
  };

  const handleFinalSubmit = async () => {
    setShowConfirmModal(false);
    await finishExam();
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // 1. START SCREEN
  if (status === 'start_screen') {
    return (
      <div className="max-w-2xl mx-auto py-12 space-y-6">
        <SEOHead title={`${exam.title} — البداية`} noindex />

        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-blue-900/40 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto glow-cyan">
            <Clock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-white">{exam.title}</h1>
            <p className="text-xs text-slate-300 leading-relaxed">{exam.description}</p>
          </div>

          {/* Exam Specs */}
          <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block mb-1">عدد الأسئلة</span>
              <span className="font-bold text-white text-sm">{exam.questionsCount} أسئلة</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">مدة الامتحان</span>
              <span className="font-bold text-white text-sm">{exam.durationMinutes} دقيقة</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">درجة النجاح</span>
              <span className="font-bold text-emerald-400 text-sm">{exam.passPercentage}%</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/20 text-xs text-amber-300 text-right space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertTriangle className="w-4 h-4" /> تعليمات هامة:
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
              <li>بمجرد البدء يبدأ العد التنازلي للمؤقت ولا يمكن إيقافه.</li>
              <li>الأسئلة المقالية يمكنك كتابة الحل أو رفع صورة لخطوات حلك الخارجية.</li>
              <li>عند انتهاء الوقت سيتم تسليم إجاباتك الحالية تلقائياً.</li>
            </ul>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/30 text-xs text-red-300">{error}</div>
          )}

          <Button variant="gradient" size="lg" fullWidth onClick={handleStartExam}>
            ابدأ الامتحان الآن
          </Button>
        </div>
      </div>
    );
  }

  // 2. RESULTS SCREEN
  if (status === 'completed' && result) {
    return (
      <div className="max-w-3xl mx-auto py-12 space-y-6">
        <SEOHead title={`${exam.title} — النتيجة`} noindex />

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

          {(result.review || []).length > 0 && (
            <div className="pt-6 border-t border-slate-800 text-right space-y-4">
              <h3 className="text-sm font-bold text-white">مراجعة إجابات الامتحان:</h3>
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
          )}
        </div>
      </div>
    );
  }

  // 3. RUNNING EXAM SCREEN
  const currentQuestion = exam.questions[currentIndex];
  const currentAnswer = answers[currentQuestion.id];
  const selectedOptionId = typeof currentAnswer === 'string' ? currentAnswer : currentAnswer?.selectedOptionId;
  const isEssay = currentQuestion.type === 'essay';
  const isFlagged = flaggedIds.includes(currentQuestion.id);
  const answeredCount = Object.keys(answers).length;

  return (
    <>
      <SEOHead title={`${exam.title} — جارِ الحل`} noindex />

      <div className="space-y-6 pb-12">
        {/* Exam Bar */}
        <div className="glass-panel p-4 rounded-2xl border border-purple-900/40 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">{exam.title}</h2>
            <p className="text-xs text-slate-400">
              المجاب عنها: {answeredCount} من {exam.questions.length} أسئلة • ({isEssay ? 'سؤال مقالي' : 'اختيار من متعدد'})
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
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-blue-900/40 space-y-6 shadow-xl relative bg-slate-950/70">
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
                      rows={5}
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
                            ? 'bg-blue-600/90 border-blue-400 text-white shadow-lg glow-blue'
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
            <div className="glass-panel p-5 rounded-3xl border border-blue-900/30 space-y-4 bg-slate-950/70">
              <h4 className="text-xs font-bold text-white">جدول أسئلة الامتحان:</h4>
              <div className="grid grid-cols-4 gap-2">
                {exam.questions.map((q, idx) => {
                  const isAnswered = !!answers[q.id];
                  const isCur = idx === currentIndex;
                  const isFlag = flaggedIds.includes(q.id);

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-10 rounded-xl font-bold text-xs flex items-center justify-center transition-all relative ${
                        isCur
                          ? 'border-2 border-cyan-400 bg-cyan-950 text-white'
                          : isAnswered
                            ? 'bg-blue-600/80 text-white hover:bg-blue-600'
                            : 'bg-slate-900 border border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {idx + 1}
                      {isFlag && <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-1 right-1" />}
                    </button>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-2 text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-blue-600" />
                  <span>سؤال مجاب عنه</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-slate-900 border border-slate-800" />
                  <span>سؤال لم يُجب</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>مميز للمراجعة</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Submit Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="تأكيد تسليم الامتحان 🏁"
      >
        <div className="space-y-4 text-center">
          <p className="text-xs text-slate-300">
            أنت على وشك إنهاء وتسليم الامتحان. هل أنت متأكد من تسليم جميع الإجابات؟
          </p>
          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex justify-around text-xs">
            <div>
              <span className="text-slate-500 block">الأسئلة المجابة</span>
              <span className="font-bold text-emerald-400">{answeredCount}</span>
            </div>
            <div>
              <span className="text-slate-500 block">المتبقية</span>
              <span className="font-bold text-amber-400">{exam.questions.length - answeredCount}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={() => setShowConfirmModal(false)}>
              الرجوع للحل
            </Button>
            <Button variant="gradient" size="sm" onClick={handleFinalSubmit}>
              نعم، تسليم الامتحان الآن
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
