/**
 * Препятствие — кактус. Габариты берутся из выбранной спрайт-матрицы, поэтому
 * варианты бывают разной ширины/высоты. Спавнер держит зазор между кактусами и
 * сжимает его с ростом скорости.
 */

import { OBSTACLE, SPEED, VIEW } from "../../config";
import { CACTI, drawSprite, spriteCols, spriteRows, type Sprite } from "../sprites";
import type { AABB } from "../systems/collision";

const PIXEL = 3; // размер пикселя матрицы кактуса

export class Obstacle {
  x: number;
  readonly w: number;
  readonly h: number;
  private readonly sprite: Sprite;
  private readonly y: number;

  constructor(spawnX: number) {
    this.sprite = CACTI[Math.floor(Math.random() * CACTI.length)];
    this.w = spriteCols(this.sprite) * PIXEL;
    this.h = spriteRows(this.sprite) * PIXEL;
    this.x = spawnX;
    this.y = VIEW.groundY - this.h;
  }

  update(dt: number, speed: number): void {
    this.x -= speed * dt;
  }

  get isOffscreen(): boolean {
    return this.x + this.w < 0;
  }

  hitbox(): AABB {
    // Чуть сжимаем по бокам — листья кактуса не должны «убивать» несправедливо.
    return { x: this.x + 2, y: this.y, w: this.w - 4, h: this.h };
  }

  draw(ctx: CanvasRenderingContext2D, ink: string): void {
    drawSprite(ctx, this.sprite, this.x, this.y, PIXEL, ink);
  }
}

/** Спавнер: решает, когда выпустить следующий кактус. */
export class ObstacleField {
  private obstacles: Obstacle[] = [];
  private nextGap = 0;

  reset(): void {
    this.obstacles = [];
    this.nextGap = OBSTACLE.minGap;
  }

  get items(): readonly Obstacle[] {
    return this.obstacles;
  }

  update(dt: number, speed: number): void {
    for (const o of this.obstacles) o.update(dt, speed);
    this.obstacles = this.obstacles.filter((o) => !o.isOffscreen);

    const last = this.obstacles[this.obstacles.length - 1];
    const rightmost = last ? last.x : -Infinity;

    // Зазор сжимается по мере приближения скорости к максимуму.
    const speedT = (speed - SPEED.start) / (SPEED.max - SPEED.start);
    const shrink = 1 - Math.max(0, Math.min(1, speedT)) * (1 - OBSTACLE.gapSpeedFactor);
    const minGap = OBSTACLE.minGap * shrink;
    const maxGap = OBSTACLE.maxGap * shrink;

    if (rightmost <= VIEW.width - this.nextGap) {
      this.obstacles.push(new Obstacle(VIEW.width + 10));
      this.nextGap = minGap + Math.random() * (maxGap - minGap);
    }
  }

  draw(ctx: CanvasRenderingContext2D, ink: string): void {
    for (const o of this.obstacles) o.draw(ctx, ink);
  }
}
