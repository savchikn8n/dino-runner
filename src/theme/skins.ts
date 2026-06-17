/**
 * Реестр скинов игрока. В v1 — один скин (классический Т-Рекс), но структура
 * готова к росту: добавить скин = новая запись со своим набором кадров.
 *
 * Кадры берутся из game/sprites.ts. В будущем скин может ссылаться на свои
 * матрицы и даже на свой пиксель-размер.
 */

import { DINO, type Sprite } from "../game/sprites";

export interface Skin {
  id: string;
  name: string;
  run: readonly [Sprite, Sprite];
  jump: Sprite;
  dead: Sprite;
}

export const SKINS: Record<string, Skin> = {
  trex: {
    id: "trex",
    name: "Т-Рекс",
    run: DINO.run,
    jump: DINO.jump,
    dead: DINO.dead,
  },
};

export const DEFAULT_SKIN = "trex";

export function getSkin(id: string): Skin {
  return SKINS[id] ?? SKINS[DEFAULT_SKIN];
}
