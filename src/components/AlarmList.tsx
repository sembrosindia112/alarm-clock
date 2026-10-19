import React from 'react';
import { Alarm, ThemeConfig } from '../types/alarm';
import { Bell, Trash2, Edit2, Brain, Plus } from 'lucide-react';

interface AlarmListProps {
  alarms: Alarm[];
  theme: ThemeConfig;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (alarm: Alarm) => void;
  onAddNew: () => void;
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const AlarmList: React.FC<AlarmListProps> = ({
  alarms,
  theme,
  onToggle,
  onDelete,
  onEdit,
  onAddNew,
}) => {
  return (
    <div
      className={`w-full rounded-3xl p-6 transition-all border ${theme.cardBg} ${theme.borderClass}`}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl ${theme.badgeBg}`}>
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold">Your Alarms</h3>
            <p className="text-xs opacity-60">
              {alarms.length} {alarms.length === 1 ? 'alarm' : 'alarms'} configured
            </p>
          </div>
        </div>

        <button
          onClick={onAddNew}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${theme.accentBg}`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Alarm</span>
        </button>
      </div>

      {alarms.length === 0 ? (
        <div
          className={`flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed ${
            theme.isLightMode ? 'border-slate-300' : 'border-white/10'
          }`}
        >
          <Bell className="w-10 h-10 opacity-30 mb-2" />
          <p className="text-sm font-semibold">No alarms set</p>
          <p className="text-xs opacity-60 mt-1 max-w-xs">
            Set your morning wake-up time or a quick nap timer to get started.
          </p>
          <button
            onClick={onAddNew}
            className={`mt-4 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${theme.accentBg}`}
          >
            Create Alarm
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {alarms.map((alarm) => {
            const hasDays = alarm.days && alarm.days.length > 0;
            const isDaily = alarm.days && alarm.days.length === 7;
            const isWeekdays =
              alarm.days &&
              alarm.days.length === 5 &&
              [1, 2, 3, 4, 5].every((d) => alarm.days.includes(d));

            return (
              <div
                key={alarm.id}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                  alarm.isEnabled
                    ? theme.isLightMode
                      ? 'bg-slate-50 border-slate-200'
                      : 'bg-white/5 border-white/10'
                    : theme.isLightMode
                    ? 'bg-slate-100/50 border-slate-200 opacity-60'
                    : 'bg-black/20 border-white/5 opacity-50'
                }`}
              >
                <div className="flex flex-col gap-1 min-w-0 pr-3">
                  <div className="flex items-baseline gap-2.5">
                    <span
                      className={`text-2xl sm:text-3xl font-bold tracking-tight ${theme.fontClass} ${
                        alarm.isEnabled ? theme.timeColor : 'text-slate-400'
                      }`}
                    >
                      {alarm.time}
                    </span>
                    <span className="text-xs sm:text-sm font-medium truncate max-w-[120px] sm:max-w-[200px] opacity-90">
                      {alarm.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap text-[11px] opacity-75">
                    <span>
                      {isDaily
                        ? 'Every day'
                        : isWeekdays
                        ? 'Weekdays'
                        : hasDays
                        ? alarm.days.map((d) => DAY_NAMES[d]).join(', ')
                        : 'Once'}
                    </span>

                    <span>•</span>
                    <span className="capitalize">{alarm.sound}</span>

                    {alarm.requireMathToDismiss && (
                      <span className="flex items-center gap-0.5 text-pink-400 font-medium">
                        <Brain className="w-3 h-3" />
                        Math
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onEdit(alarm)}
                    className={`p-2 rounded-lg opacity-60 hover:opacity-100 transition-all ${
                      theme.isLightMode ? 'hover:bg-slate-200' : 'hover:bg-white/10'
                    }`}
                    title="Edit Alarm"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDelete(alarm.id)}
                    className={`p-2 rounded-lg opacity-60 hover:opacity-100 hover:text-red-400 transition-all ${
                      theme.isLightMode ? 'hover:bg-slate-200' : 'hover:bg-white/10'
                    }`}
                    title="Delete Alarm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={alarm.isEnabled}
                    onClick={() => onToggle(alarm.id)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      alarm.isEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        alarm.isEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};