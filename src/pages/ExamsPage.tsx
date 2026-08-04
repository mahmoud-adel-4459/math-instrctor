import React, { useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Trophy,
  RotateCcw,
  Sparkles,
  FileCheck2,
} from 'lucide-react';
import { useExamStore, MOCK_EXAM_CALCULUS } from '../store/useExamStore';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { formatTimer } from '../utils/formatters';

export const ExamsPage: React.FC = () => {
  const {
    currentExam,
    answers,
    timeRemainingSeconds,
    isExamActive,
    isSubmitted,
    latestAttempt,
    startExam,
    selectAnswer,
    tickTimer,
    submitExam,
    resetExam,
  } = useExamStore();

  // Timer interval effect
  useEffect(() => {
    let interval: any = null;
    if (isExamActive && !isSubmitted) {
      interval = setInterval(() => {
        tickTimer();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isExamActive, isSubmitted, tickTimer]);

  const exam = currentExam || MOCK_EXAM_CALCULUS;

  const answeredCount = Object.keys(answers).length;
  const isTimeWarning = timeRemainingSeconds < 300 && timeRemainingSeconds > 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      {!isExamActive && !isSubmitted && (
        <div className="glass-panel rounded-3xl p-8 border border-slate-800 space-y-6 text-center lg:text-right flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <Badge variant="cyan">منصة الامتحانات الذكية</Badge>
            <h1 className="text-3xl font-extrabold text-white">{exam.title}</h1>
            <p className="text-sm text-slate-300 leading-relaxed">{exam.description}</p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-semibold text-indigo-300">
                <Clock className="w-4 h-4" />
                مدة الامتحان: {exam.durationMinutes} دقيقة
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 font-semibold text-purple-300">
                <FileCheck2 className="w-4 h-4" />
                عدد الأسئلة: {exam.questionsCount} أسئلة اختيار من متعدد
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 font-semibold text-amber-300">
                <Trophy className="w-4 h-4" />
                درجة النجاح: {exam.passPercentage}%
              </span>
            </div>
          </div>

          <Button
            variant="gradient"
            size="lg"
            icon={Sparkles}
            onClick={() => startExam(exam)}
          >
            بدء الاختبار الآن
          </Button>
        </div>
      )}

      {/* ACTIVE EXAM RUNNER */}
      {isExamActive && !isSubmitted && (
        <div className="space-y-6">
          
          {/* Sticky Timer & Progress Bar */}
          <div className="sticky top-24 z-40 glass-panel p-4 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                {answeredCount} / {exam.questions.length}
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">الأسئلة المجاب عليها</h3>
                <p className="text-[10px] text-slate-400">تأكد من مراجعة كل الإجابات قبل التسليم</p>
              </div>
            </div>

            {/* Timer Badge */}
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-black transition-colors ${
                isTimeWarning
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                  : 'bg-slate-900 border-slate-800 text-indigo-400'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span dir="ltr">{formatTimer(timeRemainingSeconds)}</span>
            </div>

            <Button
              variant="danger"
              size="sm"
              onClick={() => submitExam('stu_101')}
            >
              إنهاء وتسليم الاختبار
            </Button>
          </div>

          {/* Question List */}
          <div className="space-y-6">
            {exam.questions.map((q, idx) => (
              <div
                key={q.id}
                className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
                      س{idx + 1}
                    </span>
                    <h3 className="text-base font-bold text-white leading-relaxed">{q.text}</h3>
                  </div>
                  <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20 shrink-0">
                    {q.points} درجات
                  </span>
                </div>

                {/* Options List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {q.options.map((opt) => {
                    const isSelected = answers[q.id] === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => selectAnswer(q.id, opt.id)}
                        className={`p-4 rounded-2xl border text-right text-xs font-bold transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-indigo-600/20 text-indigo-200 border-indigo-500 shadow-md shadow-indigo-500/10'
                            : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                        }`}
                      >
                        <span>{opt.text}</span>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? 'border-indigo-400 bg-indigo-600 text-white'
                              : 'border-slate-700'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-6">
            <Button
              variant="gradient"
              size="lg"
              onClick={() => submitExam('stu_101')}
            >
              اعتماد النتيجة والتسليم
            </Button>
          </div>
        </div>
      )}

      {/* EXAM RESULT MODAL / SUMMARY */}
      {isSubmitted && latestAttempt && (
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-8 animate-in fade-in">
          
          <div className="text-center space-y-4">
            <div className="inline-flex p-4 rounded-full bg-slate-900 border border-slate-800">
              {latestAttempt.passed ? (
                <Trophy className="w-16 h-16 text-amber-400 animate-bounce" />
              ) : (
                <AlertCircle className="w-16 h-16 text-rose-400" />
              )}
            </div>

            <h2 className="text-3xl font-black text-white">
              {latestAttempt.passed ? 'مبروك! لقد اجتزت الاختبار بنجاح 🎉' : 'حاول مرة أخرى للحصول على الدرجة الكاملة'}
            </h2>

            <div className="flex justify-center items-baseline gap-2">
              <span className="text-5xl font-black text-gradient">
                {latestAttempt.score}
              </span>
              <span className="text-xl text-slate-400 font-bold">/ {latestAttempt.totalPoints} درجة</span>
            </div>
          </div>

          {/* Model Answer Review */}
          <div className="space-y-4 border-t border-slate-800 pt-6">
            <h3 className="text-lg font-bold text-white">مراجعة النموذج الإرشادي والشرح:</h3>

            {exam.questions.map((q, idx) => {
              const studentAnswerId = latestAttempt.answers[q.id];
              const isCorrect = studentAnswerId === q.correctOptionId;

              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-2xl border ${
                    isCorrect
                      ? 'bg-emerald-500/5 border-emerald-500/20'
                      : 'bg-rose-500/5 border-rose-500/20'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-400" />
                    )}
                    <span className="text-xs font-bold text-white">
                      س{idx + 1}: {q.text}
                    </span>
                  </div>

                  {q.explanation && (
                    <div className="mt-3 p-3 rounded-xl bg-slate-950 text-xs text-slate-300 border border-slate-800">
                      <strong className="text-indigo-400 font-bold">خطوات الحل والشرح: </strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-center gap-4 pt-4">
            <Button
              variant="secondary"
              size="md"
              icon={RotateCcw}
              onClick={() => resetExam()}
            >
              إعادة الاختبار
            </Button>
          </div>
        </div>
      )}

    </div>
  );
};
