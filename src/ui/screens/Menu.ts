import { ru } from "../../i18n/ru";
import { button, el } from "../dom";
import type { Nav } from "../nav";

export function Menu(nav: Nav): HTMLElement {
  return el("div", { class: "screen screen--menu" }, [
    el("h1", { class: "title" }, [ru.appTitle]),
    el("div", { class: "menu-buttons" }, [
      button(ru.menu.play, () => nav.startGame(), "primary"),
      button(ru.menu.settings, () => nav.toSettings()),
    ]),
    el("p", { class: "hint" }, [ru.menu.hint]),
  ]);
}
