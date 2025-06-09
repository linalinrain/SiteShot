// ---------------------------------------------------------------
// Глобальные переменные и константы
// ---------------------------------------------------------------

// ====== ✅ Рабочий кэш
let siteShotData = {};
const SITE_SHOT_SAVE_DELAY_MS = 5000;
let siteShotSaveTimeout = null;

let fileGuidQueryTimeout = null;
const SITE_SHOT_QUERY_PUSH_DELAY_MS  = 1000;
// 🔒 Модуль управления активным GUID
const ActiveGuidManager = (() => {
    let currentlyActiveContentGuid = null;
  
    return {
      get: () => currentlyActiveContentGuid,
      set: (guid) => {
        const prev = currentlyActiveContentGuid;
        currentlyActiveContentGuid = guid;
  
        console.log(
          `%c📌 Активный GUID изменён: %c${prev || 'null'} %c→ %c${guid}`,
          'color: dodgerblue; font-weight: bold',
          'color: gray',
          'color: black',
          'color: gray'
        );
  
        queuePushFileGuidToQuery(guid);
      }
    };
})();

let scrollDirection = null;
let scrollAnimationFrame = null;
let scrollTimeout = null;

const SCROLL_SPEED_PX_PER_SEC = 500;
const SCROLL_DURATION = 100;
  
// ====== Иконки
const SVG_FILE_PATH = "M772 1012L511 761l-260 251a49 49 0 0 1-52 10c-18-7-29-24-29-43V132c0-25 21-46 47-46h588c26 0 47 21 47 46v847c0 19-11 36-29 43a49 49 0 0 1-51-10zM545 664l213 205V181H265v688l213-205c9-9 21-14 33-14s24 5 34 14z";
const SVG_FOLDER_PATH = "M571 274h327c23 0 41 18 41 41v488c0 22-18 40-41 40H126c-23 0-41-18-41-40V242c0-34 27-61 61-61h317c18 0 35 7 47 21l61 72zm-119-8H170v492h684V359H531l-79-93z";
const SVG_EYE_PATH = "M1008.714 490.522c-9.002-12.594-223.276-308.808-496.684-308.808-273.444 0-487.682 296.214-496.684 308.808l-15.316 21.49 15.316 21.466c9.002 12.618 223.24 308.808 496.684 308.808 273.408 0 487.682-296.19 496.684-308.808l15.316-21.466-15.316-21.49zM807.68 631.688c-46 39.142-92.558 70.064-138.382 91.904-53.874 25.676-106.786 38.694-157.266 38.694-50.49 0-103.406-13.018-157.282-38.696-45.826-21.838-92.382-52.758-138.378-91.902-53.708-45.706-94.302-92.122-116.61-119.672 22.36-27.602 63.028-74.094 116.612-119.696 45.996-39.146 92.554-70.068 138.378-91.908 53.876-25.678 106.792-38.698 157.28-38.698 50.48 0 103.39 13.020 157.264 38.696 45.824 21.842 92.382 52.764 138.382 91.91 53.602 45.614 94.264 92.098 116.624 119.696-22.306 27.544-62.898 73.954-116.622 119.672zM692.032 512.036c0 99.41-80.588 180-180 180s-180-80.59-180-180c0-99.406 80.588-179.998 180-179.998s180 80.59 180 179.998z";
const SVG_EYE_CROSSED_PATH = "M75.744 948.314c-15.62-15.62-15.62-40.948 0-56.564l816-816c15.626-15.624 40.95-15.624 56.57 0 15.624 15.62 15.626 40.946 0.004 56.57l-816 815.994c-15.62 15.62-40.95 15.62-56.572 0zM332.032 512.034c0 20.104 3.296 39.434 9.376 57.484l228.104-228.106c-18.050-6.080-37.38-9.376-57.48-9.376-99.412-0.004-180 80.588-180 179.996zM692.032 512.034c0-20.1-3.3-39.432-9.38-57.484l-228.106 228.11c18.052 6.080 37.384 9.376 57.488 9.376 99.412 0 180-80.59 180-180zM1008.716 490.522c-4.98-6.968-72.86-100.8-178.81-183.22l-57.040 57.040c11.624 8.8 23.24 18.128 34.814 27.98 53.6 45.614 94.264 92.1 116.624 119.696-22.304 27.544-62.896 73.954-116.62 119.672-46 39.14-92.56 70.064-138.384 91.904-53.872 25.676-106.786 38.694-157.266 38.694-37.448 0-76.234-7.18-115.76-21.36l-61.486 61.49c54.786 24.22 114.45 39.87 177.248 39.87 273.41 0 487.684-296.19 496.686-308.808l15.316-21.468-15.316-21.49zM216.372 631.69c-53.708-45.706-94.3-92.12-116.61-119.672 22.36-27.6 63.028-74.094 116.612-119.696 46-39.146 92.554-70.068 138.38-91.908 53.874-25.68 106.79-38.7 157.28-38.7 37.46 0 76.264 7.188 115.8 21.38l61.484-61.484c-54.796-24.236-114.474-39.896-177.286-39.896-273.446 0-487.684 296.214-496.686 308.808l-15.316 21.49 15.314 21.466c4.98 6.984 72.866 100.84 178.84 183.26l57.040-57.040c-11.64-8.806-23.264-18.144-34.854-28.008z";

// ====== Модель активных фильтров ======
const filters = {
    result: {
      error: true,
      failed: true,
      success: true,
    },
    skip: {
      skipped: true,
      unskipped: true 
    },
    view: {
      viewed: true,
      unviewed: true
    },
    verify: {
      verified: true,
      unverified: true
    }
};

// ====== Соответствия иконок - фильтрам
const FILTER_ICONS = {
    result: {
        error: SVG_FILE_PATH,
        failed: SVG_FILE_PATH,
        success: SVG_FILE_PATH,
    },
    skip: {
        skipped: SVG_FILE_PATH,
        unskipped: SVG_FILE_PATH,
    },
    view: {
        viewed: SVG_EYE_PATH,
        unviewed: SVG_EYE_CROSSED_PATH
    },
    verify: {
        verified: SVG_FILE_PATH,
        unverified: SVG_FILE_PATH
    }
};

// ====== Режимы отображения
const MODES = {
    "side-by-side": { "label": "Side-by-side" },
    "swap": { "label": "Swap" },
    "slide": { "label": "Slide" },
    "blend": {"label": "Blend" },
};

// ====== Main - Основной код ======

// Мердж данных из data.js и localStorage
measureTime(() => mergeDataWithLocalStorage());
// Константы для оптимизации работыЛогическая сборка структуры дерева
// Структура дерева
const treeStructure = measureTime(() => buildTreeFromData(getCachedSiteShotData()));
// Массив с порядком guid'ов соответствующий порядку в дереве
const orderedAllGuids = new Proxy(
    Object.freeze(measureTime(() => mapOrderNumberToGuidsInOrder())),
    {
      set(target, prop, value) {
        console.warn(`⚠️ Попытка изменить orderedAllGuids[${prop}] → "${value}" отклонена.`);
        return false;
      },
      deleteProperty(target, prop) {
        console.warn(`⚠️ Попытка удалить orderedAllGuids[${prop}] отклонена.`);
        return false;
      }
    }
);
  
document.addEventListener("DOMContentLoaded", () => {
    measureTime(() => buildSideBar());
    measureTime(() => generateFileTree());
    measureTime(() => updateFilters());
    //measureTime(() => setupResizablePanel());
    measureTime(() => initializeFromQuery());
});
  
document.addEventListener("keydown", function(event) {
    switch (event.code) {
        case "ArrowRight":
            event.preventDefault();
            goToNextFile();
            break;
        case "ArrowLeft":
            event.preventDefault();
            goToPreviousFile();
            break;
        case "ArrowUp":
            event.preventDefault();
            triggerTimedScroll("up");
            break;
        case "ArrowDown":
            event.preventDefault();
            triggerTimedScroll("down");
            break;
        case "Home":
            event.preventDefault();
            scrollToTop();
            break;
        case "End":
            event.preventDefault();
            scrollToBottom();
            break;
        case "Enter":
            event.preventDefault();
            verifyAndGoToNextFile();
            break;
        default:
            break;
    }
});

// Обновляет query-параметр counter (увеличивает или устанавливает 1)
function updateCounterInQuery() {
    const url = new URL(window.location.href);
    const current = parseInt(url.searchParams.get("counter") || "0", 10);
    url.searchParams.set("counter", current + 1);
  
    history.replaceState(null, "", url.toString());
}

// ====== 0. Вспомоигательные методы ======

// Функция: Для оценки времени выполнения переданной функции с использованием console.time
function measureTime(fn) {
    // Определяем имя функции или создаём описание для анонимной
    let fnName = fn.name;
    if (!fnName) {
      const fnStr = fn.toString();
      const match = fnStr.match(/=>\s*([a-zA-Z0-9_]+)/);
      fnName = match?.[1] || 'анонимная';
    }
  
    const label = `⏱ ${fnName}`;
    const startLabel = `${label} → Start`;
    const finishLabel = `${label} → Finish`;
  
    console.log(startLabel);
    console.time(finishLabel);
  
    const result = fn();
  
    console.timeEnd(finishLabel);
    return result;
}

// ====== 1. Utils функции ======

// Функция: Получени чистого урла, для получения ключа
function getUrlKey() {
    var cleanUrl = window.location.origin + window.location.pathname;
    var urlKey = `siteshot_statuses_${cleanUrl}`;

    return urlKey;
}

function createSvgIcon(pathData) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 1024 1024");
    svg.setAttribute("fill", "currentColor");
    svg.setAttribute("stroke", "currentColor");
    svg.style.color = "inherit";

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);

    svg.appendChild(path);
    return svg;
}

function createStatusIconSpan(fileSvg) {
    const span = document.createElement("span");
    span.classList.add("status-icon");
    span.appendChild(fileSvg);

    return span;
}

// ====== 2. Инициализация работы с LocalStorage ======

// ⏱ Отложенное сохранение (debounce)
function queueSaveSiteShotData() {
    const hadPrevious = siteShotSaveTimeout !== null;
  
    if (hadPrevious) {
      clearTimeout(siteShotSaveTimeout);
    }
  
    const jobLabel = '[siteShotDataToLocalStorageJob]';
  
    if (hadPrevious) {
      console.log(
        `%c🕓 Добавлена задача в очередь: %c${jobLabel} %c(предыдущий таймер обновлён)`,
        'color: orange; font-weight: bold',
        'color: mediumslateblue',
        'color: gray'
      );
    } else {
      console.log(
        `%c🕓 Добавлена задача в очередь: %c${jobLabel}`,
        'color: orange; font-weight: bold',
        'color: mediumslateblue'
      );
    }
  
    siteShotSaveTimeout = setTimeout(() => {
        measureTime(() => saveSiteShotDataToLocalStorage());
      
        console.log(
          `%c✅ Выполнена задача из очереди: %c[siteShotDataToLocalStorageJob]`,
          'color: seagreen; font-weight: bold',
          'color: mediumslateblue; font-weight: bold'
        );
      
        siteShotSaveTimeout = null;
    }, SITE_SHOT_SAVE_DELAY_MS);      
}

// 💾 Функция для сохранения данных в localStorage
function saveSiteShotDataToLocalStorage() {
    localStorage.setItem(getUrlKey(), JSON.stringify(siteShotData)); 
}

// Возвращает закэшированные siteShotData
function getCachedSiteShotData() {
    return siteShotData;
}

// Сохраняем данные в localStorage
function saveSiteShotData() {
    queueSaveSiteShotData();
}

// Обновление DOM-элемента
function updateFileInDOM(guid) {
    const fileElem = document.querySelector(`.file[data-guid="${guid}"]`);
    if (fileElem && siteShotData[guid]) {
      updateFileDataAttributes(fileElem, siteShotData[guid]);
    }
}

// Обновление атрибутов DOM-элемента 
function updateFileDataAttributes(elem, fileData) {
    const filterKeys = Object.keys(filters);

    // 1. Сохраняем исходный список классов
    const initialClasses = [...elem.classList];

    // 2. Фильтруем список, исключая классы, начинающиеся на ключи из filters
    const filteredClasses = initialClasses.filter(cls => {
        return !filterKeys.some(key => cls.startsWith(`${key}-`));
    });

    // 3. Формируем новые классы динамически
    const newClasses = filterKeys.map(key => `${key}-${fileData[key]}`);

    // 4. Объединяем всё вместе
    elem.className = [...filteredClasses, ...newClasses].join(" ");
}

// Объединяем серверные данные с localStorage
function mergeDataWithLocalStorage() {
  const serverData = window.__SITESHOT_DATA__;
  const lsValue = localStorage.getItem(getUrlKey());
  const localData = lsValue ? JSON.parse(lsValue) : {};

  Object.keys(serverData).forEach(guid => {
    siteShotData[guid] = localData.hasOwnProperty(guid) ? localData[guid] : serverData[guid];
  });

  saveSiteShotData();
}

// Обновление данных с обновлением local storage
function updateSiteShotDataField(guid, field, value) {
    const target = siteShotData[guid];
    if (!target) return;
  
    const oldValue = target[field];
    if (oldValue === value) {
      return;
    }
  
    target[field] = value;
  
    saveSiteShotData();
}

// ====== 3. Создаем SideBar ======

// Создаем сам SideBar
function buildSideBar() {
    const logoContainer = document.getElementById("logo");
    populateLogoSection(logoContainer);
    buildFiltersUI();
}

// Создаем логотип
function populateLogoSection(logoContainer) {
    const PATH_1 = `M1.2 36.9L0 3.9c0-1.1.8-2 1.9-2.1l28-1.8a2 2 0 0 1 2.2 1.9 2 2 0 0 1 0 .1v36a2 2 0 0 1-2 2 2 2 0 0 1-.1 0L3.2 38.8a2 2 0 0 1-2-2z`;
    const PATH_2 = `M48.3,31c-1.6-0.5-2.9-1.1-3.9-1.9l1.6-3.6c2.2,1.5,4.6,2.3,7.2,2.3c1.4,0,2.5-0.2,3.2-0.7 
            c0.7-0.5,1.1-1.1,1.1-1.9c0-0.7-0.3-1.3-1-1.7c-0.7-0.4-1.9-0.8-3.7-1.2c-2-0.4-3.5-0.9-4.7-1.5c-1.2-0.6-2-1.3-2.6-2.1 
            s-0.8-1.9-0.8-3.1c0-1.4,0.4-2.6,1.1-3.7c0.7-1.1,1.8-1.9,3.1-2.5c1.3-0.6,2.9-0.9,4.7-0.9c1.6,0,3.1,0.2,4.6,0.7 
            c1.5,0.5,2.6,1.1,3.5,1.9l-1.6,3.6c-2-1.5-4.2-2.3-6.5-2.3c-1.3,0-2.3,0.3-3,0.8c-0.7,0.5-1.1,1.2-1.1,2.1c0,0.5,0.1,0.9,0.4,1.3 
            c0.3,0.3,0.8,0.6,1.4,0.9s1.6,0.5,2.8,0.8c2.9,0.6,4.9,1.5,6.2,2.5c1.3,1,1.9,2.4,1.9,4.2c0,2.1-0.8,3.8-2.4,5.1 
            c-1.6,1.2-3.9,1.8-6.8,1.8C51.5,31.7,49.9,31.5,48.3,31zM70.6,8.1v4.5h-5.1V8.1H70.6z 
            M65.6,15.7h4.8v15.8h-4.8V15.7zM84.2,28l-0.3,3.5c-0.6,0.1-1.2,0.1-1.8,0.1c-2.4,0-4.1-0.5-5.2-1.6c-1.1-1-1.6-2.6-1.6-4.8v-6h-2.9v-3.6h2.9 
            V11h4.8v4.6h3.9v3.6h-3.9v6c0,1.9,0.9,2.8,2.6,2.8C83.1,28.1,83.6,28.1,84.2,28zM100.3,24.5H90.1c0.1,1.3,0.6,2.2,1.2,2.7C92,27.8,93,28,94.2,28c0.8,0,1.6-0.1,2.4-0.4s1.5-0.6,2.2-1.1 
            l1.3,3.2c-0.8,0.6-1.7,1.1-2.8,1.4s-2.2,0.5-3.3,0.5c-2.6,0-4.7-0.7-6.2-2.2c-1.5-1.5-2.3-3.5-2.3-6c0-1.6,0.3-3,1-4.3 
            c0.7-1.2,1.6-2.2,2.7-2.9c1.2-0.7,2.5-1,4-1c2.2,0,3.9,0.7,5.2,2.2s1.9,3.4,1.9,5.8V24.5z M91.1,19.5c-0.5,0.6-0.9,1.4-1,2.6h6.1 
            c-0.1-1.1-0.3-2-0.8-2.6c-0.5-0.6-1.2-0.9-2.1-0.9C92.4,18.6,91.7,18.9,91.1,19.5zM105.2,31.2c-1.2-0.3-2.2-0.8-3.1-1.4l1.3-3.3c0.8,0.6,1.8,1,2.8,1.3c1,0.3,2,0.5,3.1,0.5 
            c0.7,0,1.3-0.1,1.7-0.4c0.4-0.2,0.6-0.6,0.6-1c0-0.4-0.1-0.7-0.4-0.9c-0.3-0.2-0.8-0.4-1.6-0.6l-2.5-0.6c-1.5-0.3-2.6-0.9-3.3-1.6 
            s-1.1-1.7-1.1-2.9c0-1,0.3-1.9,0.8-2.6c0.6-0.7,1.3-1.3,2.4-1.8c1-0.4,2.2-0.6,3.5-0.6c1.1,0,2.2,0.2,3.3,0.5c1.1,0.3,2,0.8,2.8,1.4 
            l-1.3,3.2c-1.6-1.2-3.3-1.7-4.9-1.7c-0.7,0-1.3,0.1-1.7,0.4c-0.4,0.3-0.6,0.6-0.6,1.1c0,0.3,0.1,0.6,0.4,0.8 
            c0.3,0.2,0.7,0.4,1.3,0.5l2.6,0.6c1.6,0.4,2.7,0.9,3.5,1.7c0.7,0.7,1.1,1.7,1.1,3c0,1.5-0.6,2.7-1.8,3.6c-1.2,0.9-2.8,1.3-4.9,1.3 
            C107.7,31.7,106.4,31.5,105.2,31.2zM132.4,16.9c0.9,1.1,1.4,2.8,1.4,5v9.5H129v-9.3c0-1.1-0.2-1.9-0.6-2.3c-0.4-0.5-1-0.7-1.8-0.7 
            c-1,0-1.8,0.3-2.4,1s-0.9,1.5-0.9,2.6v8.8h-4.8V8.8h4.8v9c0.5-0.8,1.2-1.4,2.1-1.8c0.9-0.4,1.8-0.6,2.9-0.6 
            C130.1,15.3,131.5,15.8,132.4,16.9zM140.5,30.7c-1.2-0.7-2.2-1.6-2.9-2.9c-0.7-1.2-1-2.7-1-4.3s0.3-3.1,1-4.3c0.7-1.2,1.6-2.2,2.9-2.8 
            c1.2-0.7,2.7-1,4.3-1s3.1,0.3,4.3,1c1.2,0.7,2.2,1.6,2.9,2.8s1,2.7,1,4.3s-0.3,3.1-1,4.3s-1.6,2.2-2.9,2.9c-1.2,0.7-2.7,1-4.3,1 
            S141.7,31.3,140.5,30.7z M148.3,23.5c0-1.5-0.3-2.7-0.9-3.4c-0.6-0.7-1.5-1.1-2.6-1.1c-2.3,0-3.5,1.5-3.5,4.5c0,3,1.2,4.5,3.5,4.5 
            C147.1,28,148.3,26.5,148.3,23.5zM165.9,28l-0.3,3.5c-0.6,0.1-1.2,0.1-1.8,0.1c-2.4,0-4.1-0.5-5.2-1.6c-1.1-1-1.6-2.6-1.6-4.8v-6h-2.9v-3.6h2.9 
            V11h4.8v4.6h3.9v3.6h-3.9v6c0,1.9,0.9,2.8,2.6,2.8C164.9,28.1,165.4,28.1,165.9,28z`;
    const PATH_3 = `M23.7 5L24 .2l3.9-.3.1 4.8a.3.3 0 0 1-.5.2L26 3.8l-1.7 1.4a.3.3 0 0 1-.5-.3zm-5 10c0 .9 5.3.5 6 0 0-5.4-2.8-8.2-8-8.2-5.3 
            0-8.2 2.8-8.2 7.1 0 7.4 10 7.6 10 11.6 0 1.2-.5 1.9-1.8 1.9-1.6 0-2.2-.9-2.1-3.6 0-.6-6.1-.8-6.3 0-.5 6.7 3.7 8.6 8.5 8.6 4.6 0 8.3-2.5 
            8.3-7 0-7.9-10.2-7.7-10.2-11.6 0-1.6 1.2-1.8 2-1.8.6 0 2 0 1.9 3z`;

    // Создаём обёртку для логотипа
    const logoWrapper = document.createElement('div');
    logoWrapper.id = 'logo-wrapper';
    logoWrapper.classList.add('logo-wrapper');
    logoWrapper.classList.add("side-container-section", "logo-section");
    logoWrapper.style.padding = "3px 20px 3px";

    // Определяем пространство имён SVG
    const SVG_NS = 'http://www.w3.org/2000/svg';

    // Создаём основной элемент <svg>
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('id', 'site-shot-logo');
    svg.setAttribute('width', '200px');
    svg.setAttribute('height', '40px');
    svg.setAttribute('viewBox', '0 0 200 40');
    svg.setAttribute('class', 'logo-svg');
    svg.setAttribute('role', 'img');
    svg.style.width = "auto";
    svg.style.display = "block";
    svg.style.height = "22px";

    // Создаём элемент <defs> и внутри него <path> для использования через <use>
    const defs = document.createElementNS(SVG_NS, 'defs');
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', PATH_1);
    path.setAttribute('id', 'logo-path');
    defs.appendChild(path);
    svg.appendChild(defs);

    // Создаём группу <g> с атрибутами fill="none" и fill-rule="evenodd"
    const gElem = document.createElementNS(SVG_NS, 'g');
    gElem.setAttribute('fill', 'none');
    gElem.setAttribute('fill-rule', 'evenodd');

    // 1) Первый путь <path ...>
    const path1 = document.createElementNS(SVG_NS, 'path');
    path1.setAttribute('d', PATH_2);
    path1.setAttribute('fill', 'currentColor');
    gElem.appendChild(path1);

    // 2) Элемент <use> с синим цветом
    const useElem = document.createElementNS(SVG_NS, 'use');
    useElem.setAttribute('fill', '#51ADFF');
    useElem.setAttribute('fill-rule', 'nonzero');
    // Для xlink:href указываем пространство имён XLink
    useElem.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#logo-path');
    gElem.appendChild(useElem);

    // 3) Второй путь <path ...>
    const path2 = document.createElementNS(SVG_NS, 'path');
    path2.setAttribute('d', PATH_3);
    path2.setAttribute('fill', '#FFF');
    path2.setAttribute('fill-rule', 'nonzero');
    gElem.appendChild(path2);

    // Добавляем созданную группу <g> внутрь основного <svg>
    svg.appendChild(gElem);

    // Помещаем <svg> в обёртку
    logoWrapper.appendChild(svg);

    // Вставляем обёртку в нужный контейнер (секцию логотипа)
    logoContainer.appendChild(logoWrapper);
}

// Создаем фильтры
function buildFiltersUI() {
    const filtersContainer = document.getElementById("filters");
    filtersContainer.innerHTML = "";
  
    Object.entries(filters).forEach(([categoryKey, categoryValues]) => {
      const groupDiv = document.createElement("div");
      groupDiv.classList.add("filter-group");
      groupDiv.id = `${categoryKey}-filter-group`;
  
      Object.keys(categoryValues).forEach(value => {
        const label = document.createElement("label");
        label.classList.add(`${categoryKey}-${value}`);
  
        // === Иконка ===
        const iconSpan = document.createElement("span");
        iconSpan.classList.add("status-icon");
  
        const iconPath = FILTER_ICONS[categoryKey]?.[value] || SVG_FILE_PATH;
        const iconSvg = createSvgIcon(iconPath);
        iconSpan.appendChild(iconSvg);
        label.appendChild(iconSpan);
  
        // === Чекбокс ===
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `filter-${value}`;
        checkbox.checked = filters[categoryKey][value];
        checkbox.dataset.category = categoryKey;
        checkbox.dataset.value = value;
        checkbox.setAttribute("onchange", "updateFiltersByCheckbox(this)");
        label.appendChild(checkbox);
  
        // === Счётчик ===
        const countSpan = document.createElement("span");
        countSpan.classList.add("filter-count");
        countSpan.dataset.count = "0";
        countSpan.dataset.label = value;
        label.appendChild(countSpan);
  
        groupDiv.appendChild(label);
      });
  
      filtersContainer.appendChild(groupDiv);
    });
}

// ====== 4. Создаем FileTree ======

// Создаем дерево файлов
function generateFileTree() {
    const treeContainer = document.getElementById("file-tree");
    treeContainer.innerHTML = "";
    const treeHTML = buildTreeHTML(treeStructure, 0);
    treeContainer.appendChild(treeHTML);
}

// Создает дерево из данных с дополнительной мета-информацией
// Создает дерево из данных с дополнительной мета-информацией
function buildTreeFromData(data) {
    const tree = [];
  
    for (const guid in data) {
      const fileData = data[guid];
      const path = fileData.storyPath;
  
      let currentLevel = tree;
      let idChain = [];
  
      path.forEach((part, index) => {
        let node = currentLevel.find(n => n.name === part);
  
        if (!node) {
          const isFile = index === path.length - 1;
          const newIdChain = [...idChain, currentLevel.length];
  
          node = {
            name: part,
            children: [],
            level: index,
            idChain: newIdChain,
            type: isFile ? "file" : "folder",
            id: `${isFile ? "file" : "folder"}-${newIdChain.join("-")}`
          };
  
          if (isFile) {
            node.guid = guid;
            node.orderNumber = parseInt(newIdChain.join(""));
          }
  
          currentLevel.push(node);
        }
  
        currentLevel = node.children;
        idChain = node.idChain;
      });
    }
  
    return tree;
} 
 
// Создаем Html дерево

// -------

// Создаёт HTML-дерево на основе структуры с мета-данными
function buildTreeHTML(nodes) {
    const siteShotData = getCachedSiteShotData();
  
    const fileIconHTML = createStatusIconSpan(createSvgIcon(SVG_FILE_PATH)).outerHTML;
    const folderIconHTML = createStatusIconSpan(createSvgIcon(SVG_FOLDER_PATH)).outerHTML;
  
    // 1️⃣ Определяем максимальную вложенность для генерации CSS
    function getMaxDepth(nodes, level = 0) {
      return nodes.reduce((max, node) => {
        const depth = node.children?.length ? getMaxDepth(node.children, level + 1) : level;
        return Math.max(max, depth);
      }, level);
    }
  
    const maxLevel = getMaxDepth(nodes);
  
    function generateTreeLevelCSS(maxLevel, paddingStep = 18) {
      let styleContent = "";
      for (let i = 0; i <= maxLevel; i++) {
        const folderPadding = i * paddingStep;
        const filePadding = folderPadding + paddingStep;
  
        styleContent += `
          .level-${i}-folder summary { padding-left: ${folderPadding}px; cursor: pointer; }
          .level-${i}-file { padding-left: ${filePadding}px; }
        `;
      }
  
      const styleTag = document.createElement("style");
      styleTag.textContent = styleContent;
      document.head.appendChild(styleTag);
    }
  
    generateTreeLevelCSS(maxLevel);
  
    // 2️⃣ Основной контейнер
    const container = document.createElement("div");
    container.classList.add("tree-root");
  
    // 3️⃣ Рекурсивная сборка дерева
    function createTreeHTML(nodes) {
      const fragment = document.createDocumentFragment();
  
      nodes.forEach(node => {
        if (node.type === "file") {
          fragment.appendChild(createFileElement(node));
        } else {
          const folderElem = createFolderElement(node);
          fragment.appendChild(folderElem);
  
          if (node.children?.length) {
            const childFragment = createTreeHTML(node.children);
            folderElem.appendChild(childFragment);
          }
        }
      });
  
      return fragment;
    }
  
    // 4️⃣ Создание файла
    function createFileElement(node) {
        const nodeDiv = document.createElement("div");
      
        nodeDiv.classList.add(`level-${node.level}-file`, "file");
        nodeDiv.id = node.id;
        nodeDiv.dataset.guid = node.guid;
        nodeDiv.innerHTML = fileIconHTML;
      
        const itemNameSpan = document.createElement("span");
        itemNameSpan.classList.add("item-name");
        itemNameSpan.textContent = node.name;
        nodeDiv.appendChild(itemNameSpan);
      
        const fileData = siteShotData[node.guid];
        updateFileDataAttributes(nodeDiv, fileData);
      
        nodeDiv.setAttribute("onclick", "openFileOnClick(this.dataset.guid)");
      
        return nodeDiv;
    }
  
    // 5️⃣ Создание папки
    function createFolderElement(node) {
      const details = document.createElement("details");
      const summary = document.createElement("summary");
  
      details.classList.add(`level-${node.level}-folder`, "folder");
      details.id = node.id;
      details.dataset.name = node.name;
  
      summary.innerHTML = folderIconHTML;
      summary.classList.add("folder");
  
      const itemNameSpan = document.createElement("span");
      itemNameSpan.classList.add("item-name");
      itemNameSpan.textContent = node.name;
      summary.appendChild(itemNameSpan);
  
      details.appendChild(summary);
      return details;
    }
  
    // 6️⃣ Сборка дерева и возврат
    container.appendChild(createTreeHTML(nodes));
    return container;
}

// ====== 5. Функция для работы с Фильтрами ======
function updateFilters() {
    measureTime(() => updateFiltersBase());
}

function updateFiltersByCheckbox(checkbox) {
    measureTime(() => updateFilterValue(checkbox));
    measureTime(() => updateFiltersBase());
}

function updateFilterValue(checkbox) {
    const category = checkbox.dataset.category;
    const value = checkbox.dataset.value;
    const checked = checkbox.checked;

    if (filters[category] && value in filters[category]) {
        filters[category][value] = checked;
    } else {
        console.warn(`⚠️ Неизвестный фильтр: ${category} → ${value}`);
    }
}

function updateFiltersBase() {
    const activeFilters = getActiveFilters();
    const filteredFiles = getFilteredFiles(activeFilters);
    updateFilterCounters(filteredFiles);
}

function getActiveFilters() {
    return Object.fromEntries(
        Object.entries(filters).map(([category, values]) => [
            category,
            new Set(
                Object.entries(values)
                .filter(([, isEnabled]) => isEnabled)
                .map(([value]) => value)
            )
        ])
    );
}

function getFilteredFiles(activeFilters) {
    // Фильтруем siteShotData и возвращаем словарь (объект) с сохранением исходных ключей
    return Object.fromEntries(
        Object.entries(siteShotData).filter(([key, file]) =>
            Object.entries(activeFilters).every(
                ([category, activeSet]) => activeSet.has(file[category])
            )
        )
    );
}

function updateFilterCounters(filteredFiles) {
    const newCounts = {};

    // 1️⃣ Инициализация счётчиков для каждой категории и значения
    for (const [category, values] of Object.entries(filters)) {
        newCounts[category] = {};
        for (const value in values) {
            newCounts[category][value] = 0;
        }
    }

    // 2️⃣ Подсчёт: перебираем все отфильтрованные файлы (как значения словаря)
    for (const file of Object.values(filteredFiles)) {
        for (const category in newCounts) {
            const fileValue = file[category];
            if (fileValue in newCounts[category]) {
                newCounts[category][fileValue]++;
            }
        }
    }

    // 3️⃣ Обновление DOM-счётчиков
    for (const [category, counts] of Object.entries(newCounts)) {
        for (const value in counts) {
            const filterLabel = document.querySelector(`.${category}-${value}`);
            if (filterLabel) {
                const countSpan = filterLabel.querySelector(".filter-count");
                if (countSpan && parseInt(countSpan.dataset.count, 10) !== counts[value]) {
                    countSpan.dataset.count = counts[value];
                }
            }
        }
    }
}

// Возвращает массив guid'ов, отсортированных по порядковому номеру
function mapOrderNumberToGuidsInOrder() {
    const orderMap = {};

    function traverse(nodes) {
        for (const node of nodes) {
            if (node.type === "file" && typeof node.orderNumber === "number") {
                orderMap[node.orderNumber] = node.guid;
            }
            if (node.children?.length) {
                traverse(node.children);
            }
        }
    }

    traverse(treeStructure);

    // Возвращаем массив guid'ов в порядке возрастания orderNumber
    return Object.keys(orderMap)
        .map(Number)
        .sort((a, b) => a - b)
        .map(orderNumber => orderMap[orderNumber]);
}

// Возвращает отфильтрованные guid'ы в порядке как в дереве файлов
function getOrderedFilteredGuids() {
    const activeFilters = getActiveFilters();
    const filteredFiles = getFilteredFiles(activeFilters);

    // Фильтруем только те GUID'ы, которые есть среди отфильтрованных файлов
    return orderedAllGuids.filter(guid => filteredFiles.hasOwnProperty(guid));
}  
   
// ====== 6. Работа с файлами ======
// Функция открытия файла по клику
function openFileOnClick(guid) {
    measureTime(() => openFile(guid));

    const currentActiveGuid = ActiveGuidManager.get();
    // Если элемента нет или он уже активен — выходим
    if (currentActiveGuid === guid) {
        return;
    }
}

// Функция открытия файла в окне Content
function openFile(guid) {
    const data = getCachedSiteShotData()[guid];
    if (!data) {
        showFileDetails(null); // Это тоже может менять DOM
        return;
    }

    // Обновляем guid если он не совпадает с текущим активным
    const currentActiveGuid = ActiveGuidManager.get();
    if (currentActiveGuid !== guid) {
        ActiveGuidManager.set(guid);
    }

    // Обновляем данные о файле в кэше siteShotData
    updateSiteShotDataField(guid, "view", "viewed");

    // Переносим тяжёлые DOM-операции на следующий кадр
    requestAnimationFrame(() => {
        markFileAsActive(guid);
        updateFileInDOM(guid);
        showFileDetails(data, guid);
        updateFilters();
    });
}

// Функция помечает файл активным
function markFileAsActive(guid) {
    const newActive = document.querySelector(`[data-guid="${guid}"]`);

    if (!newActive) {
      return;
    }
  
    // Найдём ТОЛЬКО те элементы, у которых уже стоит data-active
    const previouslyActive = document.querySelectorAll('[data-active="true"]');
  
    // Если уже активен — ничего не делаем
    if (newActive.dataset.active === "true" && previouslyActive.length === 1) {
      return;
    }
  
    // Убираем флаг у всех активных
    previouslyActive.forEach(el => {
      el.removeAttribute("data-active");
    });
  
    // Ставим флаг на нужный
    newActive.dataset.active = "true";
}

// Функция получения GUID активного файла из query-параметров
function getFileGuidFromQuery() {
    return new URLSearchParams(location.search).get("guid");
}

// ⏱ Отложенное добавление GUID в query-параметры
function queuePushFileGuidToQuery(guid) {
    const hadPrevious = fileGuidQueryTimeout !== null;
  
    if (hadPrevious) {
      clearTimeout(fileGuidQueryTimeout);
    }
  
    const jobLabel = '[guidToQueryJob]';
  
    if (hadPrevious) {
      console.log(
        `%c🕓 Добавлена задача в очередь: %c${jobLabel} %c"${guid}" %c(предыдущий таймер обновлён)`,
        'color: orange; font-weight: bold',
        'color: mediumslateblue',
        'color: lightseagreen',
        'color: gray'
      );
    } else {
      console.log(
        `%c🕓 Добавлена задача в очередь: %c${jobLabel} %c"${guid}"`,
        'color: orange; font-weight: bold',
        'color: mediumslateblue',
        'color: lightseagreen'
      );
    }
  
    fileGuidQueryTimeout = setTimeout(() => {
        measureTime(() => pushFileGuidToQuery(guid));
      
        console.log(
          `%c✅ Выполнена задача из очереди: %c[guidToQueryJob] %c"${guid}"`,
          'color: seagreen; font-weight: bold',
          'color: mediumslateblue; font-weight: bold',
          'color: lightseagreen'
        );
      
        fileGuidQueryTimeout = null;
    }, SITE_SHOT_QUERY_PUSH_DELAY_MS);      
}
  
  
// Функция для обновления query строки по GUID
function pushFileGuidToQuery(guid) {
    const query = new URLSearchParams(window.location.search);
    query.set("guid", guid);
    const newUrl = window.location.origin + window.location.pathname + "?" + query.toString();
    history.pushState(null, "", newUrl);
}

// Основная функция отображения деталей файла
function showFileDetails(fileData, guid) {
    const container = document.getElementById("content");

    // Создаём временный контейнер в памяти
    const fragment = document.createDocumentFragment();

    if (!fileData) {
        const errorH1 = document.createElement("h1");
        errorH1.textContent = "Не найдено данных о файле";
        fragment.appendChild(errorH1);
    } else {
        const { storyPath, images, links } = fileData;

        // Добавляем блоки во фрагмент
        const infoBlock = createInfoBlock(links, storyPath);
        const tabsBlock = createTabsBlock();
        const imagesBlock = createImagesBlock(storyPath, images);

        fragment.appendChild(infoBlock);
        fragment.appendChild(tabsBlock);
        fragment.appendChild(imagesBlock);
    }

    // Очищаем и заменяем содержимое контейнера одним движением
    container.replaceChildren(fragment);
}

// Создаем блок информации
function createInfoBlock(links, storyPath) {
    // Внешний блок infoBlock
    const infoBlock = document.createElement("div");
    infoBlock.id = "info-block";

    // Внутренний контейнер со стилями
    const linksContainer = document.createElement("div");
    linksContainer.classList.add("links-container");

    // Первый span — комментарий, отображаем storyPath
    const commentSpan = document.createElement("span");
    commentSpan.classList.add("token", "comment");
    // Формируем строку вида: "// Skbkontur / Pages / General / BigBusiness / 1920x1080"
    commentSpan.textContent = "// " + storyPath.join(" / ");
    linksContainer.appendChild(commentSpan);

    // Для каждой ссылки создаём span с классом token
    if (Array.isArray(links) && links.length > 0) {
      links.forEach((link, index) => {
        const tokenSpan = document.createElement("span");
        tokenSpan.classList.add("token");

        // div с классом linkNumber
        const linkNumber = document.createElement("div");
        linkNumber.classList.add("linkNumber");
        linkNumber.textContent = `link_${index + 1} =>`;

        // сама ссылка
        const linkElem = document.createElement("a");
        linkElem.classList.add("link");
        linkElem.href = link;
        linkElem.textContent = link;
        linkElem.target = "_blank";

        tokenSpan.style.display = "flex";
        tokenSpan.style.alignItems = "baseline";
        tokenSpan.appendChild(linkNumber);
        tokenSpan.appendChild(linkElem);

        linksContainer.appendChild(tokenSpan);
      });
    }

    infoBlock.appendChild(linksContainer);
    return infoBlock;
}

// Создаем блок с табами
function createTabsBlock() {
    const container = document.createElement("div");
    container.id = "tabs-block";

    Object.entries(MODES).forEach(([mode, data], index) => {
        // Создаём отдельный таб
        const tab = createTab(mode, data.label, index === 0);
        container.appendChild(tab);
    });

    container.appendChild(createSeparator());

    const buttonsDiv = document.createElement("div");
    buttonsDiv.classList.add("button-container");

    const backButton = createBackButton();
    buttonsDiv.appendChild(backButton);

    const nextButton = createNextButton();
    buttonsDiv.appendChild(nextButton);

    const verifyButton = createVerifyButton();
    buttonsDiv.appendChild(verifyButton);

    container.appendChild(buttonsDiv);

    return container;
}

// Функция создания одного таба

function createTab(mode, label, isChecked) {
    // Создаем div-контейнер для таба
    const radioDiv = document.createElement("div");
    radioDiv.id = "tab-mode-" + mode;
    radioDiv.classList.add("tab-container");

    // Создаем input radio
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "mode";
    radio.id = "mode-" + mode;
    radio.value = mode;
    radio.checked = isChecked;

    // Скрываем нативное оформление
    radio.style.appearance = "none";
    radio.style.opacity = "0";
    radio.style.position = "absolute";

    // Создаем label для визуального отображения таба
    const labelElem = document.createElement("label");
    labelElem.setAttribute("for", "mode-" + mode);
    labelElem.textContent = label;
    labelElem.classList.add("tab-label");

    radioDiv.appendChild(labelElem);
    radioDiv.appendChild(radio);

    return radioDiv;
}

// Создает разделитель
function createSeparator(container) {
    const separator = document.createElement("div");
    separator.classList.add("tabs-separator");

    return separator;
}

// Универсальная функция создания кнопки
function createTabButton(label, onClick) {
    const button = document.createElement("button");
    button.classList.add("tab-button");
    button.textContent = label;
    button.addEventListener("click", onClick);
    return button;
}

function createVerifyButton() {
    return createTabButton("Verify", verifyAndGoToNextFile);
}

function createNextButton() {
    return createTabButton("〉", goToNextFile);
}

function createBackButton() {
    return createTabButton("〈", goToPreviousFile);
}

// Создаем блок с изображениями
function createImagesBlock(storyPath, images) {
    const imagesBlock = document.createElement("div");
    imagesBlock.id = "images-block";

    const imagesContainer = document.createElement("div");
    imagesContainer.id = "images-container";

    const basePath = "images/" + storyPath.join("/");
    const imageOrder = ["actual", "diff", "expect"];
    imageOrder.forEach(type => {
        const wrapperA = document.createElement("a");
        wrapperA.classList.add("image-wrapper");
        wrapperA.id = "image-" + type;

        const img = document.createElement("img");
        img.classList.add("file-image");

        const imgPath = basePath + "/" + images[type];
        img.src = imgPath;
        img.alt = type;

        wrapperA.href = imgPath;
        wrapperA.target = "_blank";

        img.style.border = "1px solid #ccc";

        wrapperA.appendChild(img);
        imagesContainer.appendChild(wrapperA);
    });

    imagesBlock.appendChild(imagesContainer);

    return imagesBlock;
}

// Функция открытия файла в дереве файлов по гуиду
function openFoldersToFile(guid) {
    const folderIds = findFolderPathToFile(guid);

    if (folderIds.length === 0) {
        console.warn(`📁 Путь к файлу с guid "${guid}" не найден в treeStructure`);
        return;
    }

    // Первый requestAnimationFrame для открытия папок
    requestAnimationFrame(() => {
        folderIds.forEach((folderId) => {
            const folderElement = document.getElementById(folderId);
            if (folderElement?.tagName === "DETAILS") {
                if (!folderElement.open) {
                    folderElement.open = true;
                }
            } else {
                console.warn(`📁 Папка с id="${folderId}" не найдена в DOM`);
            }
        });

        // Второй requestAnimationFrame для прокрутки после обновления DOM
        requestAnimationFrame(() => {
            const fileElement = document.querySelector(`[data-guid="${guid}"]`);
            if (fileElement) {
                fileElement.scrollIntoView({
                    block: "center"
                });
            } else {
                console.warn(`📁 Файл с guid="${guid}" найден в treeStructure, но не в DOM`);
            }
        });
    });
}


function findFolderPathToFile(guid) {
    const path = [];

    function traverse(nodes, parents) {
        for (const node of nodes) {
            if (node.type === "file" && node.guid === guid) {
                path.push(...parents); // накопленный путь
                return true;
            }

            if (node.type === "folder" && Array.isArray(node.children)) {
                if (traverse(node.children, [...parents, node.id])) {
                    return true;
                }
            }
        }
        return false;
    }

    traverse(treeStructure, []);
    return path;
}
function initializeFromQuery() {
    const guidFromQuery =  getFileGuidFromQuery();
    ActiveGuidManager.set(guidFromQuery);
    const currentActiveGuid = ActiveGuidManager.get();
  
    if (!currentActiveGuid) {
      console.warn("🔍 В query-параметрах не найден guid");
      return;
    }
  
    if (!siteShotData[currentActiveGuid]) {
        console.warn(`❌ guid "${currentActiveGuid}" не найден в siteShotData`);
        return;
    }
  
    measureTime(() => openFoldersToFile(currentActiveGuid));
    measureTime(() => openFile(currentActiveGuid));
}
  
// ====== 7. Работа с управлением ======

function goToNextFile() {
    const nextGuid = getNextVisibleFileGuid();
    if (!nextGuid) return;

    measureTime(() => openFoldersToFile(nextGuid));
    measureTime(() => openFile(nextGuid));
}

function goToPreviousFile() {
    const prevGuid = getPreviousVisibleFileGuid();
    if (!prevGuid) return;

    measureTime(() => openFoldersToFile(prevGuid));
    measureTime(() => openFile(prevGuid));
}

function verifyAndGoToNextFile() {
    const currentGuid = ActiveGuidManager.get();
    if (!currentGuid) return;

    updateSiteShotDataField(currentGuid, "verify", "verified");
    requestAnimationFrame(() => { updateFileInDOM(currentGuid); });

    const nextGuid = getNextVisibleFileGuid();
    if (!nextGuid) return;

    measureTime(() => openFoldersToFile(nextGuid));
    measureTime(() => openFile(nextGuid));
}

function getNextVisibleFileGuid() {
    return measureTime(() => getVisibleFileGuidOffset(+1));
}

function getPreviousVisibleFileGuid() {
    return measureTime(() => getVisibleFileGuidOffset(-1));
}

function getVisibleFileGuidOffset(offset) {
    const currentGuid = ActiveGuidManager.get();
    const filteredGuids = getOrderedFilteredGuids(); // массив видимых
    const filteredGuidsSet = new Set(filteredGuids);

    if (!currentGuid) {
        if (offset > 0) return filteredGuids[0] || null;
        if (offset < 0) return filteredGuids.at(-1) || null; // или filteredGuids[filteredGuids.length - 1]
        return null;
    }

    const currentIndex = orderedAllGuids.indexOf(currentGuid);
    if (currentIndex === -1) return null;

    let i = currentIndex + offset;
    while (i >= 0 && i < orderedAllGuids.length) {
        const guid = orderedAllGuids[i];
        if (filteredGuidsSet.has(guid)) {
            return guid;
        }
        i += offset;
    }

    return null;
}

function triggerTimedScroll(direction) {
    scrollDirection = direction;
    const startTime = performance.now();

    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }

    function loop(currentTime) {
        const elapsed = currentTime - startTime;
        if (elapsed >= SCROLL_DURATION) return;

        const container = document.getElementById("images-container");
        if (!container) return;

        const distance = (SCROLL_SPEED_PX_PER_SEC / 1000) * elapsed;
        if (scrollDirection === "up") {
            container.scrollTop -= distance;
        } else {
            container.scrollTop += distance;
        }

        scrollAnimationFrame = requestAnimationFrame(loop);
    }

    scrollAnimationFrame = requestAnimationFrame(loop);

    scrollTimeout = setTimeout(() => {
        cancelAnimationFrame(scrollAnimationFrame);
        scrollAnimationFrame = null;
    }, SCROLL_DURATION);
} 

function scrollToTop() {
    const container = document.getElementById("images-container");
    if (!container) return;
    container.scrollTop = 0;
}

function scrollToBottom() {
    const container = document.getElementById("images-container");
    if (!container) return;
    container.scrollTop = container.scrollHeight;
}

  
// ---------------------------------------------------------------
// Создаем элемент для ресайза и настраиваем его работу
// ---------------------------------------------------------------
function setupResizablePanel() {
    const sidebar = document.getElementById("sidebar");
    const content = document.getElementById("content");

    // Создаем resizer
    const resizer = document.createElement("div");
    resizer.id = "resizer";
    const resizerWidth = 12;

    resizer.style.width = resizerWidth + "px";
    resizer.style.marginLeft = -(resizerWidth / 2) + "px";
    resizer.style.marginRight = -(resizerWidth / 2) + "px";
    resizer.style.background = "transparent";
    resizer.style.cursor = "col-resize";
    resizer.style.position = "relative";
    resizer.style.zIndex = "10";

    document.body.appendChild(resizer);

    // Вставляем resizer между sidebar и content
    //sidebar.parentNode.insertBefore(resizer, content);

    let isResizing = false;

    resizer.addEventListener("mousedown", (event) => {
        isResizing = true;
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    });

    function onMouseMove(event) {
        if (!isResizing) return;

        const newWidth = Math.max(150, Math.min(event.clientX, window.innerWidth - 200));
        sidebar.style.width = `${newWidth}px`;
    }

    function onMouseUp() {
        isResizing = false;
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
    }
}