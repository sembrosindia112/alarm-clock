import React from 'react';
import { ThemeConfig } from '../types/alarm';

interface AnalogClockProps {
  now: Date;
  theme: ThemeConfig;
  size?: number;
}

export const AnalogClock: React.FC<AnalogClockProps> = ({ now, theme, size = 180 }) => {
  const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
  const minutes = now.getMinutes() + seconds / 60;
  const hours = (now.getHours() % 12) + minutes / 60;

  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6;
  const hourDeg = hours * 30;

  const radius = size / 2;
  const center = radius;

  const hourTicks = Array.from({ length: 12 }).map((_, i) => {
    const angle = (i * 30 * Math.PI) / 180;
    const isQuarter = i % 3 === 0;
    const outerRadius = radius - 10;
    const innerRadius = radius - (isQuarter ? 22 : 16);
    const x1 = center + innerRadius * Math.sin(angle);
    const y1 = center - innerRadius * Math.cos(angle);
    const x2 = center + outerRadius * Math.sin(angle);
    const y2 = center - outerRadius * Math.cos(angle);
    return { x1, y1, x2, y2, isQuarter, i };
  });

  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="drop-shadow-md">
        <circle
          cx={center}
          cy={center}
          r={radius - 4}
          fill="rgba(0, 0, 0, 0.25)"
          stroke={theme.isLightMode ? '#cbd5e1' : 'rgba(255, 255, 255, 0.15)'}
          strokeWidth="2"
        />

        {hourTicks.map((tick) => (
          <line
            key={tick.i}
            x1={tick.x1}
            y1={tick.y1}
            x2={tick.x2}
            y2={tick.y2}
            stroke={
              tick.isQuarter
                ? theme.accentColor
                : theme.isLightMode
                ? '#94a3b8'
                : 'rgba(255, 255, 255, 0.35)'
            }
            strokeWidth={tick.isQuarter ? 3 : 1.5}
            strokeLinecap="round"
          />
        ))}

        <line
          x1={center}
          y1={center}
          x2={center + (radius - 50) * Math.sin((hourDeg * Math.PI) / 180)}
          y2={center - (radius - 50) * Math.cos((hourDeg * Math.PI) / 180)}
          stroke={theme.isLightMode ? '#0f172a' : '#f8fafc'}
          strokeWidth="4"
          strokeLinecap="round"
        />

        <line
          x1={center}
          y1={center}
          x2={center + (radius - 30) * Math.sin((minuteDeg * Math.PI) / 180)}
          y2={center - (radius - 30) * Math.cos((minuteDeg * Math.PI) / 180)}
          stroke={theme.isLightMode ? '#334155' : '#cbd5e1'}
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        <line
          x1={center - 12 * Math.sin((secondDeg * Math.PI) / 180)}
          y1={center + 12 * Math.cos((secondDeg * Math.PI) / 180)}
          x2={center + (radius - 18) * Math.sin((secondDeg * Math.PI) / 180)}
          y2={center - (radius - 18) * Math.cos((secondDeg * Math.PI) / 180)}
          stroke={theme.accentColor}
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        <circle cx={center} cy={center} r={4.5} fill={theme.accentColor} />
        <circle cx={center} cy={center} r={2} fill="#ffffff" />
      </svg>
    </div>
  );
};