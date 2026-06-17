/**
 * Безопасный верхний отступ в CSS-пикселях: чёлка/динамический остров устройства
 * + шапка Telegram (кнопки «Закрыть» / «…»). Чтобы счёт и солнце не уезжали под
 * системные элементы.
 *
 * Источники (по убыванию надёжности):
 * 1. Telegram.WebApp.safeAreaInset / contentSafeAreaInset (Bot API 8.0+).
 * 2. CSS env(safe-area-inset-top) через скрытый пробник.
 * 3. Запасной отступ под шапку Telegram для старых клиентов.
 */

interface TgInsets {
  safeAreaInset?: { top?: number };
  contentSafeAreaInset?: { top?: number };
}

let probe: HTMLDivElement | null = null;

function envInsetTop(): number {
  if (!probe) {
    probe = document.createElement("div");
    probe.style.cssText =
      "position:fixed;top:0;left:0;width:0;height:env(safe-area-inset-top);visibility:hidden;pointer-events:none;";
    document.body.appendChild(probe);
  }
  return probe.getBoundingClientRect().height;
}

export function topInsetCss(): number {
  const tg = (window.Telegram?.WebApp as TgInsets | undefined) ?? undefined;
  const device = Math.max(envInsetTop(), tg?.safeAreaInset?.top ?? 0);
  // Высота шапки Telegram с кнопками: из API, иначе разумный запас в Telegram.
  const header = tg?.contentSafeAreaInset?.top ?? (window.Telegram?.WebApp ? 52 : 0);
  return device + header;
}
