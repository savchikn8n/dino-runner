/**
 * Простейший роутер экранов-оверлеев поверх canvas. Показывает один экран за раз.
 * Когда экран не нужен (идёт игра) — контейнер прозрачен для кликов, и тапы
 * уходят в canvas/обработчик прыжка.
 */

export class ScreenManager {
  constructor(private readonly root: HTMLElement) {}

  /** Показать экран (узел DOM). null → убрать оверлей (игровой режим). */
  show(node: HTMLElement | null): void {
    this.root.replaceChildren();
    if (node) {
      this.root.classList.add("ui--active");
      this.root.append(node);
    } else {
      this.root.classList.remove("ui--active");
    }
  }
}
