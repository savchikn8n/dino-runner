/**
 * Лёгкая обёртка над localStorage: рекорд и настройки. Всё под одним префиксом.
 * Задел под рост: сюда же позже ляжет кэш профиля/лидерборда.
 */

const PREFIX = "dino:";

interface Settings {
  sound: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  sound: true,
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* приватный режим / переполнение — молча игнорируем */
  }
}

export function getHighScore(): number {
  return read<number>("highScore", 0);
}

export function setHighScore(score: number): void {
  write("highScore", Math.floor(score));
}

export function getSettings(): Settings {
  return { ...DEFAULT_SETTINGS, ...read<Partial<Settings>>("settings", {}) };
}

export function setSettings(settings: Settings): void {
  write("settings", settings);
}
