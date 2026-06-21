const PARTS_DB = [
    // Toyota Camry
    { make: "Toyota", model: "Camry", year: "2018-2024", engine: "2.5 бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "04465-33220", brand: "Toyota", inStock: true, note: "Для вентилируемых дисков 300мм" },
    { make: "Toyota", model: "Camry", year: "2018-2024", engine: "2.5 бензин", category: "Тормозная система", name: "Диски тормозные передние", oem: "43512-33210", brand: "Toyota", inStock: true, note: "Вентилируемые 300x28мм" },
    { make: "Toyota", model: "Camry", year: "2018-2024", engine: "2.5 бензин", category: "Фильтры", name: "Масляный фильтр", oem: "04152-YZZA1", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "Camry", year: "2018-2024", engine: "2.5 бензин", category: "Фильтры", name: "Воздушный фильтр двигателя", oem: "17801-31030", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "Camry", year: "2018-2024", engine: "2.5 бензин", category: "Фильтры", name: "Салонный фильтр", oem: "87139-06020", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "Camry", year: "2018-2024", engine: "2.5 бензин", category: "Подвеска", name: "Амортизатор передний", oem: "48510-80597", brand: "Toyota", inStock: false, note: "Под заказ, 5-7 дней" },
    { make: "Toyota", model: "Camry", year: "2018-2024", engine: "2.5 бензин", category: "Подвеска", name: "Сайлентблок переднего рычага", oem: "48068-33200", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "Camry", year: "2018-2024", engine: "2.5 бензин", category: "Масла и жидкости", name: "Масло моторное 5W-30 (4л)", oem: "08880-10805", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "Camry", year: "2018-2024", engine: "3.5 бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "04465-48040", brand: "Toyota", inStock: true, note: "Для вентилируемых дисков 330мм" },
    { make: "Toyota", model: "Camry", year: "2018-2024", engine: "3.5 бензин", category: "Фильтры", name: "Масляный фильтр", oem: "04152-38010", brand: "Toyota", inStock: true },

    // Toyota RAV4
    { make: "Toyota", model: "RAV4", year: "2019-2024", engine: "2.0 бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "04465-42120", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "RAV4", year: "2019-2024", engine: "2.0 бензин", category: "Фильтры", name: "Масляный фильтр", oem: "04152-YZZA1", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "RAV4", year: "2019-2024", engine: "2.5 гибрид", category: "Фильтры", name: "Воздушный фильтр двигателя", oem: "17801-27030", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "RAV4", year: "2019-2024", engine: "2.5 гибрид", category: "Тормозная система", name: "Колодки тормозные задние", oem: "04466-42200", brand: "Toyota", inStock: true },

    // BMW 3 Series
    { make: "BMW", model: "3 Series (G20)", year: "2019-2024", engine: "2.0 бензин (320i)", category: "Тормозная система", name: "Колодки тормозные передние", oem: "34116892745", brand: "Textar", inStock: true, note: "Оригинал BMW / аналог Textar" },
    { make: "BMW", model: "3 Series (G20)", year: "2019-2024", engine: "2.0 бензин (320i)", category: "Фильтры", name: "Масляный фильтр", oem: "11428507683", brand: "BMW", inStock: true },
    { make: "BMW", model: "3 Series (G20)", year: "2019-2024", engine: "2.0 бензин (320i)", category: "Фильтры", name: "Салонный фильтр (угольный)", oem: "64319361503", brand: "BMW", inStock: true },
    { make: "BMW", model: "3 Series (G20)", year: "2019-2024", engine: "2.0 дизель (320d)", category: "Тормозная система", name: "Диски тормозные передние", oem: "34116892746", brand: "BMW", inStock: true, note: "Вентилируемые 330x24мм" },
    { make: "BMW", model: "3 Series (G20)", year: "2019-2024", engine: "2.0 дизель (320d)", category: "Фильтры", name: "Масляный фильтр", oem: "11428507683", brand: "BMW", inStock: true },

    // BMW X5
    { make: "BMW", model: "X5 (G05)", year: "2019-2024", engine: "3.0 бензин (xDrive40i)", category: "Тормозная система", name: "Колодки тормозные передние", oem: "34116879240", brand: "Textar", inStock: true },
    { make: "BMW", model: "X5 (G05)", year: "2019-2024", engine: "3.0 бензин (xDrive40i)", category: "Фильтры", name: "Воздушный фильтр двигателя", oem: "13717863044", brand: "BMW", inStock: true },
    { make: "BMW", model: "X5 (G05)", year: "2019-2024", engine: "3.0 дизель (xDrive30d)", category: "Тормозная система", name: "Колодки тормозные передние", oem: "34116879240", brand: "Textar", inStock: true },

    // Mercedes-Benz C-Class
    { make: "Mercedes", model: "C-Class (W206)", year: "2021-2024", engine: "1.5 бензин (C200)", category: "Тормозная система", name: "Колодки тормозные передние", oem: "0004200204", brand: "Mercedes-Benz", inStock: true },
    { make: "Mercedes", model: "C-Class (W206)", year: "2021-2024", engine: "1.5 бензин (C200)", category: "Фильтры", name: "Масляный фильтр", oem: "0001801109", brand: "Mercedes-Benz", inStock: true },
    { make: "Mercedes", model: "C-Class (W206)", year: "2021-2024", engine: "1.5 бензин (C200)", category: "Фильтры", name: "Салонный фильтр", oem: "0008305200", brand: "MANN-FILTER", inStock: true },

    // Mercedes E-Class
    { make: "Mercedes", model: "E-Class (W214)", year: "2023-2024", engine: "2.0 бензин (E200)", category: "Тормозная система", name: "Диски тормозные передние", oem: "0004215100", brand: "Mercedes-Benz", inStock: false, note: "Под заказ, 3-5 дней" },
    { make: "Mercedes", model: "E-Class (W214)", year: "2023-2024", engine: "2.0 дизель (E220d)", category: "Фильтры", name: "Масляный фильтр", oem: "0001801109", brand: "Mercedes-Benz", inStock: true },

    // VW Passat
    { make: "Volkswagen", model: "Passat B8", year: "2015-2023", engine: "2.0 TSI бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "5Q0698151F", brand: "Textar", inStock: true },
    { make: "Volkswagen", model: "Passat B8", year: "2015-2023", engine: "2.0 TSI бензин", category: "Фильтры", name: "Масляный фильтр", oem: "06J115403Q", brand: "VAG", inStock: true },
    { make: "Volkswagen", model: "Passat B8", year: "2015-2023", engine: "2.0 TSI бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "5Q0129620B", brand: "VAG", inStock: true },
    { make: "Volkswagen", model: "Passat B8", year: "2015-2023", engine: "2.0 TDI дизель", category: "Фильтры", name: "Масляный фильтр", oem: "04L115466K", brand: "VAG", inStock: true },
    { make: "Volkswagen", model: "Passat B8", year: "2015-2023", engine: "2.0 TDI дизель", category: "Фильтры", name: "Топливный фильтр", oem: "5Q0127177A", brand: "VAG", inStock: true },

    // VW Tiguan
    { make: "Volkswagen", model: "Tiguan II", year: "2016-2024", engine: "2.0 TSI бензин", category: "Тормозная система", name: "Колодки тормозные задние", oem: "5Q0698451G", brand: "Textar", inStock: true },
    { make: "Volkswagen", model: "Tiguan II", year: "2016-2024", engine: "2.0 TSI бензин", category: "Подвеска", name: "Амортизатор передний", oem: "5Q0413031DP", brand: "Sachs", inStock: true },

    // Hyundai Sonata
    { make: "Hyundai", model: "Sonata (DN8)", year: "2020-2024", engine: "2.0 бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "58101-L5A10", brand: "Hyundai", inStock: true },
    { make: "Hyundai", model: "Sonata (DN8)", year: "2020-2024", engine: "2.0 бензин", category: "Фильтры", name: "Масляный фильтр", oem: "26300-35530", brand: "Hyundai", inStock: true },
    { make: "Hyundai", model: "Sonata (DN8)", year: "2020-2024", engine: "1.6 T-GDI бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "28113-L1000", brand: "Hyundai", inStock: true },

    // Hyundai Tucson
    { make: "Hyundai", model: "Tucson (NX4)", year: "2021-2024", engine: "2.0 бензин", category: "Фильтры", name: "Масляный фильтр", oem: "26300-35530", brand: "Hyundai", inStock: true },
    { make: "Hyundai", model: "Tucson (NX4)", year: "2021-2024", engine: "1.6 T-GDI бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "58101-N9000", brand: "Hyundai", inStock: true },

    // Kia K5 / Optima
    { make: "Kia", model: "K5 (DL3)", year: "2020-2024", engine: "2.0 бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "58101-L5A10", brand: "Kia", inStock: true },
    { make: "Kia", model: "K5 (DL3)", year: "2020-2024", engine: "2.0 бензин", category: "Фильтры", name: "Масляный фильтр", oem: "26300-35530", brand: "Kia", inStock: true },
    { make: "Kia", model: "K5 (DL3)", year: "2020-2024", engine: "2.5 бензин", category: "Тормозная система", name: "Диски тормозные передние", oem: "51712-L2000", brand: "Kia", inStock: true },

    // Kia Sportage
    { make: "Kia", model: "Sportage (NQ5)", year: "2022-2024", engine: "2.0 бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "28113-L1000", brand: "Kia", inStock: true },
    { make: "Kia", model: "Sportage (NQ5)", year: "2022-2024", engine: "1.6 T-GDI бензин", category: "Фильтры", name: "Масляный фильтр", oem: "26300-35530", brand: "Kia", inStock: true },

    // Ford Focus
    { make: "Ford", model: "Focus IV", year: "2018-2024", engine: "1.5 EcoBoost бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "2181763", brand: "Ford", inStock: true },
    { make: "Ford", model: "Focus IV", year: "2018-2024", engine: "1.5 EcoBoost бензин", category: "Фильтры", name: "Масляный фильтр", oem: "1896233", brand: "Ford", inStock: true },
    { make: "Ford", model: "Focus IV", year: "2018-2024", engine: "1.5 TDCi дизель", category: "Фильтры", name: "Масляный фильтр", oem: "1884857", brand: "Ford", inStock: true },

    // Ford Kuga
    { make: "Ford", model: "Kuga III", year: "2021-2024", engine: "2.5 бензин гибрид", category: "Фильтры", name: "Салонный фильтр", oem: "2423337", brand: "Ford", inStock: true },

    // Skoda Octavia
    { make: "Skoda", model: "Octavia A8", year: "2020-2024", engine: "1.4 TSI бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "5Q0698151F", brand: "Textar", inStock: true },
    { make: "Skoda", model: "Octavia A8", year: "2020-2024", engine: "1.4 TSI бензин", category: "Фильтры", name: "Масляный фильтр", oem: "06J115403Q", brand: "VAG", inStock: true },
    { make: "Skoda", model: "Octavia A8", year: "2020-2024", engine: "2.0 TSI бензин", category: "Тормозная система", name: "Диски тормозные передние", oem: "5Q0615301AK", brand: "VAG", inStock: true, note: "Вентилируемые 312x25мм" },
    { make: "Skoda", model: "Octavia A8", year: "2020-2024", engine: "2.0 TDI дизель", category: "Фильтры", name: "Топливный фильтр", oem: "5Q0127177A", brand: "VAG", inStock: true },

    // Audi A4
    { make: "Audi", model: "A4 (B9)", year: "2016-2024", engine: "2.0 TFSI бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "8W0698151F", brand: "Textar", inStock: true },
    { make: "Audi", model: "A4 (B9)", year: "2016-2024", engine: "2.0 TFSI бензин", category: "Фильтры", name: "Масляный фильтр", oem: "06J115403Q", brand: "VAG", inStock: true },
    { make: "Audi", model: "A4 (B9)", year: "2016-2024", engine: "2.0 TDI дизель", category: "Фильтры", name: "Масляный фильтр", oem: "04L115466K", brand: "VAG", inStock: true },

    // Audi Q5
    { make: "Audi", model: "Q5 (80A)", year: "2018-2024", engine: "2.0 TFSI бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "80A698151F", brand: "Textar", inStock: true },
    { make: "Audi", model: "Q5 (80A)", year: "2018-2024", engine: "2.0 TFSI бензин", category: "Подвеска", name: "Амортизатор передний", oem: "80A413031B", brand: "Sachs", inStock: false, note: "Под заказ, 7-10 дней" },

    // Renault Duster
    { make: "Renault", model: "Duster II", year: "2021-2024", engine: "1.3 TCe бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "41060-6483R", brand: "Renault", inStock: true },
    { make: "Renault", model: "Duster II", year: "2021-2024", engine: "1.3 TCe бензин", category: "Фильтры", name: "Масляный фильтр", oem: "15208-6500R", brand: "Renault", inStock: true },

    // Lada Vesta
    { make: "Lada", model: "Vesta", year: "2015-2024", engine: "1.6 16V бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "21110-3501080", brand: "Lada", inStock: true, note: "Оригинал Lada / аналог ATE" },
    { make: "Lada", model: "Vesta", year: "2015-2024", engine: "1.6 16V бензин", category: "Фильтры", name: "Масляный фильтр", oem: "21080-1012005", brand: "Lada", inStock: true },
    { make: "Lada", model: "Vesta", year: "2015-2024", engine: "1.6 16V бензин", category: "Фильтры", name: "Воздушный фильтр двигателя", oem: "21129-1109080", brand: "Lada", inStock: true },
    { make: "Lada", model: "Vesta", year: "2015-2024", engine: "1.8 бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "21110-3501080", brand: "Lada", inStock: true },

    // Lada Granta
    { make: "Lada", model: "Granta", year: "2011-2024", engine: "1.6 8V бензин", category: "Фильтры", name: "Масляный фильтр", oem: "21080-1012005", brand: "Lada", inStock: true },
    { make: "Lada", model: "Granta", year: "2011-2024", engine: "1.6 8V бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "21080-3501080", brand: "Lada", inStock: true },

    // Nissan Qashqai
    { make: "Nissan", model: "Qashqai J12", year: "2021-2024", engine: "1.3 DIG-T бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "D1060-JP00C", brand: "Nissan", inStock: true },
    { make: "Nissan", model: "Qashqai J12", year: "2021-2024", engine: "1.3 DIG-T бензин", category: "Фильтры", name: "Масляный фильтр", oem: "15208-6500R", brand: "Nissan", inStock: true },

    // Nissan X-Trail
    { make: "Nissan", model: "X-Trail T33", year: "2022-2024", engine: "2.0 бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "16546-4BC0A", brand: "Nissan", inStock: true },

    // Mazda CX-5
    { make: "Mazda", model: "CX-5 (KF)", year: "2017-2024", engine: "2.0 SkyActiv бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "KDY0-26-38Z", brand: "Mazda", inStock: true },
    { make: "Mazda", model: "CX-5 (KF)", year: "2017-2024", engine: "2.0 SkyActiv бензин", category: "Фильтры", name: "Масляный фильтр", oem: "WLY7-14-302", brand: "Mazda", inStock: true },
    { make: "Mazda", model: "CX-5 (KF)", year: "2017-2024", engine: "2.5 SkyActiv бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "KDY0-13-Z40", brand: "Mazda", inStock: true },

    // Mazda 6
    { make: "Mazda", model: "Mazda6 (GJ)", year: "2013-2024", engine: "2.0 SkyActiv бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "GJYA-26-38Z", brand: "Mazda", inStock: true },

    // Universal parts (across many cars)
    { make: "Universal", model: "Универсальные", year: "—", engine: "—", category: "Масла и жидкости", name: "Антифриз красный (G12) 5л", oem: "81114-AA240", brand: "Motul", inStock: true },
    { make: "Universal", model: "Универсальные", year: "—", engine: "—", category: "Масла и жидкости", name: "Масло ATF Dexron VI 1л", oem: "ATF-D6-1L", brand: "Mobil", inStock: true },
    { make: "Universal", model: "Универсальные", year: "—", engine: "—", category: "Электрика", name: "Свеча зажигания", oem: "FR7KII33X", brand: "NGK", inStock: true, note: "Подходит для Toyota, BMW, Mazda" },
    { make: "Universal", model: "Универсальные", year: "—", engine: "—", category: "Электрика", name: "Аккумулятор 60Ah", oem: "60044-К", brand: "Varta", inStock: true },
    { make: "Universal", model: "Универсальные", year: "—", engine: "—", category: "Электрика", name: "Аккумулятор 75Ah", oem: "75022-К", brand: "Bosch", inStock: false, note: "Под заказ, 2-3 дня" },
    { make: "Universal", model: "Универсальные", year: "—", engine: "—", category: "Кузов", name: "Щетки стеклоочистителя 26+16", oem: "WW-2616", brand: "Bosch", inStock: true, note: "Комплект передних дворников" },
];

// Extract unique values for filters
function getUniqueMakes() {
    return [...new Set(PARTS_DB.map(p => p.make))].sort();
}

function getModelsByMake(make) {
    const models = PARTS_DB.filter(p => p.make === make).map(p => p.model);
    return [...new Set(models)].sort();
}

function getCategoriesByMakeModel(make, model) {
    const cats = PARTS_DB.filter(p => p.make === make && p.model === model).map(p => p.category);
    return [...new Set(cats)].sort();
}

function filterPartsData(make, model, category, text) {
    let result = [...PARTS_DB];
    if (make) result = result.filter(p => p.make === make);
    if (model) result = result.filter(p => p.model === model);
    if (category) result = result.filter(p => p.category === category);
    if (text) {
        const t = text.toLowerCase();
        result = result.filter(p =>
            p.name.toLowerCase().includes(t) ||
            p.oem.toLowerCase().includes(t) ||
            p.brand.toLowerCase().includes(t)
        );
    }
    return result;
}

// AI Consultant Logic
function findPartsForCar(make, model, year, engine, partQuery) {
    let candidates = PARTS_DB.filter(p => {
        const makeMatch = p.make.toLowerCase() === make.toLowerCase() || p.make === "Universal";
        let modelMatch = false;
        if (p.make === "Universal") modelMatch = true;
        else modelMatch = p.model.toLowerCase().includes(model.toLowerCase());
        const query = partQuery.toLowerCase();
        const nameMatch = p.name.toLowerCase().includes(query);
        const categoryMatch = p.category.toLowerCase().includes(query);
        const oemMatch = p.oem.toLowerCase().includes(query);
        return makeMatch && modelMatch && (nameMatch || categoryMatch || oemMatch);
    });

    // If no results, try broader search
    if (candidates.length === 0) {
        candidates = PARTS_DB.filter(p => {
            const query = partQuery.toLowerCase();
            return p.name.toLowerCase().includes(query) ||
                   p.category.toLowerCase().includes(query) ||
                   p.oem.toLowerCase().includes(query);
        }).slice(0, 5);
    }

    return candidates.slice(0, 5);
}

// ==========================================
// 🔗 ПАРТНЁРСКИЕ МАГАЗИНЫ (настрой под себя)
// ==========================================
// После подтверждения в Takprodam (Admitad):
// 1. Замени campaignId на полученные ID для каждого оффера
// 2. Замени erid на токены из ОРД (или получи через Admitad)
// 3. Если ссылка не работает — поправь urlTemplate под формат магазина
// Примечание: advertiser нужно уточнить в партнёрской программе

const STORES = [
  {
    name: "Exist.ru",
    urlTemplate: "https://www.exist.ru/pages/?pid=SEARCH&search={OEM}",
    campaignId: "ЗАМЕНИТЬ_НА_ID_ИЗ_TAKPRODAM",
    type: "takprodam",
    color: "#007bff",
    icon: "fa-solid fa-cart-shopping",
    network: "Takprodam (Admitad) ~2.1%",
    erid: "",
    advertiser: "ООО «Экзист»"
  },
  {
    name: "Rossko.ru",
    urlTemplate: "https://rossko.ru/search?q={OEM}",
    campaignId: "ЗАМЕНИТЬ_НА_ID_ИЗ_TAKPRODAM",
    type: "takprodam",
    color: "#28a745",
    icon: "fa-solid fa-truck",
    network: "Takprodam (Admitad)",
    erid: "",
    advertiser: "ООО «Росско»"
  },
  {
    name: "Autopiter.ru",
    urlTemplate: "https://autopiter.ru/search?q={OEM}",
    campaignId: "ЗАМЕНИТЬ_НА_ID_ИЗ_TAKPRODAM",
    type: "takprodam",
    color: "#dc3545",
    icon: "fa-solid fa-gear",
    network: "Takprodam (Admitad) ~4%",
    erid: "",
    advertiser: "ООО «Автопитер»"
  },
  {
    name: "AvtoALL.ru",
    urlTemplate: "https://avtoall.ru/search/?text={OEM}",
    campaignId: "ЗАМЕНИТЬ_НА_ID_ИЗ_TAKPRODAM",
    type: "takprodam",
    color: "#6f42c1",
    icon: "fa-solid fa-wrench",
    network: "Takprodam (Admitad) ~3.5%",
    erid: "",
    advertiser: "ООО «АвтоВсе»"
  }
];

function getStoreLinks(oem) {
  return STORES.map(s => {
    const directUrl = s.urlTemplate.replace('{OEM}', oem);
    const isConfigured = s.campaignId && !s.campaignId.startsWith('ЗАМЕНИТЬ');
    if (!isConfigured) {
      return { ...s, fullUrl: directUrl };
    }
    return {
      ...s,
      fullUrl: `https://ad.admitad.com/g/${s.campaignId}/?ulp=${encodeURIComponent(directUrl)}`
    };
  });
}

function trackClick(storeName, oem) {
  if (localStorage.getItem('ap_cookies_accepted') !== 'true') return;
  let clicks = JSON.parse(localStorage.getItem('ap_clicks') || '[]');
  clicks.push({ store: storeName, oem, date: new Date().toISOString() });
  localStorage.setItem('ap_clicks', JSON.stringify(clicks));
}

function getTotalClicks() {
  const clicks = JSON.parse(localStorage.getItem('ap_clicks') || '[]');
  return clicks.length;
}

// Also make ChatGPT-compatible system prompt
const SYSTEM_PROMPT = `Ты — профессиональный ИИ-консультант интернет-магазина автозапчастей. Твоя задача — помочь найти оригинальный OEM-артикул детали.

Алгоритм:
1. Спроси марку, модель, год выпуска и двигатель авто
2. Уточни, какая деталь нужна
3. Выдай результат по шаблону:
   📋 Результаты для [Марка Модель, Год, Двигатель]:
   Категория: [категория]
   • [Название детали] — OEM: [номер] — [Производитель] — [Статус]

Правила:
- Выделяй OEM-номера моноширинным шрифтом
- Предлагай 2-3 варианта (оригинал и аналоги)
- Если не уверен — рекоменлуй проверку по VIN`;
