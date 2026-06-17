import { ru } from "../../i18n/ru";
import { CHANGELOG } from "../../data/changelog";
import { el } from "../dom";
import type { Nav } from "../nav";

export function Changelog(nav: Nav): HTMLElement {
  const entries = CHANGELOG.map((entry) =>
    el("div", { class: "changelog-entry" }, [
      el("div", { class: "changelog-head" }, [
        el("span", { class: "changelog-version" }, [`v${entry.version}`]),
        el("span", { class: "changelog-date" }, [entry.date]),
      ]),
      el(
        "ul",
        { class: "changelog-list" },
        entry.changes.map((c) => el("li", {}, [c])),
      ),
    ]),
  );

  return el("div", { class: "screen screen--changelog" }, [
    el("button", { class: "back-link", onClick: () => nav.toSettings() }, ["‹ " + ru.changelog.back]),
    el("h2", { class: "subtitle" }, [ru.changelog.title]),
    el("div", { class: "changelog-scroll" }, entries),
  ]);
}
