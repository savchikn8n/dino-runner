/**
 * Пиксель-спрайты как битмап-матрицы: 'X' = пиксель (рисуется цветом ink),
 * любой другой символ ('.') = прозрачно (сквозь него виден фон paper).
 *
 * Почему так: матрицы перекрашиваются одним цветом → лёгкие скины и биомы
 * без новых ассетов; всё чётко масштабируется целочисленно.
 *
 * Координатная сетка одна на все кадры динозавра, поэтому при анимации
 * силуэт «стоит на месте», меняются только ноги.
 */

export type Sprite = readonly string[];

const PIXEL_ON = "X";

/** Общая верхняя часть Т-Рекса (голова, тело, хвост). Глаз — пустой пиксель. */
const DINO_UPPER: string[] = [
  "............XXXXXXX...",
  "............XXXXXXXX..",
  "............XXXXXXXX..",
  "............XXXXX.XX..",
  "............XXXXXXXX..",
  "............XXXXXXXX..",
  "............XXXXX.....",
  ".XX.........XXXXXXX...",
  ".XXX.......XXXXXXXX...",
  ".XXXXX....XXXXXXXXX...",
  ".XXXXXXXXXXXXXXXXXX...",
  "..XXXXXXXXXXXXXXXXX...",
  "...XXXXXXXXXXXXXXXX...",
  ".........XXXXXXXXX....",
  ".........XXXXXXXXXX...",
  ".........XXXXXXXXX....",
  ".........XXXXXXXX.....",
  ".........XXXXXXX......",
];

/** То же, но с «закрытым» (закрашенным) глазом — для кадра смерти. */
const DINO_UPPER_DEAD: string[] = DINO_UPPER.map((row, i) =>
  i === 3 ? "............XXXXXXXX.." : row,
);

const LEGS_RUN_A = [
  ".........XX..XX......",
  ".........XX..XX......",
  ".............XX......",
  "............XXX......",
];

const LEGS_RUN_B = [
  ".........XX..XX......",
  ".........XX..XX......",
  ".........XX..........",
  "........XXX..........",
];

const LEGS_STAND = [
  ".........XX..XX......",
  ".........XX..XX......",
  ".........XX..XX......",
  "........XXX..XXX.....",
];

const LEGS_TUCK = [
  ".........XX..XX......",
  ".........XX..XX......",
  "....................",
  "....................",
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
  // широкая группа из трёх
  [
    "...XX......XX...",
    "...XX......XX...",
    ".X.XX..XX..XX...",
    ".X.XX..XX..XX.X.",
    ".XXXX..XX.XXXXX.",
    "...XX.XXXX.XX...",
    "...XX..XX..XX...",
    "...XX..XX..XX...",
    "...XX..XX..XX...",
    "...XX..XX..XX...",
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
 * pixel — размер одного «пикселя» матрицы. Целочисленное выравнивание — для чёткости.
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
