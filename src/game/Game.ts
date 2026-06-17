/**
 * Оркестратор раунда: режимы attract/running/over, разгон скорости, спавн
 * препятствий, счёт, столкновения и отрисовка всех слоёв мира.
 *
 * - attract: мир и динозавр анимируются за меню, без препятствий и счёта.
 * - running: полноценная игра.
 * - over: стоп-кадр после столкновения.
 */

import { SPEED } from "../config";
import { view } from "../core/viewport";
import type { Renderer } from "../core/renderer";
import { sound } from "../core/audio";
import { haptic, hapticError } from "../telegram/telegram";
import { getTheme, type ThemeId, DEFAULT_THEME } from "../theme/palette";
import { DEFAULT_SKIN } from "../theme/skins";
import { Dino } from "./entities/Dino";
import { ObstacleField } from "./entities/Obstacle";
import { intersects } from "./systems/collision";
import { Score } from "./systems/score";
import { Ground } from "./world/ground";
import { Sky } from "./world/sky";
import { Weather } from "./world/weather";

type Mode = "attract" | "running" | "over";

export interface GameOverInfo {
  score: number;
  best: number;
  isNewBest: boolean;
}

export class Game {
  private mode: Mode = "attract";
  private speed: number = SPEED.start;
  private elapsed = 0;

  private readonly dino: Dino;
  private readonly field = new ObstacleField();
  private readonly score = new Score();
  private readonly ground = new Ground();
  private readonly sky = new Sky();
  private readonly weather = new Weather(this.sky);

  private theme: ThemeId = DEFAULT_THEME;

  /** Вызывается при гибели игрока — UI показывает экран Game Over. */
  onGameOver: ((info: GameOverInfo) => void) | null = null;

  constructor(private readonly renderer: Renderer) {
    this.dino = new Dino(DEFAULT_SKIN);
  }

  /** Фоновый «бег на месте» за меню. */
  attract(): void {
    this.mode = "attract";
    this.dino.reset();
    this.field.reset();
    this.weather.reset();
  }

  /** Старт нового раунда. */
  start(): void {
    this.mode = "running";
    this.speed = SPEED.start;
    this.elapsed = 0;
    this.score.reset();
    this.dino.reset();
    this.field.reset();
    this.ground.reset();
    this.weather.reset();
  }

  get isRunning(): boolean {
    return this.mode === "running";
  }

  /** Ввод (тап/пробел): прыжок во время игры. */
  press(): void {
    if (this.mode === "running" && this.dino.jump()) {
      sound.jump();
      haptic("light");
    }
  }

  release(): void {
    this.dino.release();
  }

  update(dt: number): void {
    // Слои окружения двигаются всегда (и в attract, и в игре).
    this.sky.update(dt, this.speed);
    this.ground.update(dt, this.mode === "over" ? 0 : this.speed);
    this.weather.update(dt);
    this.dino.update(dt);

    if (this.mode !== "running") return;

    this.elapsed += dt;
    this.speed = Math.min(SPEED.max, SPEED.start + SPEED.accel * this.elapsed);

    this.field.update(dt, this.speed);

    if (this.score.advance(this.speed * dt)) {
      sound.point();
    }

    // Столкновения.
    const hb = this.dino.hitbox();
    for (const o of this.field.items) {
      if (intersects(hb, o.hitbox())) {
        this.gameOver();
        break;
      }
    }
  }

  private gameOver(): void {
    this.mode = "over";
    this.dino.die();
    const isNewBest = this.score.commit();
    sound.die();
    hapticError();
    this.onGameOver?.({
      score: this.score.current,
      best: this.score.highScore,
      isNewBest,
    });
  }

  draw(): void {
    const { ink, paper } = getTheme(this.theme);
    const ctx = this.renderer.ctx;
    this.renderer.clear(paper);

    this.sky.draw(ctx, ink);
    this.ground.draw(ctx, ink);
    this.field.draw(ctx, ink);
    this.dino.draw(ctx, ink);
    this.weather.draw(ctx, ink); // осадки — поверх сцены

    if (this.mode !== "attract") {
      this.drawHud(ctx, ink);
    }
  }

  private drawHud(ctx: CanvasRenderingContext2D, ink: string): void {
    ctx.fillStyle = ink;
    ctx.font = "16px monospace";
    ctx.textBaseline = "top";
    ctx.textAlign = "right";
    const pad = (n: number) => n.toString().padStart(5, "0");
    const best = this.score.highScore;
    const cur = this.score.current;
    const text = best > 0 ? `HI ${pad(best)}  ${pad(cur)}` : pad(cur);
    ctx.fillText(text, view.width - 14, 12);
    ctx.textAlign = "left";
  }
}
