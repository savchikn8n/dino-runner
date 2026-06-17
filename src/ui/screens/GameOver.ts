import { ru } from "../../i18n/ru";
import type { GameOverInfo } from "../../game/Game";
import { button, el } from "../dom";
import type { Nav } from "../nav";

const pad = (n: number) => n.toString().padStart(5, "0");

export function GameOver(nav: Nav, info: GameOverInfo): HTMLElement {
  return el("div", { class: "screen screen--over" }, [
    el("h2", { class: "gameover-title" }, [ru.gameOver.title]),
    info.isNewBest ? el("p", { class: "newbest" }, [ru.gameOver.newBest]) : el("span"),
    el("div", { class: "score-row" }, [
      el("div", { class: "score-cell" }, [
        el("span", { class: "score-label" }, [ru.gameOver.score]),
        el("span", { class: "score-value" }, [pad(info.score)]),
      ]),
      el("div", { class: "score-cell" }, [
        el("span", { class: "score-label" }, [ru.gameOver.best]),
        el("span", { class: "score-value" }, [pad(info.best)]),
      ]),
    ]),
    el("div", { class: "menu-buttons" }, [
      button(ru.gameOver.retry, () => nav.startGame(), "primary"),
      button(ru.gameOver.menu, () => nav.toMenu()),
    ]),
  ]);
}
