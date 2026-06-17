/**
 * Простые синтезированные сигналы через WebAudio — без файлов-ассетов.
 * Глобальный тумблер из настроек. Контекст создаётся лениво по первому
 * пользовательскому жесту (политика автоплея).
 */

import { getSettings, setSettings } from "./storage";

let ctx: AudioContext | null = null;
let enabled = getSettings().sound;

function ensureCtx(): AudioContext | null {
  if (!enabled) return null;
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch {
      ctx = null;
    }
  }
  if (ctx?.state === "suspended") void ctx.resume();
  return ctx;
}

function blip(freq: number, durationMs: number, type: OscillatorType = "square", gain = 0.04): void {
  const ac = ensureCtx();
  if (!ac) return;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.value = gain;
  osc.connect(g).connect(ac.destination);
  const now = ac.currentTime;
  g.gain.setValueAtTime(gain, now);
  g.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000);
  osc.start(now);
  osc.stop(now + durationMs / 1000);
}

export const sound = {
  isEnabled: (): boolean => enabled,

  toggle(): boolean {
    enabled = !enabled;
    setSettings({ ...getSettings(), sound: enabled });
    if (enabled) blip(660, 80);
    return enabled;
  },

  jump(): void {
    blip(520, 90, "square", 0.035);
  },

  point(): void {
    blip(880, 70, "square", 0.03);
  },

  die(): void {
    blip(200, 260, "sawtooth", 0.05);
  },
};
