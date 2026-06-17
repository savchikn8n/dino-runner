/**
 * Счёт по пройденной дистанции + рекорд. На каждом рубеже (SCORE.milestone)
 * даёт сигнал (звук/вспышка) — как в оригинале.
 */

import { SCORE } from "../../config";
import { getHighScore, setHighScore } from "../../core/storage";

export class Score {
  private value = 0;
  private best = getHighScore();
  private lastMilestone = 0;

  reset(): void {
    this.value = 0;
    this.lastMilestone = 0;
    this.best = getHighScore();
  }

  /** Добавляет очки за пройденную дистанцию. Возвращает true на новом рубеже. */
  advance(distancePx: number): boolean {
    this.value += distancePx * SCORE.perPixel;
    const milestone = Math.floor(this.value / SCORE.milestone);
    if (milestone > this.lastMilestone) {
      this.lastMilestone = milestone;
      return true;
    }
    return false;
  }

  /** Фиксирует рекорд при гибели. Возвращает true, если рекорд побит. */
  commit(): boolean {
    if (this.current > this.best) {
      this.best = this.current;
      setHighScore(this.best);
      return true;
    }
    return false;
  }

  get current(): number {
    return Math.floor(this.value);
  }

  get highScore(): number {
    return this.best;
  }
}
