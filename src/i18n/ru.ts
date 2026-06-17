/**
 * Все строки интерфейса в одном месте. Структура (объект-словарь) готова к
 * мультиязычности: добавить локаль = новый файл такой же формы.
 */

export const ru = {
  appTitle: "T-REX RUNNER",
  menu: {
    play: "Начать",
    settings: "Настройки",
    hint: "нажми, чтобы прыгнуть",
  },
  settings: {
    title: "Настройки",
    sound: "Звук",
    soundOn: "вкл",
    soundOff: "выкл",
    support: "Поддержать автора",
    subscribe: "Подписаться на канал",
    devChannel: "Канал разработчика",
    back: "Назад",
    version: (v: string) => `версия ${v}`,
  },
  donate: {
    title: "Поддержать автора",
    body: "Это первая игра из серии моих Self Projects. Я делаю их для души и для канала. Поддержать можно подпиской — это уже очень помогает!",
    soon: "Донат во внутренней валюте Telegram скоро будет здесь ✦",
    subscribe: "Подписаться на канал",
    back: "Назад",
  },
  changelog: {
    title: "Изменения",
    back: "Назад",
  },
  game: {
    score: "Счёт",
    best: "Рекорд",
  },
  gameOver: {
    title: "GAME OVER",
    score: "Счёт",
    best: "Рекорд",
    newBest: "Новый рекорд!",
    retry: "Повторим",
    menu: "Меню",
  },
} as const;

export type Strings = typeof ru;
