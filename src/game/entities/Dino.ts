/**
 * Игрок — Т-Рекс. Прыжок: одиночный импульс вверх + постоянная гравитация →
 * плавный взлёт и падение. Вариативная высота: если отпустить прыжок раньше,
 * падение ускоряется. Анимация бега — циклическая смена кадров ног.
 *
 * Линия земли (view.groundY) зависит от экрана, поэтому baseY вычисляется
 * динамически — корректно после поворота/ресайза.
 */

import { DINO } from "../../config";
import { view } from "../../core/viewport";
import { drawSprite, spriteCols, spriteRows, type Sprite } from "../sprites";
import { getSkin, type Skin } from "../../theme/skins";
import { inset, type AABB } from "../systems/collision";

type DinoState = "running" | "jumping" | "dead";

export class Dino {
  private skin: Skin;
  private pixel: number;
  private readonly heightPx: number;
  private readonly widthPx: number;
  private vy = 0;
  private y = 0;
  private state: DinoState = "running";
  private runTimer = 0;
  private runFrame = 0;
  private holding = false;

  constructor(skinId: string) {
    this.skin = getSkin(skinId);
    const rows = spriteRows(this.skin.run[0]);
    this.pixel = Math.max(1, Math.round(DINO.height / rows));
    this.heightPx = rows * this.pixel;
    this.widthPx = spriteCols(this.skin.run[0]) * this.pixel;
    this.y = this.baseY;
  }

  /** Y, когда Т-Рекс стоит на земле (зависит от текущей высоты экрана). */
  private get baseY(): number {
    return view.groundY - this.heightPx;
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

  /** Прыжок возможен только с земли. */
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

  /** Отпускание ввода — ускоренное падение для вариативной высоты прыжка. */
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
      this.y = this.baseY; // держим на земле при смене высоты экрана
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

  hitbox(): AABB {
    return inset({ x: DINO.x, y: this.y, w: this.widthPx, h: this.heightPx }, DINO.hitboxInset);
  }

  draw(ctx: CanvasRenderingContext2D, ink: string): void {
    drawSprite(ctx, this.currentSprite(), DINO.x, this.y, this.pixel, ink);
  }
}
