/**
 * Рендерер: держит canvas в фиксированном логическом разрешении (VIEW),
 * масштабирует под экран с сохранением пропорций и чёткостью пикселей.
 *
 * Мир всегда рисуется в координатах VIEW.width x VIEW.height. Масштаб и
 * центрирование (буквы по бокам) учитываются через transform на backing-store
 * с учётом devicePixelRatio.
 */

import { VIEW } from "../config";

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

  /** Подгоняет backing-store под размер контейнера и выставляет transform. */
  resize(): void {
    this.dpr = Math.min(window.devicePixelRatio || 1, 3);
    const rect = this.canvas.getBoundingClientRect();
    const cssW = rect.width || window.innerWidth;
    const cssH = rect.height || window.innerHeight;

    this.canvas.width = Math.round(cssW * this.dpr);
    this.canvas.height = Math.round(cssH * this.dpr);

    // Масштаб «вписать» (contain) с центрированием.
    const scale = Math.min(cssW / VIEW.width, cssH / VIEW.height);
    const offsetX = (cssW - VIEW.width * scale) / 2;
    const offsetY = (cssH - VIEW.height * scale) / 2;

    const ctx = this.ctx;
    ctx.setTransform(
      scale * this.dpr,
      0,
      0,
      scale * this.dpr,
      offsetX * this.dpr,
      offsetY * this.dpr,
    );
    ctx.imageSmoothingEnabled = false;
  }

  /** Заливает весь видимый кадр (включая поля) цветом фона и чистит мир. */
  clear(paper: string): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = paper;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.restore();
  }
}
