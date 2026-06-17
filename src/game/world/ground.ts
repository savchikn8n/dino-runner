/**
 * Бегущая земля — тёмный «мокрый асфальт». Сплошная линия трассы плюс редкие
 * камешки/неровности, которые скроллятся со скоростью мира (ощущение бега).
 */

import { view } from "../../core/viewport";

interface Speck {
  x: number;
  dy: number;
  w: number;
}

export class Ground {
  private offset = 0;
  private specks: Speck[] = [];

  constructor() {
    this.seed();
  }

  private seed(): void {
    this.specks = [];
    for (let x = 0; x < view.width * 2; x += 16 + Math.random() * 34) {
      this.specks.push({
        x,
        dy: 5 + Math.random() * 9,
        w: 2 + Math.floor(Math.random() * 4),
      });
    }
  }

  reset(): void {
    this.offset = 0;
    this.seed();
  }

  update(dt: number, speed: number): void {
    this.offset = (this.offset + speed * dt) % (view.width * 2);
  }

  draw(ctx: CanvasRenderingContext2D, ink: string): void {
    ctx.fillStyle = ink;
    ctx.fillRect(0, view.groundY, view.width, 2);
    const span = view.width * 2;
    for (const s of this.specks) {
      let x = s.x - this.offset;
      if (x < -10) x += span;
      if (x > view.width) continue;
      ctx.fillRect(Math.round(x), view.groundY + s.dy, s.w, 2);
    }
  }
}
