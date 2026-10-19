import React, { useState, useEffect } from 'react';
import { AmbientSoundId, ThemeConfig } from '../types/alarm';
import { playAmbientSound, stopAmbientSound } from '../utils/audio';
import { CloudRain, Waves, Flame, Wind, Volume2, Pause, Timer } from 'lucide-react';

interface AmbientPlayerProps {
  theme: ThemeConfig;
}

const AMBIENT_OPTIONS: { id: AmbientSoundId; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'rain', label: 'Rain', icon: CloudRain },
  { id: 'ocean', label: 'Ocean Waves', icon: Waves },
  { id: 'campfire', label: 'Campfire', icon: Flame },
  { id: 'whitenoise', label: 'White Noise', icon: Wind },
];

export const AmbientPlayer: React.FC<AmbientPlayerProps> = ({ theme }) => {
  const [currentSound, setCurrentSound] = useState<AmbientSoundId>('none');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [timerMinutes, setTimerMinutes] = useState<number | null>(null);
  const [timerRemaining, setTimerRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (!isPlaying || !timerMinutes) {
      setTimerRemaining(null);
      return;
    }

    setTimerRemaining(timerMinutes * 60);
    const interval = window.setInterval(() => {
      setTimerRemaining((prev) => {
        if (prev === null || prev <= 1) {
          handleStop();
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, timerMinutes]);

  const handleSelectSound = (id: AmbientSoundId) => {
    if (currentSound === id && isPlaying) {
      handleStop();
      return;
    }
    setCurrentSound(id);
    setIsPlaying(true);
    playAmbientSound(id, volume);
  };

  const handleStop = () => {
    stopAmbientSound();
    setIsPlaying(false);
    setCurrentSound('none');
    setTimerMinutes(null);
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (isPlaying && currentSound !== 'none') {
      playAmbientSound(currentSound, newVol);
    }
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div
      className={`w-full rounded-3xl p-6 transition-all border ${theme.cardBg} ${theme.borderClass}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold flex items-center gap-2">
            <span>Sleep Sound Generator</span>
            {isPlaying && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            )}
          </h3>
          <p className="text-xs opacity-60">
            Natural synthesized ambient audio to help you drift off to sleep
          </p>
        </div>

        {isPlaying && (
          <button
            onClick={handleStop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 transition-all"
          >
            <Pause className="w-3.5 h-3.5" />
            <span>Stop Sound</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
        {AMBIENT_OPTIONS.map((item) => {
          const Icon = item.icon;
          const isActive = currentSound === item.id && isPlaying;
          return (
            <button
              key={item.id}
              onClick={() => handleSelectSound(item.id)}
              className={`flex items-center gap-2.5 p-3 rounded-2xl border transition-all text-xs font-semibold ${
                isActive
                  ? theme.accentBg
                  : theme.isLightMode
                  ? 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-white/10 text-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Volume2 className="w-4 h-4 opacity-70" />
          <input
            type="range"
            min="0.05"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-28 accent-cyan-400 cursor-pointer h-1.5 bg-white/20 rounded-lg"
          />
          <span className="opacity-70 font-mono w-8">{Math.round(volume * 100)}%</span>
        </div>

        <div className="flex items-center gap-2">
          <Timer className="w-3.5 h-3.5 opacity-70" />
          <span className="opacity-70">Sleep Timer:</span>
          {[15, 30, 45, 60].map((mins) => (
            <button
              key={mins}
              onClick={() => setTimerMinutes(mins)}
              className={`px-2 py-1 rounded-lg border text-[11px] transition-all ${
                timerMinutes === mins
                  ? theme.accentBg
                  : 'bg-white/5 border-white/10 hover:bg-white/15'
              }`}
            >
              {mins}m
            </button>
          ))}
          {timerRemaining !== null && (
            <span className="font-mono text-cyan-400 font-bold ml-1">
              ({formatTimer(timerRemaining)})
            </span>
          )}
        </div>
      </div>
    </div>
  );
};