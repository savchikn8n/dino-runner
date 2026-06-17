/**
 * Погода — чисто визуальный хук, на геймплей не влияет. Состояния циклически
 * меняются по таймеру: ясно → дождь → пасмурно → снег. Дождь/снег — частицы,
 * пасмурно гасит облака неба.
 */

import { WEATHER } from "../../config";
import { view } from "../../core/viewport";
import type { Sky } from "./sky";

type WeatherKind = "clear" | "rain" | "snow" | "overcast";

const SEQUENCE: WeatherKind[] = ["clear", "rain", "overcast", "snow"];

interface Particle {
  x: number;
  y: number;
  vy: number;
  vx: number;
  len: number;
}

export class Weather {
  private kind: WeatherKind = "clear";
  private index = 0;
  private timer = 0;
  private duration = 0;
  private particles: Particle[] = [];

  constructor(private readonly sky: Sky) {
    this.apply("clear");
    this.scheduleNext();
  }

  reset(): void {
    this.index = 0;
    this.particles = [];
    this.apply("clear");
    this.scheduleNext();
  }

  private scheduleNext(): void {
    this.timer = 0;
    this.duration =
      WEATHER.minDuration + Math.random() * (WEATHER.maxDuration - WEATHER.minDuration);
  }

  private apply(kind: WeatherKind): void {
    this.kind = kind;
    this.particles = [];
    const count = Math.round(view.width / 9);
    if (kind === "rain") {
      for (let i = 0; i < count; i++) this.particles.push(this.makeDrop());
    } else if (kind === "snow") {
      for (let i = 0; i < count; i++) this.particles.push(this.makeFlake());
    }
  }

  private makeDrop(): Particle {
    return {
      x: Math.random() * (view.width + 60) - 30,
      y: Math.random() * view.height,
      vy: 540 + Math.random() * 140,
      vx: -130,
      len: 7 + Math.random() * 5,
    };
  }

  private makeFlake(): Particle {
    return {
      x: Math.random() * view.width,
      y: Math.random() * view.height,
      vy: 70 + Math.random() * 50,
      vx: -22 + Math.random() * 18,
      len: 2,
    };
  }

  update(dt: number): void {
    this.timer += dt;
    if (this.timer >= this.duration) {
      this.index = (this.index + 1) % SEQUENCE.length;
      this.apply(SEQUENCE[this.index]);
      this.scheduleNext();
    }

    const target = this.kind === "overcast" ? 0 : 1;
    this.sky.cloudVisibility += (target - this.sky.cloudVisibility) * Math.min(1, dt * 1.5);

    const isFlake = this.kind === "snow";
    for (const p of this.particles) {
      p.y += p.vy * dt;
      p.x += p.vx * dt;
      if (p.y > view.groundY) {
        Object.assign(p, isFlake ? this.makeFlake() : this.makeDrop());
        p.y = -4;
      }
      if (p.x < -30) p.x = view.width + 10;
    }
  }

  draw(ctx: CanvasRenderingContext2D, ink: string): void {
    if (this.particles.length === 0) return;
    if (this.kind === "rain") {
      ctx.strokeStyle = ink;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      for (const p of this.particles) {
        ctx.moveTo(Math.round(p.x), Math.round(p.y));
        ctx.lineTo(Math.round(p.x - 3), Math.round(p.y + p.len));
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    } else if (this.kind === "snow") {
      ctx.fillStyle = ink;
      ctx.globalAlpha = 0.6;
      for (const p of this.particles) ctx.fillRect(Math.round(p.x), Math.round(p.y), 2, 2);
      ctx.globalAlpha = 1;
    }
  }
}
