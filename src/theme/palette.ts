/**
 * Палитра = именованная тема из двух цветов: ink (тёмный «мокрый асфальт» —
 * Т-Рекс, трасса, спрайты) и paper (фон). Всё рисуется только этими цветами.
 *
 * Задел под рост: добавление биома или расширение гаммы = новая запись в THEMES.
 * Раунд хранит активную тему, рендеры берут цвет отсюда.
 */

export interface Palette {
  /** Человекочитаемое имя (для будущего меню выбора биома). */
  name: string;
  /** Основной тёмный цвет: фигуры, текст, трасса. */
  ink: string;
  /** Цвет фона. */
  paper: string;
}

export const THEMES = {
  asphalt: {
    name: "Мокрый асфальт",
    ink: "#2b2b2b",
    paper: "#f7f7f7",
  },
  // Заготовки под будущие биомы — пока не используются в UI:
  night: {
    name: "Ночь",
    ink: "#e8e8e8",
    paper: "#1b1d22",
  },
  sand: {
    name: "Пустыня",
    ink: "#3a2f23",
    paper: "#f3e7cf",
  },
} as const satisfies Record<string, Palette>;

export type ThemeId = keyof typeof THEMES;

export const DEFAULT_THEME: ThemeId = "asphalt";

export function getTheme(id: ThemeId): Palette {
  return THEMES[id];
}
