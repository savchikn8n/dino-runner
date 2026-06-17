/**
 * Игрок — Т-Рекс. Прыжок: одиночный импульс вверх + постоянная гравитация →
 * плавный взлёт и падение. Вариативная высота: если отпустить прыжок раньше,
 * падение ускоряется. Анимация бега — циклическая смена кадров ног.
 */

import { DINO, VIEW } from "../../config";
import { drawSprite, spriteCols, spriteRows, type Sprite } from "../sprites";
import { getSkin, type Skin } from "../../theme/skins";
import type { AABB } from "../systems/collision";
import { inset } from "../systems/collision";

type DinoState = "running" | "jumping" | "dead";

export class Dino {
  private skin: Skin;
  private pixel: number;
  private vy = 0;
  private y: number; // верхняя кромка спрайта
  private readonly baseY: number; // y, когда стоит на земле
  private state: DinoState = "running";
  private runTimer = 0;
  private runFrame = 0;
  private holding = false;

  constructor(skinId: string) {
    this.skin = getSkin(skinId);
    // Подгоняем «пиксель» матрицы так, чтобы спрайт занял заданную высоту.
    this.pixel = Math.max(1, Math.round(DINO.height / spriteRows(this.skin.run[0])));
    this.baseY = VIEW.groundY - spriteRows(this.skin.run[0]) * this.pixel;
    this.y = this.baseY;
  }

  reset(): void {
    this.vy = 0;
    this.y = this.baseY;
    this.state = "running";
    this.runTimer = 0;
    this.runFrame = 0;
    this.holding = false;
  }

  get isDead(): boolean {
    return this.state === "dead";
  }

  /** Прыжок возможен только с земли. Возвращает true, если прыжок начался. */
  jump(): boolean {
    if (this.state === "dead") return false;
    if (this.y >= this.baseY - 0.5) {
      this.vy = DINO.jumpVelocity;
      this.state = "jumping";
      this.holding = true;
      return true;
    }
    return false;
  }

  /** Отпускание ввода — включает ускоренное падение для вариативной высоты. */
  release(): void {
    this.holding = false;
  }

  die(): void {
    this.state = "dead";
  }

  update(dt: number): void {
    if (this.state === "dead") return;

    if (this.state === "jumping") {
      const g = this.holding || this.vy < 0 ? DINO.gravity : DINO.fastFallGravity;
      this.vy += g * dt;
      this.y += this.vy * dt;
      if (this.y >= this.baseY) {
        this.y = this.baseY;
        this.vy = 0;
        this.state = "running";
      }
    } else {
      // бег: проматываем кадры ног
      this.runTimer += dt;
      const frameDur = 1 / DINO.runFps;
      while (this.runTimer >= frameDur) {
        this.runTimer -= frameDur;
        this.runFrame ^= 1;
      }
    }
  }

  private currentSprite(): Sprite {
    if (this.state === "dead") return this.skin.dead;
    if (this.state === "jumping") return this.skin.jump;
    return this.skin.run[this.runFrame];
  }

  /** Хитбокс с «прощением» (чуть меньше спрайта). */
  hitbox(): AABB {
    const box: AABB = {
      x: DINO.x,
      y: this.y,
      w: spriteCols(this.skin.run[0]) * this.pixel,
      h: spriteRows(this.skin.run[0]) * this.pixel,
    };
    return inset(box, DINO.hitboxInset);
  }

  draw(ctx: CanvasRenderingContext2D, ink: string): void {
    drawSprite(ctx, this.currentSprite(), DINO.x, this.y, this.pixel, ink);
  }
}
