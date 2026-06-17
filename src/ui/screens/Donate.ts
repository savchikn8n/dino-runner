import { ru } from "../../i18n/ru";
import { LINKS } from "../../config";
import { openLink } from "../../telegram/telegram";
import { button, el } from "../dom";
import type { Nav } from "../nav";

/**
 * Экран-заглушка доната (v1). Реальные Telegram Stars появятся отдельным этапом
 * (нужен бот-бэкенд для инвойсов) — пока ведём на подписку.
 */
export function Donate(nav: Nav): HTMLElement {
  return el("div", { class: "screen screen--donate" }, [
    el("button", { class: "back-link", onClick: () => nav.toSettings() }, ["‹ " + ru.donate.back]),
    el("h2", { class: "subtitle" }, [ru.donate.title]),
    el("div", { class: "donate-heart" }, ["♥"]),
    el("p", { class: "body-text" }, [ru.donate.body]),
    el("p", { class: "soon" }, [ru.donate.soon]),
    el("div", { class: "menu-buttons" }, [
      button(ru.donate.subscribe, () => openLink(LINKS.channel), "primary"),
    ]),
  ]);
}
