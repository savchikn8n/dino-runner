import type { GameOverInfo } from "../game/Game";

/** Навигация между экранами. Реализуется в main.ts. */
export interface Nav {
  toMenu(): void;
  toSettings(): void;
  toDonate(): void;
  toChangelog(): void;
  startGame(): void;
  /** Показать экран Game Over с результатом раунда. */
  showGameOver(info: GameOverInfo): void;
}
