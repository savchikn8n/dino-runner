/**
 * Погода — чисто визуальный хук, на геймплей не влияет. Состояния циклически
 * меняются по таймеру: ясно → дождь → снег → пасмурно. Дождь/снег — частицы,
 * пасмурно гасит облака неба.
 */

import { VIEW, WEATHER } from "../../config";
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
    if (kind === "rain") {
      for (let i = 0; i < 60; i++) this.particles.push(this.makeDrop());
    } else if (kind === "snow") {
      for (let i = 0; i < 50; i++) this.particles.push(this.makeFlake());
    }
  }

  private makeDrop(): Particle {
    return {
      x: Math.random() * (VIEW.width + 60) - 30,
      y: Math.random() * VIEW.height,
      vy: 520 + Math.random() * 120,
      vx: -120,
      len: 6 + Math.random() * 5,
    };
  }

  private makeFlake(): Particle {
    return {
      x: Math.random() * VIEW.width,
      y: Math.random() * VIEW.height,
      vy: 60 + Math.random() * 40,
      vx: -20 + Math.random() * 16,
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

    // Плавно гасим/возвращаем облака: в пасмурную погоду их нет.
    const target = this.kind === "overcast" ? 0 : 1;
    this.sky.cloudVisibility += (target - this.sky.cloudVisibility) * Math.min(1, dt * 1.5);

    const isFlake = this.kind === "snow";
    for (const p of this.particles) {
      p.y += p.vy * dt;
      p.x += p.vx * dt;
      if (p.y > VIEW.groundY) {
        Object.assign(p, isFlake ? this.makeFlake() : this.makeDrop());
        p.y = -4;
      }
      if (p.x < -30) p.x = VIEW.width + 10;
    }
  }

  draw(ctx: CanvasRenderingContext2D, ink: string): void {
    if (this.particles.length === 0) return;
    if (this.kind === "rain") {
      ctx.strokeStyle = ink;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      for (const p of this.particles) {
        ctx.moveTo(Math.round(p.x), Math.round(p.y));
        ctx.lineTo(Math.round(p.x - 3), Math.round(p.y + p.len));
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    } else if (this.kind === "snow") {
      ctx.fillStyle = ink;
      ctx.globalAlpha = 0.7;
      for (const p of this.particles) {
        ctx.fillRect(Math.round(p.x), Math.round(p.y), 2, 2);
      }
      ctx.globalAlpha = 1;
    }
  }
}
