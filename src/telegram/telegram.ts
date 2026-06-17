/**
 * Тонкая обёртка над Telegram WebApp SDK (window.Telegram.WebApp).
 * Игра должна работать и вне Telegram (в обычном браузере) — поэтому все вызовы
 * безопасны при отсутствии SDK.
 *
 * Задел под рост: здесь же будет доступ к initData для авторизации лидерборда.
 */

interface TgHaptic {
  impactOccurred(style: "light" | "medium" | "heavy" | "rigid" | "soft"): void;
  notificationOccurred(type: "error" | "success" | "warning"): void;
}

interface TgWebApp {
  ready(): void;
  expand(): void;
  disableVerticalSwipes?(): void;
  setHeaderColor?(color: string): void;
  setBackgroundColor?(color: string): void;
  openTelegramLink?(url: string): void;
  openLink?(url: string): void;
  onEvent?(event: string, handler: () => void): void;
  HapticFeedback?: TgHaptic;
  initDataUnsafe?: { user?: { id: number; first_name?: string; username?: string } };
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TgWebApp };
  }
}

function app(): TgWebApp | undefined {
  return window.Telegram?.WebApp;
}

export const isTelegram = (): boolean => Boolean(app());

/** Готовность + разворот на весь экран + защита от случайного свайпа-закрытия. */
export function initTelegram(paper: string, ink: string): void {
  const tg = app();
  if (!tg) return;
  try {
    tg.ready();
    tg.expand();
    tg.disableVerticalSwipes?.();
    tg.setBackgroundColor?.(paper);
    tg.setHeaderColor?.(ink);
  } catch {
    /* старые клиенты могут не поддерживать часть методов */
  }
}

/** Подписка на изменения раскладки Telegram (разворот, чёлка, шапка). */
export function onLayoutChange(cb: () => void): void {
  const tg = app();
  if (!tg?.onEvent) return;
  for (const evt of ["viewportChanged", "safeAreaChanged", "contentSafeAreaChanged"]) {
    try {
      tg.onEvent(evt, cb);
    } catch {
      /* событие не поддерживается этим клиентом */
    }
  }
}

export function haptic(style: "light" | "medium" | "heavy" = "light"): void {
  try {
    app()?.HapticFeedback?.impactOccurred(style);
  } catch {
    /* нет вибро — не страшно */
  }
}

export function hapticError(): void {
  try {
    app()?.HapticFeedback?.notificationOccurred("error");
  } catch {
    /* ignore */
  }
}

/** Открыть ссылку на канал/профиль. Внутри Telegram — нативно, иначе — новая вкладка. */
export function openLink(url: string): void {
  const tg = app();
  if (tg?.openTelegramLink && url.includes("t.me")) {
    tg.openTelegramLink(url);
  } else if (tg?.openLink) {
    tg.openLink(url);
  } else {
    window.open(url, "_blank", "noopener");
  }
}

/** Telegram user id — пригодится для будущих профилей/лидерборда. */
export function getUserId(): number | null {
  return app()?.initDataUnsafe?.user?.id ?? null;
}
