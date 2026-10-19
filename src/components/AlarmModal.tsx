import React, { useState, useEffect } from 'react';
import { Alarm, ThemeConfig } from '../types/alarm';
import { Bell, Check, Clock, Brain, AlertCircle } from 'lucide-react';

interface AlarmModalProps {
  alarm: Alarm;
  theme: ThemeConfig;
  onDismiss: () => void;
  onSnooze: (minutes: number) => void;
}

export const AlarmModal: React.FC<AlarmModalProps> = ({
  alarm,
  theme,
  onDismiss,
  onSnooze,
}) => {
  const [mathProblem, setMathProblem] = useState<{ q: string; answer: number } | null>(null);
  const [mathInput, setMathInput] = useState('');
  const [mathError, setMathError] = useState(false);

  useEffect(() => {
    if (alarm.requireMathToDismiss) {
      const a = Math.floor(Math.random() * 40) + 12;
      const b = Math.floor(Math.random() * 30) + 7;
      setMathProblem({ q: `${a} + ${b}`, answer: a + b });
    }
  }, [alarm]);

  const handleDismissAttempt = () => {
    if (alarm.requireMathToDismiss && mathProblem) {
      const parsed = parseInt(mathInput.trim(), 10);
      if (parsed === mathProblem.answer) {
        onDismiss();
      } else {
        setMathError(true);
        setMathInput('');
      }
    } else {
      onDismiss();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300 select-none">
      <div
        className={`w-full max-w-lg rounded-3xl p-8 text-center border shadow-2xl relative overflow-hidden ${
          theme.cardBg
        } ${theme.borderClass} ${
          theme.isLightMode ? 'text-slate-900' : 'text-slate-100'
        }`}
      >
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-rose-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl animate-pulse delay-500" />

        <div className="relative mx-auto mb-5 w-20 h-20 rounded-3xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shadow-lg shadow-rose-500/30">
          <Bell className="w-10 h-10 text-rose-400 animate-bounce" />
        </div>

        <h1
          className={`text-5xl sm:text-6xl font-black tracking-tight ${theme.fontClass} ${theme.timeColor} ${theme.glowClass} mb-2`}
        >
          {alarm.time}
        </h1>
        <h2 className="text-xl sm:text-2xl font-bold mb-1">{alarm.label}</h2>
        <p className="text-xs sm:text-sm opacity-70 mb-6">Time to rise and shine!</p>

        {alarm.requireMathToDismiss && mathProblem && (
          <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10 text-left">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-pink-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
                Wake-Up Math Challenge
              </span>
            </div>
            <p className="text-sm opacity-80 mb-3">
              Solve this problem to verify you are fully awake:
            </p>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2.5 rounded-xl bg-black/40 border border-white/20 font-mono text-lg font-bold">
                {mathProblem.q} = ?
              </div>
              <input
                type="number"
                value={mathInput}
                onChange={(e) => {
                  setMathInput(e.target.value);
                  setMathError(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleDismissAttempt();
                }}
                placeholder="Answer"
                className="w-28 px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 font-mono text-lg font-bold text-center outline-none focus:border-cyan-400"
                autoFocus
              />
            </div>
            {mathError && (
              <p className="flex items-center gap-1.5 text-xs text-rose-400 mt-2 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> Incorrect answer, try again!
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col sm:row gap-3">
          <button
            onClick={() => onSnooze(alarm.snoozeMinutes || 9)}
            className={`flex-1 py-4 px-6 rounded-2xl font-semibold text-sm sm:text-base border transition-all flex items-center justify-center gap-2 ${
              theme.isLightMode
                ? 'bg-slate-200 hover:bg-slate-300 text-slate-800 border-slate-300'
                : 'bg-white/10 hover:bg-white/20 text-slate-100 border-white/15'
            }`}
          >
            <Clock className="w-4 h-4" />
            Snooze (+{alarm.snoozeMinutes || 9}m)
          </button>

          <button
            onClick={handleDismissAttempt}
            className={`flex-1 py-4 px-6 rounded-2xl font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 ${theme.accentBg}`}
          >
            <Check className="w-5 h-5" />
            Dismiss Alarm
          </button>
        </div>
      </div>
    </div>
  );
};