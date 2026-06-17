/**
 * Небо: пиксельное солнце сверху и облака, плывущие вдоль трассы медленнее земли
 * (параллакс → ощущение глубины). Облака и солнце рисуются полупрозрачно, чтобы
 * читаться светло-серыми (в монохромной палитре это всё тот же ink с альфой).
 */

import { view } from "../../core/viewport";

interface Cloud {
  x: number;
  y: number;
  scale: number;
}

const CLOUD: string[] = [
  "...XXXX...",
  ".XXXXXXXX.",
  "XXXXXXXXXX",
  ".XXXXXXXX.",
];

// Пиксельное «солнце» — кольцо.
const SUN: string[] = [
  "..XXXX..",
  ".X....X.",
  "X......X",
  "X......X",
  "X......X",
  "X......X",
  ".X....X.",
  "..XXXX..",
];

export class Sky {
  private clouds: Cloud[] = [];
  /** Доля видимости облаков 0..1 (гаснет в пасмурную погоду). */
  cloudVisibility = 1;

  constructor() {
    this.seed();
  }

  private cloudTop(): number {
    return view.topInset + view.height * 0.05;
  }

  private cloudRange(): number {
    return Math.max(40, view.groundY - this.cloudTop() - 30);
  }

  private seed(): void {
    this.clouds = [];
    const top = this.cloudTop();
    const range = this.cloudRange();
    for (let i = 0; i < 4; i++) {
      this.clouds.push({
        x: Math.random() * view.width,
        y: top + Math.random() * range,
        scale: 2 + Math.floor(Math.random() * 2),
      });
    }
  }

  reset(): void {
    this.seed();
  }

  update(dt: number, speed: number): void {
    const drift = speed * 0.18 * dt;
    const top = this.cloudTop();
    const range = this.cloudRange();
    for (const c of this.clouds) {
      c.x -= drift;
      if (c.x < -CLOUD[0].length * c.scale) {
        c.x = view.width + Math.random() * 60;
        c.y = top + Math.random() * range;
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
        if (m[r][c] === "X") {
          ctx.fillRect(Math.round(x) + c * pixel, Math.round(y) + r * pixel, pixel, pixel);
        }
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D, ink: string): void {
    ctx.fillStyle = ink;
    // Солнце — мягкое, в правом верхнем углу, ниже шапки Telegram.
    ctx.globalAlpha = 0.5;
    Sky.drawMatrix(ctx, SUN, view.width - 76, view.topInset + 46, 4);

    if (this.cloudVisibility > 0.01) {
      ctx.globalAlpha = 0.16 * this.cloudVisibility;
      for (const c of this.clouds) Sky.drawMatrix(ctx, CLOUD, c.x, c.y, c.scale);
    }
    ctx.globalAlpha = 1;
  }
}
