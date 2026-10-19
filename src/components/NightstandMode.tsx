import React, { useState } from 'react';
import { ClockFormat, ThemeConfig, Alarm } from '../types/alarm';
import { Minimize2, Moon, Sun, Bell } from 'lucide-react';

interface NightstandModeProps {
  now: Date;
  theme: ThemeConfig;
  format: ClockFormat;
  onExit: () => void;
  alarms: Alarm[];
}

export const NightstandMode: React.FC<NightstandModeProps> = ({
  now,
  theme,
  format,
  onExit,
  alarms,
}) => {
  const [brightness, setBrightness] = useState(0.85);

  let rawHours = now.getHours();
  const rawMinutes = now.getMinutes();
  let ampm = '';

  if (format === '12h') {
    ampm = rawHours >= 12 ? 'PM' : 'AM';
    rawHours = rawHours % 12 || 12;
  }

  const hoursStr = String(rawHours).padStart(format === '24h' ? 2 : 1, '0');
  const minutesStr = String(rawMinutes).padStart(2, '0');

  const dateStr = now.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const activeAlarms = alarms.filter((a) => a.isEnabled);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-12 bg-black transition-opacity select-none"
      style={{ opacity: brightness }}
    >
      <div className="w-full flex items-center justify-between text-xs sm:text-sm">
        <div className="flex items-center gap-2 opacity-70">
          <Bell className="w-4 h-4 text-cyan-400" />
          <span>
            {activeAlarms.length > 0
              ? `${activeAlarms.length} active alarm${activeAlarms.length > 1 ? 's' : ''}`
              : 'No alarms set'}
          </span>
        </div>

        <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-2xl backdrop-blur-md">
          <Moon className="w-4 h-4 opacity-70" />
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={brightness}
            onChange={(e) => setBrightness(parseFloat(e.target.value))}
            className="w-24 accent-cyan-400 cursor-pointer h-1.5"
            title="Screen Dimmer"
          />
          <Sun className="w-4 h-4 opacity-70" />
        </div>

        <button
          onClick={onExit}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all text-xs font-semibold"
        >
          <Minimize2 className="w-4 h-4" />
          <span>Exit Bedside</span>
        </button>
      </div>

      <div className="flex flex-col items-center justify-center text-center my-auto">
        <div className="flex items-baseline justify-center">
          <span
            className={`text-8xl sm:text-[14rem] lg:text-[18rem] leading-none font-black tracking-tight ${theme.fontClass} ${theme.timeColor} ${theme.glowClass}`}
          >
            {hoursStr}
            <span className="opacity-80 animate-[pulse_1s_ease-in-out_infinite]">:</span>
            {minutesStr}
          </span>
          {format === '12h' && (
            <span
              className={`text-2xl sm:text-4xl font-bold ml-4 tracking-wider ${theme.subtextColor}`}
            >
              {ampm}
            </span>
          )}
        </div>

        <p className="text-xl sm:text-3xl font-medium opacity-70 mt-6 tracking-wide">
          {dateStr}
        </p>
      </div>

      <div className="text-center text-xs opacity-40">
        Bedside Dock Mode • ChronoWake
      </div>
    </div>
  );
};