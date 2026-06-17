import "./styles/ui.css";

import { Renderer } from "./core/renderer";
import { Loop } from "./core/loop";
import { Game } from "./game/Game";
import { getTheme, DEFAULT_THEME } from "./theme/palette";
import { initTelegram, onLayoutChange } from "./telegram/telegram";
import { ScreenManager } from "./ui/ScreenManager";
import type { Nav } from "./ui/nav";
import { Menu } from "./ui/screens/Menu";
import { Settings } from "./ui/screens/Settings";
import { Donate } from "./ui/screens/Donate";
import { Changelog } from "./ui/screens/Changelog";
import { GameOver } from "./ui/screens/GameOver";

const canvas = document.getElementById("game") as HTMLCanvasElement;
const uiRoot = document.getElementById("ui") as HTMLElement;

const { ink, paper } = getTheme(DEFAULT_THEME);
document.body.style.background = paper;
initTelegram(paper, ink);

const renderer = new Renderer(canvas);
// Пересчитываем масштаб и безопасные отступы при разворачивании/смене раскладки.
onLayoutChange(() => renderer.resize());

const game = new Game(renderer);
const screens = new ScreenManager(uiRoot);

const nav: Nav = {
  toMenu() {
    game.attract();
    screens.show(Menu(nav));
  },
  toSettings() {
    screens.show(Settings(nav));
  },
  toDonate() {
    screens.show(Donate(nav));
  },
  toChangelog() {
    screens.show(Changelog(nav));
  },
  startGame() {
    game.start();
    screens.show(null);
  },
  showGameOver(info) {
    screens.show(GameOver(nav, info));
  },
};

game.onGameOver = (info) => nav.showGameOver(info);

// Ввод: тап по холсту (когда оверлей скрыт) и клавиатура.
canvas.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  game.press();
});
window.addEventListener("pointerup", () => game.release());

window.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    e.preventDefault();
    game.press();
  }
});
window.addEventListener("keyup", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") game.release();
});

// Старт: меню поверх «бегущего» фона.
nav.toMenu();
new Loop((dt) => {
  game.update(dt);
  game.draw();
}).start();
