export type SoundId = 'zen' | 'classic' | 'marimba' | 'radar' | 'arcade' | 'chime';

export type AmbientSoundId = 'none' | 'rain' | 'ocean' | 'whitenoise' | 'campfire';

export interface Alarm {
  id: string;
  time: string; // "07:30" (24-hour format)
  label: string;
  isEnabled: boolean;
  days: number[]; // 0 = Sunday, 1 = Monday, etc. Empty = once
  sound: SoundId;
  snoozeMinutes: number; // e.g. 5, 9, 10, 15
  requireMathToDismiss: boolean;
  volume: number; // 0 to 1
  createdAt: number;
}

export type ThemeId =
  | 'cyberpunk'
  | 'midnight'
  | 'retro-lcd'
  | 'sunrise'
  | 'matrix'
  | 'nordic'
  | 'vaporwave'
  | 'emerald';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  category: 'dark' | 'light' | 'retro' | 'vibrant';
  description: string;
  fontClass: string;
  bgGradient: string;
  cardBg: string;
  borderClass: string;
  accentColor: string;
  accentBg: string;
  accentHover: string;
  glowClass: string;
  timeColor: string;
  subtextColor: string;
  badgeBg: string;
  badgeText: string;
  isLightMode?: boolean;
}

export type ClockFormat = '12h' | '24h';
export type ClockView = 'digital' | 'analog' | 'both';