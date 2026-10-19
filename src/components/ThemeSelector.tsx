import React, { useState } from 'react';
import { THEMES } from '../utils/themes';
import { ThemeConfig, ThemeId } from '../types/alarm';
import { Palette, Check, Sparkles } from 'lucide-react';

interface ThemeSelectorProps {
  currentTheme: ThemeConfig;
  onSelectTheme: (themeId: ThemeId) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onSelectTheme,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const themeList = Object.values(THEMES);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-all ${
          currentTheme.isLightMode
            ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800 shadow-sm'
            : 'bg-white/5 hover:bg-white/10 border-white/15 text-slate-200'
        }`}
        title="Change Clock Theme"
      >
        <Palette className="w-4 h-4 text-cyan-400" />
        <span className="hidden sm:inline">Theme:</span>
        <span className="font-semibold">{currentTheme.name}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div
            className={`absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl p-4 z-50 shadow-2xl border ${
              currentTheme.isLightMode
                ? 'bg-white border-slate-200 text-slate-900 shadow-slate-300/60'
                : 'bg-[#131622] border-white/15 text-slate-100 shadow-black/80'
            } animate-in fade-in zoom-in-95 duration-150`}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold">Choose Clock Theme</h3>
              </div>
              <span className="text-xs opacity-60">{themeList.length} themes</span>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-[360px] overflow-y-auto pr-1">
              {themeList.map((t) => {
                const isSelected = t.id === currentTheme.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      onSelectTheme(t.id);
                      setIsOpen(false);
                    }}
                    className={`flex flex-col text-left p-2.5 rounded-xl border transition-all text-xs relative ${
                      isSelected
                        ? `${t.borderClass} ring-2 ring-cyan-400/50 bg-white/10 font-medium`
                        : currentTheme.isLightMode
                        ? 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        : 'border-white/5 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-sm"
                          style={{ backgroundColor: t.accentColor }}
                        />
                        <span className="font-semibold truncate max-w-[100px]">
                          {t.name}
                        </span>
                      </div>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-cyan-400" />
                      )}
                    </div>
                    <p className="text-[10px] opacity-70 line-clamp-2 leading-relaxed">
                      {t.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};