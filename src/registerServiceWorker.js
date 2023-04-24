/* eslint-disable no-console, no-undef */

import { register } from "register-service-worker";

if (process.env.NODE_ENV === "production") {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {},
    registered(reg) {
      console.log("Service worker зарегистрирован.");
      setInterval(() => {
        reg.update();
      }, 1000 * 60 * 60); // для настройки частоты проверки
    },
    cached() {
      console.log("Контент кеширован для оффлайн использования");
    },
    updatefound() {
      console.log("Новый контент загружается");
    },
    updated() {
      console.log("Новый контент загружен, обновите страницу");
      // удаляем все кеши в SW, если приложение обновилось
      caches.keys().then(function(names) {
        for (let name of names) caches.delete(name);
      });
      // принудительно перезагружаем страницу
      // window.location.reload(true)
    },
    offline() {
      console.log(
        "Интернет соединение отсутствует, запущен оффлайн режим"
      );
    },
    error(error) {
      console.error("Произошла ошибка: ", error);
    },
  });
}
