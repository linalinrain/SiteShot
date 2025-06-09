

// --------------------

const FILTER_CATEGORIES = [
    { name: "Result", values: ["error", "failed", "success"] },
    { name: "Skip", values: ["skipped", "unskipped"] },
    { name: "View",   values: ["viewed", "unviewed"] },
    { name: "Verify", values: ["verified", "unverified"] }
  ];

// Функция добавления/обновления CSS в <head>
function updateStyles(mode, modes) {
    const css = generateCSS(mode, modes);
    const styleId = "mode-style-" + mode;
    let styleElem = document.getElementById(styleId);

    if (!styleElem) {
        styleElem = document.createElement("style");
        styleElem.id = styleId;
        document.head.appendChild(styleElem);
    }
    
    styleElem.innerHTML = css;
}

// Функция для генерации всех возможных подмножеств группы (кроме пустого)
function getAllCombinations(arr) {
    const result = [];

    const generate = (subset, index) => {
        if (index === arr.length) {
            if (subset.length > 0) result.push(subset.join("-"));
            return;
        }
        generate(subset, index + 1); // Без текущего элемента
        generate([...subset, arr[index]], index + 1); // С текущим элементом
    };

    generate([], 0);
    return result;
}

// Функция для получения всех комбинаций по категориям
function getCategoryCombinations(categories) {
    return categories.map(category => getAllCombinations(category.values));
}

// Функция для генерации всех возможных вариантов сочетаний
function generateAllVariants(categories) {
    const categoryCombinations = getCategoryCombinations(categories);
    const allVariants = [];

    categoryCombinations[0].forEach(c1 => {
        categoryCombinations[1].forEach(c2 => {
            categoryCombinations[2].forEach(c3 => {
                categoryCombinations[3].forEach(c4 => {
                    allVariants.push(`${c1}-${c2}-${c3}-${c4}`);
                });
            });
        });
    });

    return allVariants;
}

// Функция для разделения строки селектора
function splitVariant(variant) {
    return variant.split("-");
}

// Функция для генерации строки селектора
function generateFilterSelector(selectedValues) {
    const allValues = FILTER_CATEGORIES.flatMap(category => category.values); // Все возможные значения

    // Формируем строку с :has() для выбранных значений
    const hasSelectors = selectedValues.map(value => `:has(#filter-${value}:checked)`).join("");

    // Определяем значения, которых НЕТ в `selectedValues`
    const notSelectedValues = allValues.filter(value => !selectedValues.includes(value));

    // Формируем строку с :has(...:not(:checked)) для отсутствующих значений
    const notHasSelectors = notSelectedValues.map(value => `:has(#filter-${value}:not(:checked))`).join("");

    // Объединяем части в единую строку
    return `${hasSelectors}${notHasSelectors}`;
}

// Функция для разбиения массива на категории
function splitIntoCategories(selectedValues) {
    const results = [];
    const skip = [];
    const views = [];
    const verifies = [];

    selectedValues.forEach(value => {
        if (FILTER_CATEGORIES[0].values.includes(value)) {
            results.push(value);
        } else if (FILTER_CATEGORIES[1].values.includes(value)) {
            skip.push(value);
        } else if (FILTER_CATEGORIES[2].values.includes(value)) {
            views.push(value);
        } else if (FILTER_CATEGORIES[3].values.includes(value)) {
            verifies.push(value);
        }
    });

    return { results, skip, views, verifies };
}

function generateSelectorString({ results, skip, views, verifies }) {
    const matchingFolderSelectors = [];
    const matchingFileSelectors = [];

    results.forEach(r => {
        skip.forEach(s => {
            views.forEach(v => {
                verifies.forEach(z => {
                    const statusSelector = `.result-${r}.skip-${s}.view-${v}.verify-${z}`;
                    matchingFolderSelectors.push(`.file${statusSelector}`);
                    matchingFileSelectors.push(statusSelector);
                });
            });
        });
    });

    const folderRuleSelector = `#file-tree details.folder:not(:has(${matchingFolderSelectors.join(", ")}))`;
    const fileRuleSelector = `#file-tree .file:not(${matchingFileSelectors.join(", ")})`;

    return { folderRuleSelector, fileRuleSelector };
}

function generateAllSelectors() {
    const allVariants = generateAllVariants(FILTER_CATEGORIES);
    const cssCheckboxRules = [];

    allVariants.forEach(variant => {
        const splitValues = splitVariant(variant); // Разбиваем вариант по "-"

        const filterSelector = generateFilterSelector(splitValues); // Получаем селектор
        const categoryData = splitIntoCategories(splitValues); // Разбиваем на категории
        const { folderRuleSelector, fileRuleSelector } = generateSelectorString(categoryData); // Получаем селекторы

        // Формируем строки
        const checkboxFolderRuleSelector = `#sidebar${filterSelector} ${folderRuleSelector}`;
        const checkboxFileRuleSelector = `#sidebar${filterSelector} ${fileRuleSelector}`;
        const cssChecboxRuleSelector = `${checkboxFolderRuleSelector}, ${checkboxFileRuleSelector} { display: none !important; }`;

        // Добавляем в итоговый массив CSS-правил с идентификатором
        cssCheckboxRules.push({ rule: cssChecboxRuleSelector, id: `filter-style-${variant}` });
    });

    return cssCheckboxRules;
}

function applyCategoryFilterRules() {
    // 1. Создаём массив для хранения CSS-правил
    const cssRules = [];

    // 2. Генерируем селекторы для каждой группы
    FILTER_CATEGORIES.forEach(category => {
        const notCheckedSelectors = category.values.map(value => `:has(#filter-${value}:not(:checked))`).join("");
        const rule = `#sidebar${notCheckedSelectors} #file-tree * { display: none !important; }`;
        cssRules.push(rule);
    });

    // 3. Объединяем правила в один CSS-код
    const cssContent = cssRules.join("\n");

    // 4. Проверяем, есть ли уже стиль с таким id
    let categoryStyleElem = document.getElementById("category-filter-style");

    if (!categoryStyleElem) {
        // Создаем новый <style>
        categoryStyleElem = document.createElement("style");
        //categoryStyleElem.id = "category-filter-style";
        document.head.appendChild(categoryStyleElem);
    }

    // 5. Записываем CSS-правила в <style>
    categoryStyleElem.innerHTML = cssContent;
}

function applyFilterStyles() {
    // 1. Генерируем CSS-правила
    const cssCheckboxRules = generateAllSelectors();

    // 2. Удаляем старые теги <style>, если они уже есть
    document.querySelectorAll("[id^='filter-style-']").forEach(styleElem => {
        styleElem.remove();
    });

    // 3. Добавляем новый <style> для каждого правила
    cssCheckboxRules.forEach(({ rule, id }) => {
        const styleElem = document.createElement("style");
        //styleElem.id = id; // Устанавливаем ID по фильтру
        styleElem.innerHTML = rule;
        document.head.appendChild(styleElem);
    });

    // 4. Добавляем стили для негативных кейсов
    applyCategoryFilterRules()
}