/**
 * Пиксель-спрайты как битмап-матрицы: 'X' = пиксель (рисуется цветом ink),
 * '.' = прозрачно (виден фон paper). Строки могут быть разной длины —
 * недостающие пиксели справа считаются прозрачными.
 *
 * Т-Рекс максимально приближен к оригинальному динозаврику из Chrome:
 * крупная прямоугольная голова с белым глазом и «ртом», толстая спина и хвост,
 * маленькая лапка, две массивные ноги. Анимация бега меняет только ноги.
 */

export type Sprite = readonly string[];

const PIXEL_ON = "X";

/**
 * Общая верхняя часть (голова + тело + хвост + лапка). Глаз — пустой пиксель
 * в передней части головы, рот — вырез снизу-спереди головы.
 */
const DINO_UPPER: string[] = [
  ".............XXXXXXXX.",
  ".............XXXXXXXX.",
  ".............XXXXXXXX.",
  ".............XXXXXXXX.",
  ".............XXXX.XXX.", // глаз
  ".............XXXXXXXX.",
  ".............XXXXXXXX.",
  ".............XXXXX....", // нижняя челюсть / рот
  ".X...........XXXXXXX..",
  ".XX.........XXXXXXXX..",
  ".XXX.......XXXXXXXXX..",
  ".XXXX.....XXXXXXXXXX..",
  ".XXXXXXXXXXXXXXXXXXX..", // спина
  "..XXXXXXXXXXXXXXXXXX..",
  "...XXXXXXXXXXXXXXXXX..",
  ".......XXXXXXXXXXXX...", // тело
  ".......XXXXXXXXXX.X...", // лапка
  ".......XXXXXXXXX..X...",
  ".......XXXXXXXXX......",
];

/** Кадр смерти: глаз закрыт (закрашен). */
const DINO_UPPER_DEAD: string[] = DINO_UPPER.map((row, i) =>
  i === 4 ? ".............XXXXXXXX." : row,
);

// Ноги выровнены по низу тела (столбцы 7..15).
const LEGS_RUN_A = [
  ".......XXX..XXX...",
  ".......XXX..XXX...",
  "............XX....",
  "............XX....",
  "...........XXX...",
];

const LEGS_RUN_B = [
  ".......XXX..XXX...",
  ".......XXX..XXX...",
  ".......XX........",
  ".......XX........",
  ".......XXX.......",
];

const LEGS_STAND = [
  ".......XXX..XXX...",
  ".......XXX..XXX...",
  ".......XXX..XXX...",
  ".......XX...XX....",
  "......XXX..XXX....",
];

const LEGS_TUCK = [
  ".......XXX..XXX...",
  ".......XXX..XXX...",
  "......XX....XX....",
  ".................",
  ".................",
];

function compose(upper: string[], legs: string[]): Sprite {
  return [...upper, ...legs];
}

export const DINO = {
  run: [compose(DINO_UPPER, LEGS_RUN_A), compose(DINO_UPPER, LEGS_RUN_B)] as const,
  jump: compose(DINO_UPPER, LEGS_TUCK),
  dead: compose(DINO_UPPER_DEAD, LEGS_STAND),
} as const;

/** Кактусы разной ширины/высоты. Габариты препятствия берутся из матрицы. */
export const CACTI: Sprite[] = [
  // маленький одиночный
  [
    "...XX...",
    "...XX...",
    "...XX...",
    ".X.XX...",
    ".X.XX.X.",
    ".XXXX.X.",
    "...XXXX.",
    "...XX...",
    "...XX...",
    "...XX...",
    "...XX...",
    "...XX...",
  ],
  // высокий
  [
    "....XX....",
    "....XX....",
    "....XX....",
    "..X.XX....",
    "..X.XX.X..",
    "..X.XX.X..",
    "..XXXX.X..",
    "X..XXXXX..",
    "X..XX.....",
    "XXXXX.....",
    "...XX.....",
    "...XX.....",
    "...XX.....",
    "...XX.....",
    "...XX.....",
  ],
  // группа из двух
  [
    "...XX......",
    "...XX..XX..",
    ".X.XX..XX..",
    ".X.XX..XX.X",
    ".XXXX.XXX.X",
    "...XX..XXXX",
    "...XX..XX..",
    "...XX..XX..",
    "...XX..XX..",
    "...XX..XX..",
  ],
];

/** Ширина спрайта в пикселях матрицы (по самой длинной строке). */
export function spriteCols(sprite: Sprite): number {
  return sprite.reduce((m, row) => Math.max(m, row.length), 0);
}

export function spriteRows(sprite: Sprite): number {
  return sprite.length;
}

/**
 * Рисует спрайт цветом color. (px, py) — левый-верхний угол в координатах мира,
 * pixel — размер одного «пикселя» матрицы.
 */
export function drawSprite(
  ctx: CanvasRenderingContext2D,
  sprite: Sprite,
  px: number,
  py: number,
  pixel: number,
  color: string,
): void {
  ctx.fillStyle = color;
  const ox = Math.round(px);
  const oy = Math.round(py);
  for (let r = 0; r < sprite.length; r++) {
    const row = sprite[r];
    for (let c = 0; c < row.length; c++) {
      if (row[c] === PIXEL_ON) {
        ctx.fillRect(ox + c * pixel, oy + r * pixel, pixel, pixel);
      }
    }
  }
}
