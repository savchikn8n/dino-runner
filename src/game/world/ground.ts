/**
 * Бегущая земля — тёмный «мокрый асфальт». Сплошная линия трассы плюс редкие
 * камешки/неровности, которые скроллятся со скоростью мира (создаёт ощущение бега).
 */

import { VIEW } from "../../config";

interface Speck {
  x: number;
  y: number;
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
    for (let x = 0; x < VIEW.width * 2; x += 18 + Math.random() * 40) {
      this.specks.push({
        x,
        y: VIEW.groundY + 4 + Math.random() * 10,
        w: 2 + Math.floor(Math.random() * 4),
      });
    }
  }

  reset(): void {
    this.offset = 0;
    this.seed();
  }

  update(dt: number, speed: number): void {
    this.offset = (this.offset + speed * dt) % (VIEW.width * 2);
  }

  draw(ctx: CanvasRenderingContext2D, ink: string): void {
    ctx.fillStyle = ink;
    // Линия трассы.
    ctx.fillRect(0, VIEW.groundY, VIEW.width, 2);
    // Камешки, прокручиваемые с цикличной обмоткой.
    const span = VIEW.width * 2;
    for (const s of this.specks) {
      let x = s.x - this.offset;
      if (x < -10) x += span;
      if (x > VIEW.width) continue;
      ctx.fillRect(Math.round(x), s.y, s.w, 2);
    }
  }
}
