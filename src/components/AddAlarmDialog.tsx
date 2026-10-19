import React, { useState } from 'react';
import { Alarm, SoundId, ThemeConfig } from '../types/alarm';
import { previewSound } from '../utils/audio';
import { X, Brain, Bell, Plus, Play } from 'lucide-react';

interface AddAlarmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (alarm: Omit<Alarm, 'id' | 'createdAt'>) => void;
  theme: ThemeConfig;
  initialAlarm?: Alarm | null;
}

const DAYS_OF_WEEK = [
  { label: 'S', name: 'Sun', day: 0 },
  { label: 'M', name: 'Mon', day: 1 },
  { label: 'T', name: 'Tue', day: 2 },
  { label: 'W', name: 'Wed', day: 3 },
  { label: 'T', name: 'Thu', day: 4 },
  { label: 'F', name: 'Fri', day: 5 },
  { label: 'S', name: 'Sat', day: 6 },
];

const SOUND_OPTIONS: { id: SoundId; name: string; desc: string }[] = [
  { id: 'zen', name: 'Zen Chime', desc: '528Hz Solfeggio bell chord' },
  { id: 'classic', name: 'Digital Beep', desc: 'Sharp classic retro alarm' },
  { id: 'marimba', name: 'Kalimba / Marimba', desc: 'Acoustic mallet arpeggio' },
  { id: 'radar', name: 'Radar Sweep', desc: 'Sci-fi sonar pulse' },
  { id: 'arcade', name: '8-Bit Arcade', desc: 'Retro pixel melody' },
  { id: 'chime', name: 'Gentle Bells', desc: 'Ethereal chime triad' },
];

export const AddAlarmDialog: React.FC<AddAlarmDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  theme,
  initialAlarm,
}) => {
  const [time, setTime] = useState(initialAlarm?.time || '07:00');
  const [label, setLabel] = useState(initialAlarm?.label || 'Morning Alarm');
  const [days, setDays] = useState<number[]>(initialAlarm?.days || []);
  const [sound, setSound] = useState<SoundId>(initialAlarm?.sound || 'zen');
  const [snoozeMinutes, setSnoozeMinutes] = useState<number>(initialAlarm?.snoozeMinutes || 9);
  const [requireMathToDismiss, setRequireMathToDismiss] = useState<boolean>(
    initialAlarm?.requireMathToDismiss || false
  );

  if (!isOpen) return null;

  const toggleDay = (day: number) => {
    if (days.includes(day)) {
      setDays(days.filter((d) => d !== day));
    } else {
      setDays([...days, day].sort());
    }
  };

  const setPresetDays = (preset: 'weekdays' | 'weekends' | 'all' | 'once') => {
    if (preset === 'weekdays') setDays([1, 2, 3, 4, 5]);
    if (preset === 'weekends') setDays([0, 6]);
    if (preset === 'all') setDays([0, 1, 2, 3, 4, 5, 6]);
    if (preset === 'once') setDays([]);
  };

  const handleNapPreset = (minutes: number) => {
    const d = new Date();
    d.setMinutes(d.getMinutes() + minutes);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    setTime(`${hh}:${mm}`);
    setLabel(`${minutes}m Power Nap`);
    setDays([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      time,
      label: label.trim() || 'Alarm',
      isEnabled: true,
      days,
      sound,
      snoozeMinutes,
      requireMathToDismiss,
      volume: 0.85,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-md rounded-3xl p-6 shadow-2xl border transition-all ${
          theme.cardBg
        } ${theme.borderClass} ${
          theme.isLightMode ? 'text-slate-900' : 'text-slate-100'
        }`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl ${theme.badgeBg}`}>
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {initialAlarm ? 'Edit Alarm' : 'Set New Alarm'}
              </h2>
              <p className="text-xs opacity-60">Customize sound, repeats & challenge</p>
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

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          <div className="flex flex-col items-center justify-center">
            <div
              className={`p-3 rounded-2xl border ${
                theme.isLightMode
                  ? 'bg-slate-100 border-slate-300'
                  : 'bg-black/30 border-white/10'
              }`}
            >
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className={`text-4xl sm:text-5xl font-bold bg-transparent tracking-widest text-center outline-none ${theme.fontClass} ${theme.timeColor}`}
              />
            </div>

            <div className="flex items-center gap-2 mt-2.5">
              <span className="text-[11px] opacity-60">Quick Nap:</span>
              <button
                type="button"
                onClick={() => handleNapPreset(15)}
                className="text-xs px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10"
              >
                +15m
              </button>
              <button
                type="button"
                onClick={() => handleNapPreset(30)}
                className="text-xs px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10"
              >
                +30m
              </button>
              <button
                type="button"
                onClick={() => handleNapPreset(45)}
                className="text-xs px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10"
              >
                +45m
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5 opacity-80">
              Alarm Label
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Wake up, Morning jog, Medicine"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                theme.isLightMode
                  ? 'bg-slate-100 border-slate-300 focus:border-slate-900 text-slate-900'
                  : 'bg-black/30 border-white/10 focus:border-cyan-400 text-slate-100'
              }`}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold opacity-80">Repeat Days</label>
              <div className="flex items-center gap-1.5 text-[11px] opacity-75">
                <button
                  type="button"
                  onClick={() => setPresetDays('weekdays')}
                  className="hover:underline"
                >
                  Weekdays
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => setPresetDays('weekends')}
                  className="hover:underline"
                >
                  Weekends
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => setPresetDays('once')}
                  className="hover:underline"
                >
                  Once
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {DAYS_OF_WEEK.map((item) => {
                const isSelected = days.includes(item.day);
                return (
                  <button
                    key={item.day}
                    type="button"
                    onClick={() => toggleDay(item.day)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                      isSelected
                        ? theme.accentBg
                        : theme.isLightMode
                        ? 'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1.5 opacity-80">
                Alarm Tone
              </label>
              <div className="flex items-center gap-1.5">
                <select
                  value={sound}
                  onChange={(e) => setSound(e.target.value as SoundId)}
                  className={`w-full px-3 py-2 rounded-xl border text-xs outline-none ${
                    theme.isLightMode
                      ? 'bg-slate-100 border-slate-300 text-slate-900'
                      : 'bg-[#1a1c2e] border-white/15 text-slate-100'
                  }`}
                >
                  {SOUND_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id} className="bg-slate-900 text-white">
                      {opt.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => previewSound(sound, 0.8)}
                  title="Test Sound"
                  className={`p-2 rounded-xl border ${
                    theme.isLightMode
                      ? 'bg-slate-100 border-slate-300 hover:bg-slate-200 text-slate-800'
                      : 'bg-white/5 border-white/10 hover:bg-white/15 text-slate-200'
                  }`}
                >
                  <Play className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5 opacity-80">
                Snooze Duration
              </label>
              <select
                value={snoozeMinutes}
                onChange={(e) => setSnoozeMinutes(Number(e.target.value))}
                className={`w-full px-3 py-2 rounded-xl border text-xs outline-none ${
                  theme.isLightMode
                    ? 'bg-slate-100 border-slate-300 text-slate-900'
                    : 'bg-[#1a1c2e] border-white/15 text-slate-100'
                }`}
              >
                <option value={5} className="bg-slate-900 text-white">5 Minutes</option>
                <option value={9} className="bg-slate-900 text-white">9 Minutes (Classic)</option>
                <option value={10} className="bg-slate-900 text-white">10 Minutes</option>
                <option value={15} className="bg-slate-900 text-white">15 Minutes</option>
              </select>
            </div>
          </div>

          <div
            onClick={() => setRequireMathToDismiss(!requireMathToDismiss)}
            className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
              requireMathToDismiss
                ? `${theme.badgeBg} border-cyan-500/40`
                : theme.isLightMode
                ? 'bg-slate-100 border-slate-200 hover:border-slate-300'
                : 'bg-white/5 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Brain className="w-4 h-4 text-pink-400" />
              <div>
                <p className="text-xs font-bold">Math Wake-Up Challenge</p>
                <p className="text-[11px] opacity-70">
                  Must solve simple math problem to dismiss
                </p>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-md border flex items-center justify-center text-xs font-bold ${
                requireMathToDismiss
                  ? 'bg-cyan-500 text-black border-cyan-400'
                  : 'border-white/20'
              }`}
            >
              {requireMathToDismiss ? '✓' : ''}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2.5 rounded-xl text-xs font-medium ${
                theme.isLightMode ? 'hover:bg-slate-200' : 'hover:bg-white/10'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold transition-all ${theme.accentBg}`}
            >
              <Plus className="w-4 h-4" />
              {initialAlarm ? 'Save Changes' : 'Set Alarm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};