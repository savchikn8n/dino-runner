/**
 * Рендерер: держит фиксированную логическую ширину мира (view.width) и вписывает
 * её по ширине экрана. Высота мира (view.height) вычисляется из соотношения
 * сторон, поэтому мир заполняет экран без полей. Линия земли прижата к низу.
 *
 * Целочисленный масштаб не используем (экраны разные), но image smoothing
 * выключен — пиксели остаются чёткими.
 */

import { GROUND_BOTTOM_RATIO, view } from "./viewport";

export class Renderer {
  readonly ctx: CanvasRenderingContext2D;
  private dpr = 1;

  constructor(private readonly canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) throw new Error("2D context unavailable");
    this.ctx = ctx;
    this.resize();
    window.addEventListener("resize", () => this.resize());
  }

  resize(): void {
    this.dpr = Math.min(window.devicePixelRatio || 1, 3);
    const rect = this.canvas.getBoundingClientRect();
    const cssW = rect.width || window.innerWidth;
    const cssH = rect.height || window.innerHeight;

    this.canvas.width = Math.round(cssW * this.dpr);
    this.canvas.height = Math.round(cssH * this.dpr);

    // Вписываем по ширине; высота мира — сколько влезает.
    const scale = cssW / view.width;
    view.height = cssH / scale;
    view.groundY = view.height * (1 - GROUND_BOTTOM_RATIO);

    this.ctx.setTransform(scale * this.dpr, 0, 0, scale * this.dpr, 0, 0);
    this.ctx.imageSmoothingEnabled = false;
  }

  /** Заливает весь кадр цветом фона. */
  clear(paper: string): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = paper;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.restore();
  }
}
