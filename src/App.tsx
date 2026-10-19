import React, { useState, useEffect, useRef } from 'react';
import {
  Alarm,
  ThemeId,
  ClockFormat,
  ClockView,
} from './types/alarm';
import { THEMES } from './utils/themes';
import { playAlarmSound, stopAlarmLoop } from './utils/audio';
import { ClockDisplay } from './components/ClockDisplay';
import { AlarmList } from './components/AlarmList';
import { ThemeSelector } from './components/ThemeSelector';
import { AddAlarmDialog } from './components/AddAlarmDialog';
import { AlarmModal } from './components/AlarmModal';
import { SleepCalculatorModal } from './components/SleepCalculatorModal';
import { AmbientPlayer } from './components/AmbientPlayer';
import { NightstandMode } from './components/NightstandMode';
import { Clock, Play, Moon } from 'lucide-react';

const INITIAL_ALARMS: Alarm[] = [
  {
    id: 'default-1',
    time: '07:00',
    label: 'Morning Rise & Shine',
    isEnabled: true,
    days: [1, 2, 3, 4, 5],
    sound: 'zen',
    snoozeMinutes: 9,
    requireMathToDismiss: false,
    volume: 0.85,
    createdAt: Date.now() - 100000,
  },
  {
    id: 'default-2',
    time: '08:30',
    label: 'Weekend Coffee & Walk',
    isEnabled: true,
    days: [0, 6],
    sound: 'marimba',
    snoozeMinutes: 10,
    requireMathToDismiss: false,
    volume: 0.85,
    createdAt: Date.now() - 50000,
  },
];

export function App() {
  const [themeId, setThemeId] = useState<ThemeId>(() => {
    const saved = localStorage.getItem('chronowake_theme') as ThemeId;
    return saved && THEMES[saved] ? saved : 'cyberpunk';
  });
  const currentTheme = THEMES[themeId] || THEMES.cyberpunk;

  const [clockFormat, setClockFormat] = useState<ClockFormat>(() => {
    return (localStorage.getItem('chronowake_format') as ClockFormat) || '12h';
  });
  const [clockView, setClockView] = useState<ClockView>('digital');

  const [alarms, setAlarms] = useState<Alarm[]>(() => {
    const saved = localStorage.getItem('chronowake_alarms');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_ALARMS;
      }
    }
    return INITIAL_ALARMS;
  });

  const [now, setNow] = useState<Date>(new Date());

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingAlarm, setEditingAlarm] = useState<Alarm | null>(null);
  const [isSleepCalcOpen, setIsSleepCalcOpen] = useState(false);
  const [isNightstandOpen, setIsNightstandOpen] = useState(false);

  const [ringingAlarm, setRingingAlarm] = useState<Alarm | null>(null);
  const lastTriggeredMinuteRef = useRef<string>('');

  useEffect(() => {
    localStorage.setItem('chronowake_theme', themeId);
  }, [themeId]);

  useEffect(() => {
    localStorage.setItem('chronowake_format', clockFormat);
  }, [clockFormat]);

  useEffect(() => {
    localStorage.setItem('chronowake_alarms', JSON.stringify(alarms));
  }, [alarms]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const current = new Date();
      setNow(current);

      const hh = String(current.getHours()).padStart(2, '0');
      const mm = String(current.getMinutes()).padStart(2, '0');
      const timeKey = `${hh}:${mm}`;
      const dayOfWeek = current.getDay();

      if (lastTriggeredMinuteRef.current !== timeKey) {
        lastTriggeredMinuteRef.current = timeKey;

        alarms.forEach((alarm) => {
          if (!alarm.isEnabled) return;
          if (alarm.time !== timeKey) return;

          const hasDays = alarm.days && alarm.days.length > 0;
          if (hasDays && !alarm.days.includes(dayOfWeek)) {
            return;
          }

          triggerAlarm(alarm);

          if (!hasDays) {
            setAlarms((prev) =>
              prev.map((a) => (a.id === alarm.id ? { ...a, isEnabled: false } : a))
            );
          }
        });
      }
    }, 500);

    return () => clearInterval(interval);
  }, [alarms]);

  const triggerAlarm = (alarm: Alarm) => {
    setRingingAlarm(alarm);
    playAlarmSound(alarm.sound, alarm.volume);
  };

  const handleDismissAlarm = () => {
    stopAlarmLoop();
    setRingingAlarm(null);
  };

  const handleSnoozeAlarm = (minutes: number) => {
    stopAlarmLoop();
    setRingingAlarm(null);

    const snoozeDate = new Date(Date.now() + minutes * 60 * 1000);
    const shh = String(snoozeDate.getHours()).padStart(2, '0');
    const smm = String(snoozeDate.getMinutes()).padStart(2, '0');
    const snoozeTimeStr = `${shh}:${smm}`;

    const snoozeAlarm: Alarm = {
      id: `snooze-${Date.now()}`,
      time: snoozeTimeStr,
      label: `Snooze: ${ringingAlarm?.label || 'Alarm'}`,
      isEnabled: true,
      days: [],
      sound: ringingAlarm?.sound || 'zen',
      snoozeMinutes: minutes,
      requireMathToDismiss: ringingAlarm?.requireMathToDismiss || false,
      volume: ringingAlarm?.volume || 0.85,
      createdAt: Date.now(),
    };

    setAlarms((prev) => [snoozeAlarm, ...prev]);
  };

  const handleToggleAlarm = (id: string) => {
    setAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isEnabled: !a.isEnabled } : a))
    );
  };

  const handleDeleteAlarm = (id: string) => {
    setAlarms((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSaveAlarm = (data: Omit<Alarm, 'id' | 'createdAt'>) => {
    if (editingAlarm) {
      setAlarms((prev) =>
        prev.map((a) =>
          a.id === editingAlarm.id ? { ...a, ...data } : a
        )
      );
      setEditingAlarm(null);
    } else {
      const newAlarm: Alarm = {
        ...data,
        id: `alarm-${Date.now()}`,
        createdAt: Date.now(),
      };
      setAlarms((prev) => [newAlarm, ...prev]);
    }
  };

  const handleTestAlarmNow = () => {
    const testAlarm: Alarm = {
      id: 'test-alarm',
      time: 'NOW',
      label: 'Alarm Test Preview',
      isEnabled: true,
      days: [],
      sound: 'zen',
      snoozeMinutes: 5,
      requireMathToDismiss: false,
      volume: 0.85,
      createdAt: Date.now(),
    };
    triggerAlarm(testAlarm);
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-b ${currentTheme.bgGradient} ${
        currentTheme.isLightMode ? 'text-slate-900' : 'text-slate-100'
      } transition-colors duration-500 pb-16 flex flex-col`}
    >
      <header className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-5 pb-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold shadow-md ${currentTheme.accentBg}`}
          >
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base sm:text-lg tracking-tight">ChronoWake</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/10 font-mono uppercase tracking-wider">
                Pro
              </span>
            </div>
            <p className="text-[11px] opacity-60 hidden sm:block">
              Smart Alarm & Sleep Suite
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleTestAlarmNow}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              currentTheme.isLightMode
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
            }`}
            title="Preview how an alarm triggers and rings"
          >
            <Play className="w-3.5 h-3.5 text-emerald-400" />
            <span>Test Alarm</span>
          </button>

          <button
            onClick={() => setIsSleepCalcOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              currentTheme.isLightMode
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
            }`}
            title="Calculate optimal sleep and wake times"
          >
            <Moon className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Sleep Cycles</span>
          </button>

          <ThemeSelector
            currentTheme={currentTheme}
            onSelectTheme={(id) => setThemeId(id)}
          />
        </div>
      </header>

      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 mt-4 flex-1 space-y-6">
        <ClockDisplay
          now={now}
          theme={currentTheme}
          format={clockFormat}
          onFormatToggle={() =>
            setClockFormat((prev) => (prev === '12h' ? '24h' : '12h'))
          }
          view={clockView}
          onViewChange={setClockView}
          onEnterNightstand={() => setIsNightstandOpen(true)}
          alarms={alarms}
        />

        <AlarmList
          alarms={alarms}
          theme={currentTheme}
          onToggle={handleToggleAlarm}
          onDelete={handleDeleteAlarm}
          onEdit={(alarm) => {
            setEditingAlarm(alarm);
            setIsAddOpen(true);
          }}
          onAddNew={() => {
            setEditingAlarm(null);
            setIsAddOpen(true);
          }}
        />

        <AmbientPlayer theme={currentTheme} />
      </main>

      <AddAlarmDialog
        isOpen={isAddOpen}
        onClose={() => {
          setIsAddOpen(false);
          setEditingAlarm(null);
        }}
        onSave={handleSaveAlarm}
        theme={currentTheme}
        initialAlarm={editingAlarm}
      />

      <SleepCalculatorModal
        isOpen={isSleepCalcOpen}
        onClose={() => setIsSleepCalcOpen(false)}
        onSetAlarm={(time, label) => {
          const newAlarm: Alarm = {
            id: `alarm-${Date.now()}`,
            time,
            label,
            isEnabled: true,
            days: [],
            sound: 'zen',
            snoozeMinutes: 9,
            requireMathToDismiss: false,
            volume: 0.85,
            createdAt: Date.now(),
          };
          setAlarms((prev) => [newAlarm, ...prev]);
        }}
        theme={currentTheme}
      />

      {ringingAlarm && (
        <AlarmModal
          alarm={ringingAlarm}
          theme={currentTheme}
          onDismiss={handleDismissAlarm}
          onSnooze={handleSnoozeAlarm}
        />
      )}

      {isNightstandOpen && (
        <NightstandMode
          now={now}
          theme={currentTheme}
          format={clockFormat}
          onExit={() => setIsNightstandOpen(false)}
          alarms={alarms}
        />
      )}

      <footer className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-8 text-center text-xs opacity-50">
        ChronoWake • High-Precision Web Audio Alarm Clock • Switch between 8 themes anytime
      </footer>
    </div>
  );
}