import { SoundId, AmbientSoundId } from '../types/alarm';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

let alarmLoopInterval: number | null = null;
let activeAmbientNodes: { source: AudioNode; gain: GainNode } | null = null;
let ambientInterval: number | null = null;

export function playAlarmSound(sound: SoundId, volume: number = 0.8) {
  stopAlarmLoop();
  const ctx = getAudioContext();

  const playPhrase = () => {
    switch (sound) {
      case 'classic':
        playClassicBeep(ctx, volume);
        break;
      case 'zen':
        playZenChime(ctx, volume);
        break;
      case 'marimba':
        playMarimba(ctx, volume);
        break;
      case 'radar':
        playRadarSweep(ctx, volume);
        break;
      case 'arcade':
        playArcadeTune(ctx, volume);
        break;
      case 'chime':
      default:
        playGentleChimes(ctx, volume);
        break;
    }
  };

  playPhrase();
  const intervalMs =
    sound === 'zen'
      ? 3200
      : sound === 'marimba'
      ? 2200
      : sound === 'radar'
      ? 1800
      : sound === 'arcade'
      ? 2000
      : 1600;
  alarmLoopInterval = window.setInterval(playPhrase, intervalMs);
}

export function previewSound(sound: SoundId, volume: number = 0.8) {
  stopAlarmLoop();
  const ctx = getAudioContext();
  switch (sound) {
    case 'classic':
      playClassicBeep(ctx, volume);
      break;
    case 'zen':
      playZenChime(ctx, volume);
      break;
    case 'marimba':
      playMarimba(ctx, volume);
      break;
    case 'radar':
      playRadarSweep(ctx, volume);
      break;
    case 'arcade':
      playArcadeTune(ctx, volume);
      break;
    case 'chime':
    default:
      playGentleChimes(ctx, volume);
      break;
  }
}

export function stopAlarmLoop() {
  if (alarmLoopInterval) {
    clearInterval(alarmLoopInterval);
    alarmLoopInterval = null;
  }
}

function playClassicBeep(ctx: AudioContext, vol: number) {
  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(vol * 0.45, now);
  masterGain.connect(ctx.destination);

  [0, 0.18, 0.36, 0.54].forEach((offset) => {
    const osc = ctx.createOscillator();
    const noteGain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(880, now + offset);
    osc.frequency.setValueAtTime(1046.5, now + offset + 0.05);

    noteGain.gain.setValueAtTime(0, now + offset);
    noteGain.gain.linearRampToValueAtTime(1, now + offset + 0.01);
    noteGain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.12);

    osc.connect(noteGain);
    noteGain.connect(masterGain);

    osc.start(now + offset);
    osc.stop(now + offset + 0.14);
  });
}

function playZenChime(ctx: AudioContext, vol: number) {
  const now = ctx.currentTime;
  const frequencies = [528, 792, 1056, 1584];
  const weights = [0.6, 0.3, 0.2, 0.1];

  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(vol * 0.5, now);
  masterGain.connect(ctx.destination);

  frequencies.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(weights[idx], now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(now);
    osc.stop(now + 2.9);
  });
}

function playMarimba(ctx: AudioContext, vol: number) {
  const now = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.5];
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(vol * 0.55, now);
  masterGain.connect(ctx.destination);

  notes.forEach((freq, i) => {
    const time = now + i * 0.18;
    const osc = ctx.createOscillator();
    const overtone = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    overtone.type = 'triangle';
    overtone.frequency.setValueAtTime(freq * 3, time);

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(1, time + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.7);

    osc.connect(gain);
    overtone.connect(gain);
    gain.connect(masterGain);

    osc.start(time);
    overtone.start(time);
    osc.stop(time + 0.75);
    overtone.stop(time + 0.75);
  });
}

function playRadarSweep(ctx: AudioContext, vol: number) {
  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(vol * 0.5, now);
  masterGain.connect(ctx.destination);

  [0, 0.45].forEach((offset) => {
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1200, now + offset);
    osc.frequency.exponentialRampToValueAtTime(300, now + offset + 0.35);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2500, now + offset);
    filter.frequency.exponentialRampToValueAtTime(500, now + offset + 0.35);
    filter.Q.value = 8;

    gain.gain.setValueAtTime(0, now + offset);
    gain.gain.linearRampToValueAtTime(0.8, now + offset + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.38);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);

    osc.start(now + offset);
    osc.stop(now + offset + 0.4);
  });
}

function playArcadeTune(ctx: AudioContext, vol: number) {
  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(vol * 0.4, now);
  masterGain.connect(ctx.destination);

  const notes = [440, 554.37, 659.25, 880, 739.99, 880, 1108.73];
  const step = 0.1;

  notes.forEach((freq, idx) => {
    const time = now + idx * step;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.6, time + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, time + step * 0.95);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(time);
    osc.stop(time + step);
  });
}

function playGentleChimes(ctx: AudioContext, vol: number) {
  const now = ctx.currentTime;
  const notes = [659.25, 830.61, 987.77, 1318.51, 1661.22];
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(vol * 0.5, now);
  masterGain.connect(ctx.destination);

  notes.forEach((freq, idx) => {
    const time = now + idx * 0.15;
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2.01, time);

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.7, time + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 1.6);

    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(masterGain);

    osc.start(time);
    osc2.start(time);
    osc.stop(time + 1.7);
    osc2.stop(time + 1.7);
  });
}

export function stopAmbientSound() {
  if (ambientInterval) {
    clearInterval(ambientInterval);
    ambientInterval = null;
  }
  if (activeAmbientNodes) {
    try {
      activeAmbientNodes.gain.gain.setTargetAtTime(0, getAudioContext().currentTime, 0.2);
      setTimeout(() => {
        try {
          (activeAmbientNodes?.source as AudioBufferSourceNode)?.stop();
        } catch {
          // ignore
        }
        activeAmbientNodes = null;
      }, 300);
    } catch {
      activeAmbientNodes = null;
    }
  }
}

export function playAmbientSound(type: AmbientSoundId, volume: number = 0.5) {
  stopAmbientSound();
  if (type === 'none') return;

  const ctx = getAudioContext();
  const sampleRate = ctx.sampleRate;
  const bufferDuration = 5;
  const frameCount = sampleRate * bufferDuration;
  const buffer = ctx.createBuffer(2, frameCount, sampleRate);

  const left = buffer.getChannelData(0);
  const right = buffer.getChannelData(1);

  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0;
  for (let i = 0; i < frameCount; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    const pink = (b0 + b1 + b2 + b3 + b4) * 0.11;

    left[i] = pink;
    right[i] = pink * 0.8 + (Math.random() * 2 - 1) * 0.2;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const filter = ctx.createBiquadFilter();
  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(0.01, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(volume * 0.35, ctx.currentTime + 1.2);

  if (type === 'rain') {
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, ctx.currentTime);
    source.connect(filter);
    filter.connect(gainNode);
  } else if (type === 'ocean') {
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, ctx.currentTime);
    filter.Q.value = 1.2;

    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(0.12, ctx.currentTime);
    lfoGain.gain.setValueAtTime(300, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    source.connect(filter);
    filter.connect(gainNode);
  } else if (type === 'campfire') {
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, ctx.currentTime);
    source.connect(filter);
    filter.connect(gainNode);
  } else {
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3000, ctx.currentTime);
    source.connect(filter);
    filter.connect(gainNode);
  }

  gainNode.connect(ctx.destination);
  source.start();

  activeAmbientNodes = { source, gain: gainNode };
}