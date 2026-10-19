import React from 'react';
import { ClockFormat, ClockView, ThemeConfig, Alarm } from '../types/alarm';
import { AnalogClock } from './AnalogClock';
import { Maximize2, Calendar, Bell } from 'lucide-react';

interface ClockDisplayProps {
  now: Date;
  theme: ThemeConfig;
  format: ClockFormat;
  onFormatToggle: () => void;
  view: ClockView;
  onViewChange: (view: ClockView) => void;
  onEnterNightstand: () => void;
  alarms: Alarm[];
}

export const ClockDisplay: React.FC<ClockDisplayProps> = ({
  now,
  theme,
  format,
  onFormatToggle,
  view,
  onViewChange,
  onEnterNightstand,
  alarms,
}) => {
  let rawHours = now.getHours();
  const rawMinutes = now.getMinutes();
  const rawSeconds = now.getSeconds();
  let ampm = '';

  if (format === '12h') {
    ampm = rawHours >= 12 ? 'PM' : 'AM';
    rawHours = rawHours % 12 || 12;
  }

  const hoursStr = String(rawHours).padStart(format === '24h' ? 2 : 1, '0');
  const minutesStr = String(rawMinutes).padStart(2, '0');
  const secondsStr = String(rawSeconds).padStart(2, '0');

  const dateStr = now.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const nextAlarm = getNextAlarmTime(alarms, now);

  return (
    <div
      className={`relative w-full rounded-3xl p-6 sm:p-8 transition-all duration-300 border ${theme.cardBg} ${theme.borderClass}`}
    >
      <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-2">
          {nextAlarm ? (
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide ${theme.badgeBg}`}
            >
              <Bell className="w-3.5 h-3.5 animate-pulse" />
              <span>Next: {nextAlarm.timeString} ({nextAlarm.relativeString})</span>
            </div>
          ) : (
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                theme.isLightMode ? 'bg-slate-200/70 text-slate-600' : 'bg-white/5 text-slate-400'
              }`}
            >
              <Bell className="w-3.5 h-3.5 opacity-60" />
              <span>No active alarms</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onFormatToggle}
            className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-all border ${
              theme.isLightMode
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
            }`}
            title="Toggle 12h / 24h format"
          >
            {format.toUpperCase()}
          </button>

          <div
            className={`flex items-center p-0.5 rounded-lg border text-xs ${
              theme.isLightMode
                ? 'bg-slate-100 border-slate-300 text-slate-700'
                : 'bg-white/5 border-white/10 text-slate-300'
            }`}
          >
            <button
              onClick={() => onViewChange('digital')}
              className={`px-2 py-1 rounded transition-all ${
                view === 'digital' ? theme.accentBg : 'hover:text-white opacity-80'
              }`}
            >
              Digital
            </button>
            <button
              onClick={() => onViewChange('both')}
              className={`px-2 py-1 rounded transition-all hidden sm:block ${
                view === 'both' ? theme.accentBg : 'hover:text-white opacity-80'
              }`}
            >
              Both
            </button>
            <button
              onClick={() => onViewChange('analog')}
              className={`px-2 py-1 rounded transition-all ${
                view === 'analog' ? theme.accentBg : 'hover:text-white opacity-80'
              }`}
            >
              Analog
            </button>
          </div>

          <button
            onClick={onEnterNightstand}
            className={`p-1.5 rounded-lg transition-all border ${
              theme.isLightMode
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-white'
            }`}
            title="Full-Screen Bedside Clock Mode"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        className={`flex flex-col md:flex-row items-center justify-center gap-8 ${
          view === 'analog' ? 'py-4' : 'py-2'
        }`}
      >
        {(view === 'analog' || view === 'both') && (
          <div className="flex-shrink-0 animate-in fade-in zoom-in-95 duration-200">
            <AnalogClock now={now} theme={theme} size={view === 'both' ? 150 : 210} />
          </div>
        )}

        {(view === 'digital' || view === 'both') && (
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex items-baseline justify-center tracking-tight">
              <span
                className={`text-6xl sm:text-7xl lg:text-8xl font-bold transition-all ${theme.fontClass} ${theme.timeColor} ${theme.glowClass}`}
              >
                {hoursStr}
                <span className="opacity-90 animate-[pulse_1s_ease-in-out_infinite]">:</span>
                {minutesStr}
              </span>

              <div className="flex flex-col items-start ml-2 sm:ml-3">
                {format === '12h' && (
                  <span
                    className={`text-sm sm:text-base font-bold tracking-widest ${theme.subtextColor}`}
                  >
                    {ampm}
                  </span>
                )}
                <span className={`text-lg sm:text-2xl font-mono opacity-85 ${theme.timeColor}`}>
                  :{secondsStr}
                </span>
              </div>
            </div>

            <div
              className={`flex items-center gap-2 mt-3 text-sm sm:text-base font-medium opacity-85 ${
                theme.isLightMode ? 'text-slate-600' : 'text-slate-300'
              }`}
            >
              <Calendar className="w-4 h-4 opacity-70" />
              <span>{dateStr}</span>
            </div>
          </div>
        )}
      </div>

      {theme.id === 'retro-lcd' && (
        <div className="pointer-events-none absolute inset-0 rounded-3xl scanline-bg opacity-40" />
      )}
    </div>
  );
};

function getNextAlarmTime(
  alarms: Alarm[],
  now: Date
): { alarm: Alarm; timeString: string; relativeString: string } | null {
  const activeAlarms = alarms.filter((a) => a.isEnabled);
  if (activeAlarms.length === 0) return null;

  const currentMinutesFromMidnight = now.getHours() * 60 + now.getMinutes();
  const currentDay = now.getDay();

  let earliestDiffMinutes = Infinity;
  let nextAlarm: Alarm | null = null;
  let targetTimeStr = '';

  for (const alarm of activeAlarms) {
    const [h, m] = alarm.time.split(':').map(Number);
    const alarmMinutesFromMidnight = h * 60 + m;

    if (!alarm.days || alarm.days.length === 0) {
      let diff = alarmMinutesFromMidnight - currentMinutesFromMidnight;
      if (diff <= 0) {
        diff += 24 * 60;
      }
      if (diff < earliestDiffMinutes) {
        earliestDiffMinutes = diff;
        nextAlarm = alarm;
        targetTimeStr = alarm.time;
      }
    } else {
      for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        const testDay = (currentDay + dayOffset) % 7;
        if (alarm.days.includes(testDay)) {
          let diff = dayOffset * 24 * 60 + (alarmMinutesFromMidnight - currentMinutesFromMidnight);
          if (diff <= 0) {
            diff += 7 * 24 * 60;
          }
          if (diff < earliestDiffMinutes) {
            earliestDiffMinutes = diff;
            nextAlarm = alarm;
            targetTimeStr = alarm.time;
          }
        }
      }
    }
  }

  if (!nextAlarm) return null;

  const hours = Math.floor(earliestDiffMinutes / 60);
  const mins = earliestDiffMinutes % 60;

  let relativeString = '';
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    const remHours = hours % 24;
    relativeString = `in ${days}d ${remHours}h`;
  } else if (hours > 0) {
    relativeString = `in ${hours}h ${mins}m`;
  } else {
    relativeString = `in ${mins}m`;
  }

  return {
    alarm: nextAlarm,
    timeString: targetTimeStr,
    relativeString,
  };
}