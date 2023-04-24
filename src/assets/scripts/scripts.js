import Vue from "vue";
import { UAParser } from "ua-parser-js";
import { cloneDeep } from "lodash";
import axios from "axios";

// Проверка объекта на пустоту
export function objectEmptyCheck(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

// Конвертация байтов
export function formatBytes(bytes, decimals = 2) {
  if (bytes == 0) return "0 Байт";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Байт", "Кб", "Мб", "Гб", "Тб"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

// Получение имени файла из url
export function getFileName(url) {
  return url.split("/")[url.split("/").length - 1];
}

// Перевернуть ключи и значения в объекте
export function swapKeysAndValues(obj) {
  const swapped = Object.entries(obj).map(([key, value]) => [value, key]);

  return Object.fromEntries(swapped);
}

// Создать formData
export function createFormData(obj) {
  const formData = new FormData();

  const keys = Object.keys(obj);
  keys.forEach((key) => {
    if (typeof obj[key] === Array) {
      for (const i of obj[key]) {
        formData.append(`${key}[]`, i);
      }
    } else {
      formData.append(key, obj[key]);
    }
  });

  return formData;
}

/**
 * @params {File[]} массив файлов для создания нового FilesList
 * @return {FileList}
 */
export function createFilesListFrom(files) {
  let filesList = new ClipboardEvent("").clipboardData || new DataTransfer();

  for (let i = 0; i < files.length; i++) {
    filesList.items.add(files[i]);
  }

  return filesList.files;
}

// Конвертирует дату из формата dd.mm.yyyy в unixTimestamp
export function dateConverter(date, endDay = false) {
  // Убираем у даты время, если оно есть
  date = date.substr(0, 10);
  let dateStr = date.split(".").reverse().join("-");
  // добавляем время конец дня
  if (endDay) {
    dateStr = `${dateStr} 23:59:59`;
  }
  const newDate = new Date(dateStr);
  const unixTimestamp = Math.floor(newDate.getTime() / 1000);
  return unixTimestamp;
}

// Обрезает строку до нужной длины
export function trimmedString(string, desiredLength) {
  return string.length > desiredLength
    ? `${string.substring(0, desiredLength)}...`
    : string;
}

const parser = new UAParser(navigator.userAgent);

// Определяет устройство пользователя
export function isMobileDevice() {
  return parser.getDevice().type ? true : false;
}

// Определяет ОС мобильного устройства
export function osMobileDevice() {
  if (parser.getOS().name === "Android") return "android";
  if (parser.getOS().name === "iOS") return "IOS";
  return false;
}

// Склоняет существительные в зависимости от числа
export function sklonenie(number, txt) {
  const cases = [2, 0, 1, 1, 1, 2];
  return txt[
    number % 100 > 4 && number % 100 < 20
      ? 2
      : cases[number % 10 < 5 ? number % 10 : 5]
  ];
}

// Проверка на пва или не пва (не клей)
export function isPwa() {
  if (document.location.search === "?mode=standalone") return true;
  return false;
}
// Шина событий
const eventBus = new Vue();
export { eventBus };

// Генерация стилей лейблов для курсов
export function generateLablesForCourse(isDraft, isNewEmployee, status) {
  const labels = [];

  if (isDraft) {
    labels.push({
      collorClass: "gray300 gray-text700",
      text: "Черновик",
    });
  }

  if (isNewEmployee) {
    labels.push({
      collorClass: "white red-text900",
      text: "Новому сотруднику",
    });
  }

  if (status) {
    let statusLabel;

    switch (status) {
      case "progress":
        statusLabel = {
          collorClass: "red900",
          text: "В процессе",
        };
        break;
      case "finished":
        statusLabel = {
          collorClass: "chat-primary",
          text: "Завершен",
        };
        break;
    }

    labels.push(statusLabel);
  }

  return labels.length ? labels : null;
}

// Генерирует ссылку на финальный тест курса
export function getLinkToTest(testId, courseId) {
  return `/training/${courseId}/t_${testId}`;
}

// Генерирует ссылку для урока
export function getLinkForLesson(id) {
  return `e_${id}`;
}

// Генерирует ссылку для курса
export function getLinkForCourse(id) {
  return `/training/${id}`;
}

// Удаляет все, кроме чисел, из строки
export function getOnlyNumber(string) {
  return string.replace(/\D/g, "");
}

// Возвращает id последнего урока из урла
export function getLessonId(urlPart) {
  return getOnlyNumber(urlPart.split("/").at(-1));
}

export function getFinalTestId(urlPart) {
  return getOnlyNumber(urlPart);
}

export function getAssotiatedWidgets(widgets, componentsToAssotiate) {
  return widgets
    .map((widget) => {
      const assotiatedWidget = cloneDeep(componentsToAssotiate[widget.type]);

      if (!assotiatedWidget) return null;

      if (!assotiatedWidget.props) {
        assotiatedWidget.props = {};
      }

      assotiatedWidget.type = widget.type;
      assotiatedWidget.props.name = widget.name;

      return assotiatedWidget;
    })
    .filter((widget) => widget);
}

export { Browser } from "./browser";

export const getBlobLinkFromFileLink = async (link) => {
  // url файла без домена, чтобы на локале работал прокси
  const fileUrlWihoutDomain = link.replace(/.*\/\/[^\/]*/, "");
  const fileData = await axios.get(fileUrlWihoutDomain, {
    responseType: "blob",
  });
  return URL.createObjectURL(fileData.data);
};

export function normalizeExtension(initialExtension) {
  let extension = initialExtension.toLowerCase();

  if (
    extension === "png" ||
    extension === "jpg" ||
    extension === "jpeg" ||
    extension === "gif" ||
    extension === "svg" ||
    extension === "webp"
  ) {
    return "image";
  }
  if (extension === "doc" || extension === "docx") {
    return "doc";
  }
  if (extension === "xls" || extension === "xlsx") {
    return "xls";
  }
  if (extension === "ppt" || extension === "pptx") {
    return "ppt";
  }
  if (extension === "pdf") return "pdf";

  if (extension === "zip" || extension === "rar" || extension === "7z")
    return "zip";

  return "defauilt_file";
}
