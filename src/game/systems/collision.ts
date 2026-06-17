/** Прямоугольник столкновений в координатах мира. */
export interface AABB {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Пересечение двух AABB. */
export function intersects(a: AABB, b: AABB): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

/** Сжать прямоугольник со всех сторон (для «прощающего» хитбокса). */
export function inset(box: AABB, by: number): AABB {
  return { x: box.x + by, y: box.y + by, w: box.w - by * 2, h: box.h - by * 2 };
}
