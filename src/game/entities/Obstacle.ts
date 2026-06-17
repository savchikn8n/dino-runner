/**
 * Препятствие — кактус. Габариты берутся из выбранной спрайт-матрицы, поэтому
 * варианты бывают разной ширины/высоты.
 *
 * Спавнер раздаёт кактусы по ВРЕМЕНИ (таймер), а не по пиксельной дистанции.
 * Минимальный зазор = время прыжка + запас, поэтому между любыми двумя кактусами
 * всегда можно приземлиться и прыгнуть снова — на любой скорости.
 */

import { DINO, OBSTACLE } from "../../config";
import { view } from "../../core/viewport";
import { CACTI, drawSprite, spriteCols, spriteRows, type Sprite } from "../sprites";
import type { AABB } from "../systems/collision";

const PIXEL = OBSTACLE.pixel;

export class Obstacle {
  x: number;
  readonly w: number;
  readonly h: number;
  private readonly sprite: Sprite;

  constructor(spawnX: number) {
    this.sprite = CACTI[Math.floor(Math.random() * CACTI.length)];
    this.w = spriteCols(this.sprite) * PIXEL;
    this.h = spriteRows(this.sprite) * PIXEL;
    this.x = spawnX;
  }

  update(dt: number, speed: number): void {
    this.x -= speed * dt;
  }

  get isOffscreen(): boolean {
    return this.x + this.w < 0;
  }

  hitbox(): AABB {
    // Чуть сжимаем по бокам — листья кактуса не должны «убивать» несправедливо.
    return { x: this.x + 2, y: view.groundY - this.h, w: this.w - 4, h: this.h };
  }

  draw(ctx: CanvasRenderingContext2D, ink: string): void {
    drawSprite(ctx, this.sprite, this.x, view.groundY - this.h, PIXEL, ink);
  }
}

export class ObstacleField {
  private obstacles: Obstacle[] = [];
  private spawnTimer = 0;

  /** Минимальный безопасный зазор по времени = время прыжка + запас. */
  private get minGapTime(): number {
    const airTime = (2 * Math.abs(DINO.jumpVelocity)) / DINO.gravity;
    return airTime + OBSTACLE.minGapBuffer;
  }

  reset(): void {
    this.obstacles = [];
    this.spawnTimer = OBSTACLE.startDelay;
  }

  get items(): readonly Obstacle[] {
    return this.obstacles;
  }

  update(dt: number, speed: number): void {
    for (const o of this.obstacles) o.update(dt, speed);
    this.obstacles = this.obstacles.filter((o) => !o.isOffscreen);

    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0) {
      this.obstacles.push(new Obstacle(view.width + 10));
      this.spawnTimer = this.minGapTime + Math.random() * OBSTACLE.maxGapExtra;
    }
  }

  draw(ctx: CanvasRenderingContext2D, ink: string): void {
    for (const o of this.obstacles) o.draw(ctx, ink);
  }
}
