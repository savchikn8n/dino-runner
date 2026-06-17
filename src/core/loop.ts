/**
 * Игровой цикл на requestAnimationFrame. Отдаёт delta в секундах с потолком,
 * чтобы после сворачивания вкладки физику не «телепортировало».
 */

export type FrameCallback = (dt: number) => void;

export class Loop {
  private rafId = 0;
  private last = 0;
  private running = false;

  constructor(private readonly onFrame: FrameCallback) {}

  start(): void {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    const tick = (now: number) => {
      if (!this.running) return;
      const dt = Math.min((now - this.last) / 1000, 1 / 30);
      this.last = now;
      this.onFrame(dt);
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.rafId);
  }
}
