import { ru } from "../../i18n/ru";
import { LINKS } from "../../config";
import { CURRENT_VERSION } from "../../data/changelog";
import { sound } from "../../core/audio";
import { openLink } from "../../telegram/telegram";
import { button, el } from "../dom";
import type { Nav } from "../nav";

function speakerIcon(on: boolean): SVGElement {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", "22");
  svg.setAttribute("height", "22");
  svg.setAttribute("aria-hidden", "true");
  const body = document.createElementNS(ns, "path");
  body.setAttribute("d", "M3 9v6h4l5 4V5L7 9H3z");
  body.setAttribute("fill", "currentColor");
  svg.append(body);
  if (on) {
    const wave = document.createElementNS(ns, "path");
    wave.setAttribute("d", "M16 8c1.5 1.5 1.5 6.5 0 8M18.5 6c2.8 2.8 2.8 9.2 0 12");
    wave.setAttribute("stroke", "currentColor");
    wave.setAttribute("stroke-width", "1.8");
    wave.setAttribute("fill", "none");
    wave.setAttribute("stroke-linecap", "round");
    svg.append(wave);
  } else {
    const cross = document.createElementNS(ns, "path");
    cross.setAttribute("d", "M16 9l5 6M21 9l-5 6");
    cross.setAttribute("stroke", "currentColor");
    cross.setAttribute("stroke-width", "1.8");
    cross.setAttribute("stroke-linecap", "round");
    svg.append(cross);
  }
  return svg;
}

export function Settings(nav: Nav): HTMLElement {
  const soundBtn = el("button", {
    class: "icon-row",
    "aria-pressed": sound.isEnabled(),
  }) as HTMLButtonElement;

  const render = () => {
    soundBtn.replaceChildren(
      el("span", { class: "icon-row__label" }, [
        speakerIcon(sound.isEnabled()),
        document.createTextNode(ru.settings.sound),
      ]),
      el("span", { class: "icon-row__value" }, [
        sound.isEnabled() ? ru.settings.soundOn : ru.settings.soundOff,
      ]),
    );
  };
  soundBtn.addEventListener("click", () => {
    sound.toggle();
    render();
  });
  render();

  return el("div", { class: "screen screen--settings" }, [
    el("button", { class: "back-link", onClick: () => nav.toMenu() }, ["‹ " + ru.settings.back]),
    el("h2", { class: "subtitle" }, [ru.settings.title]),
    el("div", { class: "settings-list" }, [
      soundBtn,
      button(ru.settings.support, () => nav.toDonate()),
      button(ru.settings.subscribe, () => openLink(LINKS.channel)),
      button(ru.settings.devChannel, () => openLink(LINKS.developer)),
    ]),
    el(
      "button",
      { class: "version", onClick: () => nav.toChangelog() },
      [ru.settings.version(CURRENT_VERSION)],
    ),
  ]);
}
