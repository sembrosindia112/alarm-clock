import React, { useState } from 'react';
import { ThemeConfig } from '../types/alarm';
import { Moon, X, Plus } from 'lucide-react';

interface SleepCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSetAlarm: (time: string, label: string) => void;
  theme: ThemeConfig;
}

export const SleepCalculatorModal: React.FC<SleepCalculatorModalProps> = ({
  isOpen,
  onClose,
  onSetAlarm,
  theme,
}) => {
  const [targetWakeTime, setTargetWakeTime] = useState('07:00');
  const [mode, setMode] = useState<'sleepNow' | 'wakeAt'>('sleepNow');

  if (!isOpen) return null;

  const now = new Date();
  const sleepNowOptions = [3, 4, 5, 6].map((cycles) => {
    const d = new Date(now.getTime() + (14 + cycles * 90) * 60 * 1000);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    const totalHours = (cycles * 1.5).toFixed(1);
    return {
      time: `${hh}:${mm}`,
      cycles,
      hours: totalHours,
      quality: cycles >= 5 ? 'Optimal' : cycles === 4 ? 'Good' : 'Power Sleep',
    };
  });

  const [twH, twM] = targetWakeTime.split(':').map(Number);
  const wakeDate = new Date();
  wakeDate.setHours(twH, twM, 0, 0);

  const bedtimeOptions = [6, 5, 4, 3].map((cycles) => {
    const d = new Date(wakeDate.getTime() - (14 + cycles * 90) * 60 * 1000);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    const totalHours = (cycles * 1.5).toFixed(1);
    return {
      time: `${hh}:${mm}`,
      cycles,
      hours: totalHours,
      quality: cycles >= 5 ? 'Optimal' : cycles === 4 ? 'Good' : 'Power Sleep',
    };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-lg rounded-3xl p-6 shadow-2xl border transition-all ${
          theme.cardBg
        } ${theme.borderClass} ${
          theme.isLightMode ? 'text-slate-900' : 'text-slate-100'
        }`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl ${theme.badgeBg}`}>
              <Moon className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Sleep Cycle Calculator</h2>
              <p className="text-xs opacity-60">
                Wake up at the end of a 90-minute REM cycle to feel energized
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-all ${
              theme.isLightMode ? 'hover:bg-slate-200' : 'hover:bg-white/10'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex rounded-xl p-1 bg-white/5 border border-white/10 mt-5 text-xs font-semibold">
          <button
            onClick={() => setMode('sleepNow')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === 'sleepNow' ? theme.accentBg : 'opacity-70 hover:opacity-100'
            }`}
          >
            If I sleep right now
          </button>
          <button
            onClick={() => setMode('wakeAt')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === 'wakeAt' ? theme.accentBg : 'opacity-70 hover:opacity-100'
            }`}
          >
            I want to wake up at...
          </button>
        </div>

        <div className="mt-5">
          {mode === 'sleepNow' ? (
            <div>
              <p className="text-xs opacity-75 mb-3">
                If you close your eyes right now, set your alarm for one of these times to wake up refreshed:
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {sleepNowOptions.map((opt) => (
                  <button
                    key={opt.time}
                    onClick={() => {
                      onSetAlarm(opt.time, `${opt.hours}h Sleep Cycle`);
                      onClose();
                    }}
                    className={`flex flex-col text-left p-3.5 rounded-2xl border transition-all hover:scale-[1.02] ${
                      opt.cycles >= 5
                        ? `${theme.badgeBg} border-cyan-500/40`
                        : theme.isLightMode
                        ? 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xl font-bold font-mono">{opt.time}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/10 font-medium">
                        {opt.cycles} cycles
                      </span>
                    </div>
                    <span className="text-xs opacity-80">{opt.hours} hours sleep</span>
                    <span className="text-[11px] font-semibold text-emerald-400 mt-1">
                      {opt.quality}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <label className="text-xs font-semibold opacity-80">Target Wake Time:</label>
                <input
                  type="time"
                  value={targetWakeTime}
                  onChange={(e) => setTargetWakeTime(e.target.value)}
                  className={`px-3 py-1.5 rounded-xl border text-base font-bold outline-none ${
                    theme.isLightMode
                      ? 'bg-slate-100 border-slate-300 text-slate-900'
                      : 'bg-black/40 border-white/15 text-slate-100'
                  }`}
                />
              </div>

              <p className="text-xs opacity-75 mb-3">
                To wake up feeling fresh at {targetWakeTime}, go to bed at one of these times:
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                {bedtimeOptions.map((opt) => (
                  <div
                    key={opt.time}
                    className={`flex flex-col p-3.5 rounded-2xl border ${
                      opt.cycles >= 5
                        ? `${theme.badgeBg} border-cyan-500/40`
                        : theme.isLightMode
                        ? 'bg-slate-50 border-slate-200'
                        : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xl font-bold font-mono">{opt.time}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/10 font-medium">
                        {opt.cycles} cycles
                      </span>
                    </div>
                    <span className="text-xs opacity-80">{opt.hours} hours sleep</span>
                    <span className="text-[11px] font-semibold text-indigo-400 mt-1">
                      {opt.quality}
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  onSetAlarm(targetWakeTime, 'Wake Up');
                  onClose();
                }}
                className={`w-full mt-4 py-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 ${theme.accentBg}`}
              >
                <Plus className="w-4 h-4" />
                Set Alarm for {targetWakeTime}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};