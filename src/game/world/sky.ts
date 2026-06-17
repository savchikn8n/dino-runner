/**
 * Небо: пиксельное солнце сверху и облака, плывущие вдоль трассы медленнее земли
 * (параллакс → ощущение глубины). Видимость облаков задаётся погодой (weather).
 */

import { VIEW } from "../../config";

interface Cloud {
  x: number;
  y: number;
  scale: number;
}

// Пиксельная матрица облака (силуэт).
const CLOUD: string[] = [
  "...XXXX...",
  ".XXXXXXXX.",
  "XXXXXXXXXX",
  ".XXXXXXXX.",
];

// Пиксельное «солнце» (кольцо).
const SUN: string[] = [
  "..XXXX..",
  ".XXXXXX.",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  ".XXXXXX.",
  "..XXXX..",
];

export class Sky {
  private clouds: Cloud[] = [];
  /** Доля видимости облаков 0..1 (плавно гасится в пасмурную/ясную погоду). */
  cloudVisibility = 1;

  constructor() {
    this.seed();
  }

  private seed(): void {
    this.clouds = [];
    for (let i = 0; i < 4; i++) {
      this.clouds.push({
        x: Math.random() * VIEW.width,
        y: 30 + Math.random() * 80,
        scale: 2 + Math.floor(Math.random() * 2),
      });
    }
  }

  reset(): void {
    this.seed();
  }

  update(dt: number, speed: number): void {
    // Облака медленнее земли (параллакс ~0.18 от скорости мира).
    const drift = speed * 0.18 * dt;
    for (const c of this.clouds) {
      c.x -= drift;
      if (c.x < -CLOUD[0].length * c.scale) {
        c.x = VIEW.width + Math.random() * 60;
        c.y = 30 + Math.random() * 80;
      }
    }
  }

  private static drawMatrix(
    ctx: CanvasRenderingContext2D,
    m: string[],
    x: number,
    y: number,
    pixel: number,
  ): void {
    for (let r = 0; r < m.length; r++) {
      for (let c = 0; c < m[r].length; c++) {
        if (m[r][c] === "X") ctx.fillRect(Math.round(x) + c * pixel, Math.round(y) + r * pixel, pixel, pixel);
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D, ink: string): void {
    // Солнце — фиксировано в верхней зоне.
    ctx.fillStyle = ink;
    Sky.drawMatrix(ctx, SUN, VIEW.width - 120, 28, 4);

    if (this.cloudVisibility <= 0.01) return;
    ctx.globalAlpha = this.cloudVisibility;
    for (const c of this.clouds) {
      Sky.drawMatrix(ctx, CLOUD, c.x, c.y, c.scale);
    }
    ctx.globalAlpha = 1;
  }
}
