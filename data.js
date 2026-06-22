const PARTS_DB = [
    // ========== TOYOTA ==========
    // Camry
    { make: "Toyota", model: "Camry", year: "2018-2024", engine: "2.5 бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "04465-33220", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "Camry", year: "2018-2024", engine: "2.5 бензин", category: "Тормозная система", name: "Колодки тормозные задние", oem: "04466-33210", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "Camry", year: "2018-2024", engine: "2.5 бензин", category: "Тормозная система", name: "Диски тормозные передние", oem: "43512-33210", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "Camry", year: "2018-2024", engine: "2.5 бензин", category: "Тормозная система", name: "Диски тормозные задние", oem: "43512-33220", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "Camry", year: "2018-2024", engine: "2.5 бензин", category: "Фильтры", name: "Масляный фильтр", oem: "04152-YZZA1", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "Camry", year: "2018-2024", engine: "2.5 бензин", category: "Фильтры", name: "Воздушный фильтр двигателя", oem: "17801-31030", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "Camry", year: "2018-2024", engine: "2.5 бензин", category: "Фильтры", name: "Салонный фильтр", oem: "87139-06020", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "Camry", year: "2018-2024", engine: "2.5 бензин", category: "Подвеска", name: "Амортизатор передний", oem: "48510-80597", brand: "Toyota", inStock: false },
    { make: "Toyota", model: "Camry", year: "2018-2024", engine: "2.5 бензин", category: "Подвеска", name: "Амортизатор задний", oem: "48530-80594", brand: "Toyota", inStock: false },
    { make: "Toyota", model: "Camry", year: "2018-2024", engine: "2.5 бензин", category: "Подвеска", name: "Сайлентблок переднего рычага", oem: "48068-33200", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "Camry", year: "2018-2024", engine: "2.5 бензин", category: "Подвеска", name: "Стойка стабилизатора передняя", oem: "48820-33250", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "Camry", year: "2018-2024", engine: "2.5 бензин", category: "Электрика", name: "Свечи зажигания (комплект)", oem: "90919-01276", brand: "NGK", inStock: true },
    { make: "Toyota", model: "Camry", year: "2018-2024", engine: "2.5 бензин", category: "Охлаждение", name: "Помпа водяная", oem: "16100-39405", brand: "Aisin", inStock: true },
    { make: "Toyota", model: "Camry", year: "2018-2024", engine: "2.5 бензин", category: "Охлаждение", name: "Термостат", oem: "90916-03124", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "Camry", year: "2018-2024", engine: "2.5 бензин", category: "Масла и жидкости", name: "Масло моторное 5W-30 (4л)", oem: "08880-10805", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "Camry", year: "2018-2024", engine: "2.5 бензин", category: "Масла и жидкости", name: "Масло моторное 0W-20 (4л)", oem: "08880-12505", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "Camry", year: "2018-2024", engine: "2.5 бензин", category: "Привод", name: "Ремень генератора", oem: "90916-02600", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "Camry", year: "2018-2024", engine: "3.5 бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "04465-48040", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "Camry", year: "2018-2024", engine: "3.5 бензин", category: "Фильтры", name: "Масляный фильтр", oem: "04152-38010", brand: "Toyota", inStock: true },

    // RAV4
    { make: "Toyota", model: "RAV4", year: "2019-2024", engine: "2.0 бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "04465-42120", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "RAV4", year: "2019-2024", engine: "2.0 бензин", category: "Тормозная система", name: "Колодки тормозные задние", oem: "04466-42200", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "RAV4", year: "2019-2024", engine: "2.0 бензин", category: "Фильтры", name: "Масляный фильтр", oem: "04152-YZZA1", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "RAV4", year: "2019-2024", engine: "2.0 бензин", category: "Фильтры", name: "Воздушный фильтр двигателя", oem: "17801-27030", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "RAV4", year: "2019-2024", engine: "2.0 бензин", category: "Фильтры", name: "Салонный фильтр", oem: "87139-42450", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "RAV4", year: "2019-2024", engine: "2.0 бензин", category: "Подвеска", name: "Амортизатор передний", oem: "48510-80471", brand: "Toyota", inStock: false },
    { make: "Toyota", model: "RAV4", year: "2019-2024", engine: "2.0 бензин", category: "Электрика", name: "Свечи зажигания (комплект)", oem: "90919-01276", brand: "NGK", inStock: true },
    { make: "Toyota", model: "RAV4", year: "2019-2024", engine: "2.5 гибрид", category: "Фильтры", name: "Воздушный фильтр двигателя", oem: "17801-27030", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "RAV4", year: "2019-2024", engine: "2.5 гибрид", category: "Тормозная система", name: "Колодки тормозные задние", oem: "04466-42200", brand: "Toyota", inStock: true },

    // Corolla
    { make: "Toyota", model: "Corolla (E210)", year: "2019-2024", engine: "1.6 бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "04465-02460", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "Corolla (E210)", year: "2019-2024", engine: "1.6 бензин", category: "Тормозная система", name: "Диски тормозные передние", oem: "43512-02280", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "Corolla (E210)", year: "2019-2024", engine: "1.6 бензин", category: "Фильтры", name: "Масляный фильтр", oem: "04152-YZZA1", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "Corolla (E210)", year: "2019-2024", engine: "1.6 бензин", category: "Фильтры", name: "Воздушный фильтр двигателя", oem: "17801-02150", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "Corolla (E210)", year: "2019-2024", engine: "1.6 бензин", category: "Фильтры", name: "Салонный фильтр", oem: "87139-02120", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "Corolla (E210)", year: "2019-2024", engine: "1.6 бензин", category: "Электрика", name: "Свечи зажигания (комплект)", oem: "90919-01267", brand: "NGK", inStock: true },
    { make: "Toyota", model: "Corolla (E210)", year: "2019-2024", engine: "1.2T бензин", category: "Фильтры", name: "Масляный фильтр", oem: "04152-38010", brand: "Toyota", inStock: true },

    // ========== BMW ==========
    // 3 Series
    { make: "BMW", model: "3 Series (G20)", year: "2019-2024", engine: "2.0 бензин (320i)", category: "Тормозная система", name: "Колодки тормозные передние", oem: "34116892745", brand: "Textar", inStock: true },
    { make: "BMW", model: "3 Series (G20)", year: "2019-2024", engine: "2.0 бензин (320i)", category: "Тормозная система", name: "Колодки тормозные задние", oem: "34116892747", brand: "Textar", inStock: true },
    { make: "BMW", model: "3 Series (G20)", year: "2019-2024", engine: "2.0 бензин (320i)", category: "Тормозная система", name: "Диски тормозные передние", oem: "34116892746", brand: "BMW", inStock: true },
    { make: "BMW", model: "3 Series (G20)", year: "2019-2024", engine: "2.0 бензин (320i)", category: "Фильтры", name: "Масляный фильтр", oem: "11428507683", brand: "BMW", inStock: true },
    { make: "BMW", model: "3 Series (G20)", year: "2019-2024", engine: "2.0 бензин (320i)", category: "Фильтры", name: "Воздушный фильтр двигателя", oem: "13718604229", brand: "BMW", inStock: true },
    { make: "BMW", model: "3 Series (G20)", year: "2019-2024", engine: "2.0 бензин (320i)", category: "Фильтры", name: "Салонный фильтр (угольный)", oem: "64319361503", brand: "BMW", inStock: true },
    { make: "BMW", model: "3 Series (G20)", year: "2019-2024", engine: "2.0 бензин (320i)", category: "Подвеска", name: "Амортизатор передний", oem: "31316892745", brand: "Sachs", inStock: false },
    { make: "BMW", model: "3 Series (G20)", year: "2019-2024", engine: "2.0 бензин (320i)", category: "Подвеска", name: "Стойка стабилизатора передняя", oem: "31356861821", brand: "BMW", inStock: true },
    { make: "BMW", model: "3 Series (G20)", year: "2019-2024", engine: "2.0 бензин (320i)", category: "Электрика", name: "Свечи зажигания (комплект)", oem: "12218648939", brand: "NGK", inStock: true },
    { make: "BMW", model: "3 Series (G20)", year: "2019-2024", engine: "2.0 бензин (320i)", category: "Охлаждение", name: "Термостат", oem: "11538634549", brand: "Mahle", inStock: true },
    { make: "BMW", model: "3 Series (G20)", year: "2019-2024", engine: "2.0 дизель (320d)", category: "Тормозная система", name: "Диски тормозные передние", oem: "34116892746", brand: "BMW", inStock: true },
    { make: "BMW", model: "3 Series (G20)", year: "2019-2024", engine: "2.0 дизель (320d)", category: "Фильтры", name: "Масляный фильтр", oem: "11428507683", brand: "BMW", inStock: true },

    // 5 Series
    { make: "BMW", model: "5 Series (G30)", year: "2017-2023", engine: "2.0 бензин (530i)", category: "Тормозная система", name: "Колодки тормозные передние", oem: "34116879240", brand: "Textar", inStock: true },
    { make: "BMW", model: "5 Series (G30)", year: "2017-2023", engine: "2.0 бензин (530i)", category: "Тормозная система", name: "Колодки тормозные задние", oem: "34116879241", brand: "Textar", inStock: true },
    { make: "BMW", model: "5 Series (G30)", year: "2017-2023", engine: "2.0 бензин (530i)", category: "Фильтры", name: "Масляный фильтр", oem: "11428507683", brand: "BMW", inStock: true },
    { make: "BMW", model: "5 Series (G30)", year: "2017-2023", engine: "2.0 бензин (530i)", category: "Фильтры", name: "Воздушный фильтр двигателя", oem: "13718604229", brand: "BMW", inStock: true },
    { make: "BMW", model: "5 Series (G30)", year: "2017-2023", engine: "2.0 бензин (530i)", category: "Фильтры", name: "Салонный фильтр (угольный)", oem: "64319361503", brand: "BMW", inStock: true },
    { make: "BMW", model: "5 Series (G30)", year: "2017-2023", engine: "3.0 дизель (530d)", category: "Тормозная система", name: "Колодки тормозные передние", oem: "34116879240", brand: "Textar", inStock: true },

    // X5
    { make: "BMW", model: "X5 (G05)", year: "2019-2024", engine: "3.0 бензин (xDrive40i)", category: "Тормозная система", name: "Колодки тормозные передние", oem: "34116879240", brand: "Textar", inStock: true },
    { make: "BMW", model: "X5 (G05)", year: "2019-2024", engine: "3.0 бензин (xDrive40i)", category: "Тормозная система", name: "Колодки тормозные задние", oem: "34116879241", brand: "Textar", inStock: true },
    { make: "BMW", model: "X5 (G05)", year: "2019-2024", engine: "3.0 бензин (xDrive40i)", category: "Фильтры", name: "Воздушный фильтр двигателя", oem: "13717863044", brand: "BMW", inStock: true },
    { make: "BMW", model: "X5 (G05)", year: "2019-2024", engine: "3.0 бензин (xDrive40i)", category: "Фильтры", name: "Салонный фильтр", oem: "64319266771", brand: "BMW", inStock: true },
    { make: "BMW", model: "X5 (G05)", year: "2019-2024", engine: "3.0 бензин (xDrive40i)", category: "Подвеска", name: "Амортизатор передний", oem: "37106892745", brand: "Sachs", inStock: false },
    { make: "BMW", model: "X5 (G05)", year: "2019-2024", engine: "3.0 дизель (xDrive30d)", category: "Тормозная система", name: "Колодки тормозные передние", oem: "34116879240", brand: "Textar", inStock: true },

    // ========== MERCEDES ==========
    // C-Class
    { make: "Mercedes", model: "C-Class (W206)", year: "2021-2024", engine: "1.5 бензин (C200)", category: "Тормозная система", name: "Колодки тормозные передние", oem: "0004200204", brand: "Mercedes-Benz", inStock: true },
    { make: "Mercedes", model: "C-Class (W206)", year: "2021-2024", engine: "1.5 бензин (C200)", category: "Тормозная система", name: "Колодки тормозные задние", oem: "0004200304", brand: "Mercedes-Benz", inStock: true },
    { make: "Mercedes", model: "C-Class (W206)", year: "2021-2024", engine: "1.5 бензин (C200)", category: "Фильтры", name: "Масляный фильтр", oem: "0001801109", brand: "Mercedes-Benz", inStock: true },
    { make: "Mercedes", model: "C-Class (W206)", year: "2021-2024", engine: "1.5 бензин (C200)", category: "Фильтры", name: "Воздушный фильтр двигателя", oem: "0001803600", brand: "Mercedes-Benz", inStock: true },
    { make: "Mercedes", model: "C-Class (W206)", year: "2021-2024", engine: "1.5 бензин (C200)", category: "Фильтры", name: "Салонный фильтр", oem: "0008305200", brand: "MANN-FILTER", inStock: true },
    { make: "Mercedes", model: "C-Class (W206)", year: "2021-2024", engine: "1.5 бензин (C200)", category: "Подвеска", name: "Амортизатор передний", oem: "2233200113", brand: "Sachs", inStock: false },

    // E-Class
    { make: "Mercedes", model: "E-Class (W214)", year: "2023-2024", engine: "2.0 бензин (E200)", category: "Тормозная система", name: "Диски тормозные передние", oem: "0004215100", brand: "Mercedes-Benz", inStock: false },
    { make: "Mercedes", model: "E-Class (W214)", year: "2023-2024", engine: "2.0 бензин (E200)", category: "Тормозная система", name: "Колодки тормозные передние", oem: "0004200204", brand: "Mercedes-Benz", inStock: true },
    { make: "Mercedes", model: "E-Class (W214)", year: "2023-2024", engine: "2.0 бензин (E200)", category: "Фильтры", name: "Масляный фильтр", oem: "0001801109", brand: "Mercedes-Benz", inStock: true },
    { make: "Mercedes", model: "E-Class (W214)", year: "2023-2024", engine: "2.0 бензин (E200)", category: "Фильтры", name: "Салонный фильтр", oem: "0008305200", brand: "MANN-FILTER", inStock: true },
    { make: "Mercedes", model: "E-Class (W214)", year: "2023-2024", engine: "2.0 дизель (E220d)", category: "Фильтры", name: "Масляный фильтр", oem: "0001801109", brand: "Mercedes-Benz", inStock: true },

    // GLC
    { make: "Mercedes", model: "GLC (X254)", year: "2022-2024", engine: "2.0 бензин (GLC300)", category: "Тормозная система", name: "Колодки тормозные передние", oem: "0004208907", brand: "Mercedes-Benz", inStock: true },
    { make: "Mercedes", model: "GLC (X254)", year: "2022-2024", engine: "2.0 бензин (GLC300)", category: "Фильтры", name: "Масляный фильтр", oem: "0001801109", brand: "Mercedes-Benz", inStock: true },
    { make: "Mercedes", model: "GLC (X254)", year: "2022-2024", engine: "2.0 бензин (GLC300)", category: "Фильтры", name: "Салонный фильтр", oem: "0008305200", brand: "MANN-FILTER", inStock: true },

    // ========== VOLKSWAGEN ==========
    // Passat B8
    { make: "Volkswagen", model: "Passat B8", year: "2015-2023", engine: "2.0 TSI бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "5Q0698151F", brand: "Textar", inStock: true },
    { make: "Volkswagen", model: "Passat B8", year: "2015-2023", engine: "2.0 TSI бензин", category: "Тормозная система", name: "Колодки тормозные задние", oem: "5Q0698451G", brand: "Textar", inStock: true },
    { make: "Volkswagen", model: "Passat B8", year: "2015-2023", engine: "2.0 TSI бензин", category: "Фильтры", name: "Масляный фильтр", oem: "06J115403Q", brand: "VAG", inStock: true },
    { make: "Volkswagen", model: "Passat B8", year: "2015-2023", engine: "2.0 TSI бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "5Q0129620B", brand: "VAG", inStock: true },
    { make: "Volkswagen", model: "Passat B8", year: "2015-2023", engine: "2.0 TSI бензин", category: "Фильтры", name: "Салонный фильтр", oem: "5Q0819439B", brand: "VAG", inStock: true },
    { make: "Volkswagen", model: "Passat B8", year: "2015-2023", engine: "2.0 TSI бензин", category: "Подвеска", name: "Стойка стабилизатора передняя", oem: "5Q0411315F", brand: "VAG", inStock: true },
    { make: "Volkswagen", model: "Passat B8", year: "2015-2023", engine: "2.0 TSI бензин", category: "Подвеска", name: "Амортизатор передний", oem: "5Q0413031DP", brand: "Sachs", inStock: false },
    { make: "Volkswagen", model: "Passat B8", year: "2015-2023", engine: "2.0 TSI бензин", category: "Электрика", name: "Свечи зажигания (комплект)", oem: "06K905601A", brand: "NGK", inStock: true },
    { make: "Volkswagen", model: "Passat B8", year: "2015-2023", engine: "2.0 TSI бензин", category: "Охлаждение", name: "Помпа водяная", oem: "06K121111C", brand: "VAG", inStock: true },
    { make: "Volkswagen", model: "Passat B8", year: "2015-2023", engine: "2.0 TDI дизель", category: "Фильтры", name: "Масляный фильтр", oem: "04L115466K", brand: "VAG", inStock: true },
    { make: "Volkswagen", model: "Passat B8", year: "2015-2023", engine: "2.0 TDI дизель", category: "Фильтры", name: "Топливный фильтр", oem: "5Q0127177A", brand: "VAG", inStock: true },

    // Tiguan II
    { make: "Volkswagen", model: "Tiguan II", year: "2016-2024", engine: "2.0 TSI бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "5Q0698151F", brand: "Textar", inStock: true },
    { make: "Volkswagen", model: "Tiguan II", year: "2016-2024", engine: "2.0 TSI бензин", category: "Тормозная система", name: "Колодки тормозные задние", oem: "5Q0698451G", brand: "Textar", inStock: true },
    { make: "Volkswagen", model: "Tiguan II", year: "2016-2024", engine: "2.0 TSI бензин", category: "Фильтры", name: "Масляный фильтр", oem: "06J115403Q", brand: "VAG", inStock: true },
    { make: "Volkswagen", model: "Tiguan II", year: "2016-2024", engine: "2.0 TSI бензин", category: "Подвеска", name: "Амортизатор передний", oem: "5Q0413031DP", brand: "Sachs", inStock: true },
    { make: "Volkswagen", model: "Tiguan II", year: "2016-2024", engine: "2.0 TSI бензин", category: "Подвеска", name: "Стойка стабилизатора задняя", oem: "5Q0511335J", brand: "VAG", inStock: true },

    // Polo
    { make: "Volkswagen", model: "Polo VI", year: "2020-2024", engine: "1.6 бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "2Q0698151", brand: "Textar", inStock: true },
    { make: "Volkswagen", model: "Polo VI", year: "2020-2024", engine: "1.6 бензин", category: "Фильтры", name: "Масляный фильтр", oem: "06J115403Q", brand: "VAG", inStock: true },
    { make: "Volkswagen", model: "Polo VI", year: "2020-2024", engine: "1.6 бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "5Q0129620B", brand: "VAG", inStock: true },
    { make: "Volkswagen", model: "Polo VI", year: "2020-2024", engine: "1.6 бензин", category: "Фильтры", name: "Салонный фильтр", oem: "2Q0819439", brand: "VAG", inStock: true },

    // ========== HYUNDAI ==========
    // Sonata
    { make: "Hyundai", model: "Sonata (DN8)", year: "2020-2024", engine: "2.0 бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "58101-L5A10", brand: "Hyundai", inStock: true },
    { make: "Hyundai", model: "Sonata (DN8)", year: "2020-2024", engine: "2.0 бензин", category: "Тормозная система", name: "Колодки тормозные задние", oem: "58102-L5A10", brand: "Hyundai", inStock: true },
    { make: "Hyundai", model: "Sonata (DN8)", year: "2020-2024", engine: "2.0 бензин", category: "Фильтры", name: "Масляный фильтр", oem: "26300-35530", brand: "Hyundai", inStock: true },
    { make: "Hyundai", model: "Sonata (DN8)", year: "2020-2024", engine: "2.0 бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "28113-L1000", brand: "Hyundai", inStock: true },
    { make: "Hyundai", model: "Sonata (DN8)", year: "2020-2024", engine: "2.0 бензин", category: "Фильтры", name: "Салонный фильтр", oem: "97133-L1000", brand: "Hyundai", inStock: true },
    { make: "Hyundai", model: "Sonata (DN8)", year: "2020-2024", engine: "1.6 T-GDI бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "28113-L1000", brand: "Hyundai", inStock: true },

    // Tucson
    { make: "Hyundai", model: "Tucson (NX4)", year: "2021-2024", engine: "2.0 бензин", category: "Фильтры", name: "Масляный фильтр", oem: "26300-35530", brand: "Hyundai", inStock: true },
    { make: "Hyundai", model: "Tucson (NX4)", year: "2021-2024", engine: "2.0 бензин", category: "Фильтры", name: "Салонный фильтр", oem: "97133-N9000", brand: "Hyundai", inStock: true },
    { make: "Hyundai", model: "Tucson (NX4)", year: "2021-2024", engine: "1.6 T-GDI бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "58101-N9000", brand: "Hyundai", inStock: true },
    { make: "Hyundai", model: "Tucson (NX4)", year: "2021-2024", engine: "1.6 T-GDI бензин", category: "Подвеска", name: "Амортизатор передний", oem: "54650-N9000", brand: "Hyundai", inStock: false },

    // Solaris
    { make: "Hyundai", model: "Solaris (HC)", year: "2017-2023", engine: "1.6 бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "58101-R1000", brand: "Hyundai", inStock: true },
    { make: "Hyundai", model: "Solaris (HC)", year: "2017-2023", engine: "1.6 бензин", category: "Фильтры", name: "Масляный фильтр", oem: "26300-35530", brand: "Hyundai", inStock: true },
    { make: "Hyundai", model: "Solaris (HC)", year: "2017-2023", engine: "1.6 бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "28113-R1000", brand: "Hyundai", inStock: true },
    { make: "Hyundai", model: "Solaris (HC)", year: "2017-2023", engine: "1.6 бензин", category: "Фильтры", name: "Салонный фильтр", oem: "97133-R1000", brand: "Hyundai", inStock: true },
    { make: "Hyundai", model: "Solaris (HC)", year: "2017-2023", engine: "1.6 бензин", category: "Электрика", name: "Свечи зажигания (комплект)", oem: "18846-11051", brand: "NGK", inStock: true },

    // ========== KIA ==========
    // K5
    { make: "Kia", model: "K5 (DL3)", year: "2020-2024", engine: "2.0 бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "58101-L5A10", brand: "Kia", inStock: true },
    { make: "Kia", model: "K5 (DL3)", year: "2020-2024", engine: "2.0 бензин", category: "Тормозная система", name: "Колодки тормозные задние", oem: "58102-L5A10", brand: "Kia", inStock: true },
    { make: "Kia", model: "K5 (DL3)", year: "2020-2024", engine: "2.0 бензин", category: "Фильтры", name: "Масляный фильтр", oem: "26300-35530", brand: "Kia", inStock: true },
    { make: "Kia", model: "K5 (DL3)", year: "2020-2024", engine: "2.0 бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "28113-L1000", brand: "Kia", inStock: true },
    { make: "Kia", model: "K5 (DL3)", year: "2020-2024", engine: "2.5 бензин", category: "Тормозная система", name: "Диски тормозные передние", oem: "51712-L2000", brand: "Kia", inStock: true },
    { make: "Kia", model: "K5 (DL3)", year: "2020-2024", engine: "2.5 бензин", category: "Электрика", name: "Свечи зажигания (комплект)", oem: "18846-11051", brand: "NGK", inStock: true },

    // Sportage
    { make: "Kia", model: "Sportage (NQ5)", year: "2022-2024", engine: "2.0 бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "58101-N9000", brand: "Kia", inStock: true },
    { make: "Kia", model: "Sportage (NQ5)", year: "2022-2024", engine: "2.0 бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "28113-L1000", brand: "Kia", inStock: true },
    { make: "Kia", model: "Sportage (NQ5)", year: "2022-2024", engine: "2.0 бензин", category: "Фильтры", name: "Салонный фильтр", oem: "97133-N9000", brand: "Kia", inStock: true },
    { make: "Kia", model: "Sportage (NQ5)", year: "2022-2024", engine: "1.6 T-GDI бензин", category: "Фильтры", name: "Масляный фильтр", oem: "26300-35530", brand: "Kia", inStock: true },

    // Rio
    { make: "Kia", model: "Rio (YB)", year: "2017-2023", engine: "1.6 бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "58101-R1000", brand: "Kia", inStock: true },
    { make: "Kia", model: "Rio (YB)", year: "2017-2023", engine: "1.6 бензин", category: "Фильтры", name: "Масляный фильтр", oem: "26300-35530", brand: "Kia", inStock: true },
    { make: "Kia", model: "Rio (YB)", year: "2017-2023", engine: "1.6 бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "28113-R1000", brand: "Kia", inStock: true },
    { make: "Kia", model: "Rio (YB)", year: "2017-2023", engine: "1.6 бензин", category: "Фильтры", name: "Салонный фильтр", oem: "97133-R1000", brand: "Kia", inStock: true },

    // ========== CHERY ==========
    // Tiggo 4
    { make: "Chery", model: "Tiggo 4", year: "2019-2024", engine: "1.5T бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "T15-3501080", brand: "Chery", inStock: true },
    { make: "Chery", model: "Tiggo 4", year: "2019-2024", engine: "1.5T бензин", category: "Тормозная система", name: "Колодки тормозные задние", oem: "T15-3501085", brand: "Chery", inStock: true },
    { make: "Chery", model: "Tiggo 4", year: "2019-2024", engine: "1.5T бензин", category: "Фильтры", name: "Масляный фильтр", oem: "481H-1012010", brand: "Chery", inStock: true },
    { make: "Chery", model: "Tiggo 4", year: "2019-2024", engine: "1.5T бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "T15-1109110", brand: "Chery", inStock: true },
    { make: "Chery", model: "Tiggo 4", year: "2019-2024", engine: "1.5T бензин", category: "Фильтры", name: "Салонный фильтр", oem: "T15-8107010", brand: "Chery", inStock: true },
    { make: "Chery", model: "Tiggo 4", year: "2019-2024", engine: "1.5T бензин", category: "Электрика", name: "Свечи зажигания (комплект)", oem: "F01R-00001", brand: "Chery", inStock: true },

    // Tiggo 7
    { make: "Chery", model: "Tiggo 7 Pro", year: "2020-2024", engine: "1.5T бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "T15-3501080", brand: "Chery", inStock: true },
    { make: "Chery", model: "Tiggo 7 Pro", year: "2020-2024", engine: "1.5T бензин", category: "Фильтры", name: "Масляный фильтр", oem: "481H-1012010", brand: "Chery", inStock: true },
    { make: "Chery", model: "Tiggo 7 Pro", year: "2020-2024", engine: "1.5T бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "T15-1109110", brand: "Chery", inStock: true },
    { make: "Chery", model: "Tiggo 7 Pro", year: "2020-2024", engine: "1.5T бензин", category: "Фильтры", name: "Салонный фильтр", oem: "T15-8107010", brand: "Chery", inStock: true },

    // Tiggo 8
    { make: "Chery", model: "Tiggo 8 Pro", year: "2021-2024", engine: "2.0T бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "T18-3501080", brand: "Chery", inStock: true },
    { make: "Chery", model: "Tiggo 8 Pro", year: "2021-2024", engine: "2.0T бензин", category: "Тормозная система", name: "Колодки тормозные задние", oem: "T18-3501085", brand: "Chery", inStock: true },
    { make: "Chery", model: "Tiggo 8 Pro", year: "2021-2024", engine: "2.0T бензин", category: "Фильтры", name: "Масляный фильтр", oem: "481H-1012010", brand: "Chery", inStock: true },
    { make: "Chery", model: "Tiggo 8 Pro", year: "2021-2024", engine: "2.0T бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "T18-1109110", brand: "Chery", inStock: true },
    { make: "Chery", model: "Tiggo 8 Pro", year: "2021-2024", engine: "2.0T бензин", category: "Фильтры", name: "Салонный фильтр", oem: "T18-8107010", brand: "Chery", inStock: true },

    // ========== GEELY ==========
    // Monjaro
    { make: "Geely", model: "Monjaro", year: "2022-2024", engine: "2.0T бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "1019010100", brand: "Geely", inStock: true },
    { make: "Geely", model: "Monjaro", year: "2022-2024", engine: "2.0T бензин", category: "Фильтры", name: "Масляный фильтр", oem: "1012010001", brand: "Geely", inStock: true },
    { make: "Geely", model: "Monjaro", year: "2022-2024", engine: "2.0T бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "1109110005", brand: "Geely", inStock: true },
    { make: "Geely", model: "Monjaro", year: "2022-2024", engine: "2.0T бензин", category: "Фильтры", name: "Салонный фильтр", oem: "8107010001", brand: "Geely", inStock: true },

    // Coolray
    { make: "Geely", model: "Coolray", year: "2020-2024", engine: "1.5T бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "1019010100", brand: "Geely", inStock: true },
    { make: "Geely", model: "Coolray", year: "2020-2024", engine: "1.5T бензин", category: "Фильтры", name: "Масляный фильтр", oem: "1012010001", brand: "Geely", inStock: true },
    { make: "Geely", model: "Coolray", year: "2020-2024", engine: "1.5T бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "1109110005", brand: "Geely", inStock: true },
    { make: "Geely", model: "Coolray", year: "2020-2024", engine: "1.5T бензин", category: "Фильтры", name: "Салонный фильтр", oem: "8107010001", brand: "Geely", inStock: true },

    // Atlas
    { make: "Geely", model: "Atlas", year: "2018-2024", engine: "2.4 бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "1019010100", brand: "Geely", inStock: true },
    { make: "Geely", model: "Atlas", year: "2018-2024", engine: "2.4 бензин", category: "Фильтры", name: "Масляный фильтр", oem: "1012010001", brand: "Geely", inStock: true },
    { make: "Geely", model: "Atlas", year: "2018-2024", engine: "2.4 бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "1109110005", brand: "Geely", inStock: true },

    // ========== HAVAL ==========
    // Jolion
    { make: "Haval", model: "Jolion", year: "2021-2024", engine: "1.5T бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "3501080X", brand: "Haval", inStock: true },
    { make: "Haval", model: "Jolion", year: "2021-2024", engine: "1.5T бензин", category: "Тормозная система", name: "Колодки тормозные задние", oem: "3501090X", brand: "Haval", inStock: true },
    { make: "Haval", model: "Jolion", year: "2021-2024", engine: "1.5T бензин", category: "Фильтры", name: "Масляный фильтр", oem: "1012000X", brand: "Haval", inStock: true },
    { make: "Haval", model: "Jolion", year: "2021-2024", engine: "1.5T бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "1109000X", brand: "Haval", inStock: true },
    { make: "Haval", model: "Jolion", year: "2021-2024", engine: "1.5T бензин", category: "Фильтры", name: "Салонный фильтр", oem: "8107000X", brand: "Haval", inStock: true },
    { make: "Haval", model: "Jolion", year: "2021-2024", engine: "1.5T бензин", category: "Подвеска", name: "Амортизатор передний", oem: "2905000X", brand: "Haval", inStock: false },

    // F7
    { make: "Haval", model: "F7", year: "2019-2024", engine: "2.0T бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "3501080X", brand: "Haval", inStock: true },
    { make: "Haval", model: "F7", year: "2019-2024", engine: "2.0T бензин", category: "Фильтры", name: "Масляный фильтр", oem: "1012000X", brand: "Haval", inStock: true },
    { make: "Haval", model: "F7", year: "2019-2024", engine: "2.0T бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "1109000X", brand: "Haval", inStock: true },
    { make: "Haval", model: "F7", year: "2019-2024", engine: "2.0T бензин", category: "Фильтры", name: "Салонный фильтр", oem: "8107000X", brand: "Haval", inStock: true },

    // ========== EXEED ==========
    // LX
    { make: "Exeed", model: "LX", year: "2020-2024", engine: "1.5T бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "EXD-3501080", brand: "Exeed", inStock: true },
    { make: "Exeed", model: "LX", year: "2020-2024", engine: "1.5T бензин", category: "Фильтры", name: "Масляный фильтр", oem: "EXD-1012010", brand: "Exeed", inStock: true },
    { make: "Exeed", model: "LX", year: "2020-2024", engine: "1.5T бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "EXD-1109110", brand: "Exeed", inStock: true },
    { make: "Exeed", model: "LX", year: "2020-2024", engine: "1.5T бензин", category: "Фильтры", name: "Салонный фильтр", oem: "EXD-8107010", brand: "Exeed", inStock: true },

    // TXL
    { make: "Exeed", model: "TXL", year: "2021-2024", engine: "2.0T бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "EXD-3501080", brand: "Exeed", inStock: true },
    { make: "Exeed", model: "TXL", year: "2021-2024", engine: "2.0T бензин", category: "Фильтры", name: "Масляный фильтр", oem: "EXD-1012010", brand: "Exeed", inStock: true },
    { make: "Exeed", model: "TXL", year: "2021-2024", engine: "2.0T бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "EXD-1109110", brand: "Exeed", inStock: true },
    { make: "Exeed", model: "TXL", year: "2021-2024", engine: "2.0T бензин", category: "Фильтры", name: "Салонный фильтр", oem: "EXD-8107010", brand: "Exeed", inStock: true },

    // VX
    { make: "Exeed", model: "VX", year: "2021-2024", engine: "2.0T бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "EXD-3501080", brand: "Exeed", inStock: true },
    { make: "Exeed", model: "VX", year: "2021-2024", engine: "2.0T бензин", category: "Фильтры", name: "Масляный фильтр", oem: "EXD-1012010", brand: "Exeed", inStock: true },

    // ========== FORD ==========
    // Focus
    { make: "Ford", model: "Focus IV", year: "2018-2024", engine: "1.5 EcoBoost бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "2181763", brand: "Ford", inStock: true },
    { make: "Ford", model: "Focus IV", year: "2018-2024", engine: "1.5 EcoBoost бензин", category: "Тормозная система", name: "Колодки тормозные задние", oem: "2181764", brand: "Ford", inStock: true },
    { make: "Ford", model: "Focus IV", year: "2018-2024", engine: "1.5 EcoBoost бензин", category: "Фильтры", name: "Масляный фильтр", oem: "1896233", brand: "Ford", inStock: true },
    { make: "Ford", model: "Focus IV", year: "2018-2024", engine: "1.5 EcoBoost бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "2180592", brand: "Ford", inStock: true },
    { make: "Ford", model: "Focus IV", year: "2018-2024", engine: "1.5 EcoBoost бензин", category: "Фильтры", name: "Салонный фильтр", oem: "2196941", brand: "Ford", inStock: true },
    { make: "Ford", model: "Focus IV", year: "2018-2024", engine: "1.5 TDCi дизель", category: "Фильтры", name: "Масляный фильтр", oem: "1884857", brand: "Ford", inStock: true },

    // Kuga
    { make: "Ford", model: "Kuga III", year: "2021-2024", engine: "2.5 бензин гибрид", category: "Тормозная система", name: "Колодки тормозные передние", oem: "2475658", brand: "Ford", inStock: true },
    { make: "Ford", model: "Kuga III", year: "2021-2024", engine: "2.5 бензин гибрид", category: "Фильтры", name: "Салонный фильтр", oem: "2423337", brand: "Ford", inStock: true },
    { make: "Ford", model: "Kuga III", year: "2021-2024", engine: "2.5 бензин гибрид", category: "Фильтры", name: "Масляный фильтр", oem: "1896233", brand: "Ford", inStock: true },

    // ========== SKODA ==========
    // Octavia
    { make: "Skoda", model: "Octavia A8", year: "2020-2024", engine: "1.4 TSI бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "5Q0698151F", brand: "Textar", inStock: true },
    { make: "Skoda", model: "Octavia A8", year: "2020-2024", engine: "1.4 TSI бензин", category: "Тормозная система", name: "Колодки тормозные задние", oem: "5Q0698451G", brand: "Textar", inStock: true },
    { make: "Skoda", model: "Octavia A8", year: "2020-2024", engine: "1.4 TSI бензин", category: "Фильтры", name: "Масляный фильтр", oem: "06J115403Q", brand: "VAG", inStock: true },
    { make: "Skoda", model: "Octavia A8", year: "2020-2024", engine: "1.4 TSI бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "5Q0129620B", brand: "VAG", inStock: true },
    { make: "Skoda", model: "Octavia A8", year: "2020-2024", engine: "1.4 TSI бензин", category: "Фильтры", name: "Салонный фильтр", oem: "5Q0819439B", brand: "VAG", inStock: true },
    { make: "Skoda", model: "Octavia A8", year: "2020-2024", engine: "1.4 TSI бензин", category: "Электрика", name: "Свечи зажигания (комплект)", oem: "06K905601A", brand: "NGK", inStock: true },
    { make: "Skoda", model: "Octavia A8", year: "2020-2024", engine: "2.0 TSI бензин", category: "Тормозная система", name: "Диски тормозные передние", oem: "5Q0615301AK", brand: "VAG", inStock: true },
    { make: "Skoda", model: "Octavia A8", year: "2020-2024", engine: "2.0 TDI дизель", category: "Фильтры", name: "Топливный фильтр", oem: "5Q0127177A", brand: "VAG", inStock: true },

    // Kodiaq
    { make: "Skoda", model: "Kodiaq", year: "2017-2024", engine: "2.0 TSI бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "5Q0698151F", brand: "Textar", inStock: true },
    { make: "Skoda", model: "Kodiaq", year: "2017-2024", engine: "2.0 TSI бензин", category: "Фильтры", name: "Масляный фильтр", oem: "06J115403Q", brand: "VAG", inStock: true },
    { make: "Skoda", model: "Kodiaq", year: "2017-2024", engine: "2.0 TSI бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "5Q0129620B", brand: "VAG", inStock: true },
    { make: "Skoda", model: "Kodiaq", year: "2017-2024", engine: "2.0 TSI бензин", category: "Подвеска", name: "Амортизатор передний", oem: "5Q0413031DP", brand: "Sachs", inStock: false },

    // ========== AUDI ==========
    // A4
    { make: "Audi", model: "A4 (B9)", year: "2016-2024", engine: "2.0 TFSI бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "8W0698151F", brand: "Textar", inStock: true },
    { make: "Audi", model: "A4 (B9)", year: "2016-2024", engine: "2.0 TFSI бензин", category: "Тормозная система", name: "Колодки тормозные задние", oem: "8W0698451G", brand: "Textar", inStock: true },
    { make: "Audi", model: "A4 (B9)", year: "2016-2024", engine: "2.0 TFSI бензин", category: "Фильтры", name: "Масляный фильтр", oem: "06J115403Q", brand: "VAG", inStock: true },
    { make: "Audi", model: "A4 (B9)", year: "2016-2024", engine: "2.0 TFSI бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "8W0129620", brand: "VAG", inStock: true },
    { make: "Audi", model: "A4 (B9)", year: "2016-2024", engine: "2.0 TFSI бензин", category: "Фильтры", name: "Салонный фильтр", oem: "8W0819439", brand: "VAG", inStock: true },
    { make: "Audi", model: "A4 (B9)", year: "2016-2024", engine: "2.0 TDI дизель", category: "Фильтры", name: "Масляный фильтр", oem: "04L115466K", brand: "VAG", inStock: true },

    // A6
    { make: "Audi", model: "A6 (C8)", year: "2018-2024", engine: "3.0 TFSI бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "4K0698151F", brand: "Textar", inStock: true },
    { make: "Audi", model: "A6 (C8)", year: "2018-2024", engine: "3.0 TFSI бензин", category: "Фильтры", name: "Масляный фильтр", oem: "06J115403Q", brand: "VAG", inStock: true },
    { make: "Audi", model: "A6 (C8)", year: "2018-2024", engine: "3.0 TFSI бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "4K0129620", brand: "VAG", inStock: true },

    // Q5
    { make: "Audi", model: "Q5 (80A)", year: "2018-2024", engine: "2.0 TFSI бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "80A698151F", brand: "Textar", inStock: true },
    { make: "Audi", model: "Q5 (80A)", year: "2018-2024", engine: "2.0 TFSI бензин", category: "Тормозная система", name: "Колодки тормозные задние", oem: "80A698451G", brand: "Textar", inStock: true },
    { make: "Audi", model: "Q5 (80A)", year: "2018-2024", engine: "2.0 TFSI бензин", category: "Фильтры", name: "Масляный фильтр", oem: "06J115403Q", brand: "VAG", inStock: true },
    { make: "Audi", model: "Q5 (80A)", year: "2018-2024", engine: "2.0 TFSI бензин", category: "Подвеска", name: "Амортизатор передний", oem: "80A413031B", brand: "Sachs", inStock: false },

    // ========== RENAULT ==========
    // Duster
    { make: "Renault", model: "Duster II", year: "2021-2024", engine: "1.3 TCe бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "41060-6483R", brand: "Renault", inStock: true },
    { make: "Renault", model: "Duster II", year: "2021-2024", engine: "1.3 TCe бензин", category: "Тормозная система", name: "Колодки тормозные задние", oem: "44060-6483R", brand: "Renault", inStock: true },
    { make: "Renault", model: "Duster II", year: "2021-2024", engine: "1.3 TCe бензин", category: "Фильтры", name: "Масляный фильтр", oem: "15208-6500R", brand: "Renault", inStock: true },
    { make: "Renault", model: "Duster II", year: "2021-2024", engine: "1.3 TCe бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "16546-6483R", brand: "Renault", inStock: true },
    { make: "Renault", model: "Duster II", year: "2021-2024", engine: "1.3 TCe бензин", category: "Фильтры", name: "Салонный фильтр", oem: "27273-6483R", brand: "Renault", inStock: true },

    // Logan
    { make: "Renault", model: "Logan II", year: "2015-2024", engine: "1.6 бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "41060-9625R", brand: "Renault", inStock: true },
    { make: "Renault", model: "Logan II", year: "2015-2024", engine: "1.6 бензин", category: "Фильтры", name: "Масляный фильтр", oem: "15208-6500R", brand: "Renault", inStock: true },
    { make: "Renault", model: "Logan II", year: "2015-2024", engine: "1.6 бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "16546-9625R", brand: "Renault", inStock: true },

    // ========== LADA ==========
    // Vesta
    { make: "Lada", model: "Vesta", year: "2015-2024", engine: "1.6 16V бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "21110-3501080", brand: "Lada", inStock: true },
    { make: "Lada", model: "Vesta", year: "2015-2024", engine: "1.6 16V бензин", category: "Тормозная система", name: "Колодки тормозные задние", oem: "21110-3502080", brand: "Lada", inStock: true },
    { make: "Lada", model: "Vesta", year: "2015-2024", engine: "1.6 16V бензин", category: "Фильтры", name: "Масляный фильтр", oem: "21080-1012005", brand: "Lada", inStock: true },
    { make: "Lada", model: "Vesta", year: "2015-2024", engine: "1.6 16V бензин", category: "Фильтры", name: "Воздушный фильтр двигателя", oem: "21129-1109080", brand: "Lada", inStock: true },
    { make: "Lada", model: "Vesta", year: "2015-2024", engine: "1.6 16V бензин", category: "Фильтры", name: "Салонный фильтр", oem: "21230-8122010", brand: "Lada", inStock: true },
    { make: "Lada", model: "Vesta", year: "2015-2024", engine: "1.6 16V бензин", category: "Подвеска", name: "Амортизатор передний", oem: "21900-2905004", brand: "Lada", inStock: true },
    { make: "Lada", model: "Vesta", year: "2015-2024", engine: "1.6 16V бензин", category: "Подвеска", name: "Стойка стабилизатора передняя", oem: "21900-2906040", brand: "Lada", inStock: true },
    { make: "Lada", model: "Vesta", year: "2015-2024", engine: "1.6 16V бензин", category: "Электрика", name: "Свечи зажигания (комплект)", oem: "21110-3707010", brand: "Lada", inStock: true },
    { make: "Lada", model: "Vesta", year: "2015-2024", engine: "1.8 бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "21110-3501080", brand: "Lada", inStock: true },

    // Granta
    { make: "Lada", model: "Granta", year: "2011-2024", engine: "1.6 8V бензин", category: "Фильтры", name: "Масляный фильтр", oem: "21080-1012005", brand: "Lada", inStock: true },
    { make: "Lada", model: "Granta", year: "2011-2024", engine: "1.6 8V бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "21080-3501080", brand: "Lada", inStock: true },
    { make: "Lada", model: "Granta", year: "2011-2024", engine: "1.6 8V бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "21080-1109080", brand: "Lada", inStock: true },
    { make: "Lada", model: "Granta", year: "2011-2024", engine: "1.6 8V бензин", category: "Фильтры", name: "Салонный фильтр", oem: "21230-8122010", brand: "Lada", inStock: true },

    // Largus
    { make: "Lada", model: "Largus", year: "2012-2024", engine: "1.6 16V бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "21110-3501080", brand: "Lada", inStock: true },
    { make: "Lada", model: "Largus", year: "2012-2024", engine: "1.6 16V бензин", category: "Фильтры", name: "Масляный фильтр", oem: "21080-1012005", brand: "Lada", inStock: true },
    { make: "Lada", model: "Largus", year: "2012-2024", engine: "1.6 16V бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "21129-1109080", brand: "Lada", inStock: true },

    // ========== NISSAN ==========
    // Qashqai
    { make: "Nissan", model: "Qashqai J12", year: "2021-2024", engine: "1.3 DIG-T бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "D1060-JP00C", brand: "Nissan", inStock: true },
    { make: "Nissan", model: "Qashqai J12", year: "2021-2024", engine: "1.3 DIG-T бензин", category: "Фильтры", name: "Масляный фильтр", oem: "15208-6500R", brand: "Nissan", inStock: true },
    { make: "Nissan", model: "Qashqai J12", year: "2021-2024", engine: "1.3 DIG-T бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "16546-4BC0A", brand: "Nissan", inStock: true },
    { make: "Nissan", model: "Qashqai J12", year: "2021-2024", engine: "1.3 DIG-T бензин", category: "Фильтры", name: "Салонный фильтр", oem: "27273-4BC0A", brand: "Nissan", inStock: true },

    // X-Trail
    { make: "Nissan", model: "X-Trail T33", year: "2022-2024", engine: "2.0 бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "D1060-JP00C", brand: "Nissan", inStock: true },
    { make: "Nissan", model: "X-Trail T33", year: "2022-2024", engine: "2.0 бензин", category: "Фильтры", name: "Масляный фильтр", oem: "15208-6500R", brand: "Nissan", inStock: true },
    { make: "Nissan", model: "X-Trail T33", year: "2022-2024", engine: "2.0 бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "16546-4BC0A", brand: "Nissan", inStock: true },
    { make: "Nissan", model: "X-Trail T33", year: "2022-2024", engine: "2.0 бензин", category: "Фильтры", name: "Салонный фильтр", oem: "27273-4BC0A", brand: "Nissan", inStock: true },

    // ========== MAZDA ==========
    // CX-5
    { make: "Mazda", model: "CX-5 (KF)", year: "2017-2024", engine: "2.0 SkyActiv бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "KDY0-26-38Z", brand: "Mazda", inStock: true },
    { make: "Mazda", model: "CX-5 (KF)", year: "2017-2024", engine: "2.0 SkyActiv бензин", category: "Тормозная система", name: "Колодки тормозные задние", oem: "KDY0-26-48Z", brand: "Mazda", inStock: true },
    { make: "Mazda", model: "CX-5 (KF)", year: "2017-2024", engine: "2.0 SkyActiv бензин", category: "Фильтры", name: "Масляный фильтр", oem: "WLY7-14-302", brand: "Mazda", inStock: true },
    { make: "Mazda", model: "CX-5 (KF)", year: "2017-2024", engine: "2.0 SkyActiv бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "KDY0-13-Z40", brand: "Mazda", inStock: true },
    { make: "Mazda", model: "CX-5 (KF)", year: "2017-2024", engine: "2.0 SkyActiv бензин", category: "Фильтры", name: "Салонный фильтр", oem: "KDY0-61-J6X", brand: "Mazda", inStock: true },
    { make: "Mazda", model: "CX-5 (KF)", year: "2017-2024", engine: "2.0 SkyActiv бензин", category: "Электрика", name: "Свечи зажигания (комплект)", oem: "PE01-18-110", brand: "NGK", inStock: true },
    { make: "Mazda", model: "CX-5 (KF)", year: "2017-2024", engine: "2.5 SkyActiv бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "KDY0-13-Z40", brand: "Mazda", inStock: true },

    // Mazda6
    { make: "Mazda", model: "Mazda6 (GJ)", year: "2013-2024", engine: "2.0 SkyActiv бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "GJYA-26-38Z", brand: "Mazda", inStock: true },
    { make: "Mazda", model: "Mazda6 (GJ)", year: "2013-2024", engine: "2.0 SkyActiv бензин", category: "Фильтры", name: "Масляный фильтр", oem: "WLY7-14-302", brand: "Mazda", inStock: true },
    { make: "Mazda", model: "Mazda6 (GJ)", year: "2013-2024", engine: "2.0 SkyActiv бензин", category: "Фильтры", name: "Салонный фильтр", oem: "GJYA-61-J6X", brand: "Mazda", inStock: true },

    // ========== UNIVERSAL ==========
    { make: "Universal", model: "Универсальные", year: "—", engine: "—", category: "Масла и жидкости", name: "Антифриз красный (G12) 5л", oem: "81114-AA240", brand: "Motul", inStock: true },
    { make: "Universal", model: "Универсальные", year: "—", engine: "—", category: "Масла и жидкости", name: "Антифриз зелёный (G11) 5л", oem: "81114-AA140", brand: "Motul", inStock: true },
    { make: "Universal", model: "Универсальные", year: "—", engine: "—", category: "Масла и жидкости", name: "Масло ATF Dexron VI 1л", oem: "ATF-D6-1L", brand: "Mobil", inStock: true },
    { make: "Universal", model: "Универсальные", year: "—", engine: "—", category: "Масла и жидкости", name: "Масло моторное 5W-30 синтетика 4л", oem: "MOB-5W30-4L", brand: "Mobil", inStock: true },
    { make: "Universal", model: "Универсальные", year: "—", engine: "—", category: "Масла и жидкости", name: "Масло моторное 5W-40 синтетика 4л", oem: "MOB-5W40-4L", brand: "Mobil", inStock: true },
    { make: "Universal", model: "Универсальные", year: "—", engine: "—", category: "Масла и жидкости", name: "Тормозная жидкость DOT4 1л", oem: "DOT4-1L", brand: "Bosch", inStock: true },
    { make: "Universal", model: "Универсальные", year: "—", engine: "—", category: "Электрика", name: "Свеча зажигания", oem: "FR7KII33X", brand: "NGK", inStock: true },
    { make: "Universal", model: "Универсальные", year: "—", engine: "—", category: "Электрика", name: "Аккумулятор 60Ah", oem: "60044-К", brand: "Varta", inStock: true },
    { make: "Universal", model: "Универсальные", year: "—", engine: "—", category: "Электрика", name: "Аккумулятор 75Ah", oem: "75022-К", brand: "Bosch", inStock: false },
    { make: "Universal", model: "Универсальные", year: "—", engine: "—", category: "Электрика", name: "Аккумулятор 100Ah", oem: "100Ah-К", brand: "Varta", inStock: false },
    { make: "Universal", model: "Универсальные", year: "—", engine: "—", category: "Кузов", name: "Щетки стеклоочистителя 26+16", oem: "WW-2616", brand: "Bosch", inStock: true },
    { make: "Universal", model: "Универсальные", year: "—", engine: "—", category: "Кузов", name: "Щетки стеклоочистителя 28+14", oem: "WW-2814", brand: "Bosch", inStock: true },

    // ========== TOYOTA (дополнения) ==========
    // Land Cruiser 300
    { make: "Toyota", model: "Land Cruiser 300", year: "2022-2024", engine: "3.5TT бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "04465-60690", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "Land Cruiser 300", year: "2022-2024", engine: "3.5TT бензин", category: "Тормозная система", name: "Колодки тормозные задние", oem: "04466-60680", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "Land Cruiser 300", year: "2022-2024", engine: "3.5TT бензин", category: "Фильтры", name: "Масляный фильтр", oem: "04152-38010", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "Land Cruiser 300", year: "2022-2024", engine: "3.5TT бензин", category: "Фильтры", name: "Воздушный фильтр двигателя", oem: "17801-71030", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "Land Cruiser 300", year: "2022-2024", engine: "3.5TT бензин", category: "Фильтры", name: "Салонный фильтр", oem: "87139-60830", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "Land Cruiser 300", year: "2022-2024", engine: "3.5TT бензин", category: "Подвеска", name: "Амортизатор передний", oem: "48510-69415", brand: "Toyota", inStock: false },
    { make: "Toyota", model: "Land Cruiser 300", year: "2022-2024", engine: "3.5TT бензин", category: "Подвеска", name: "Стойка стабилизатора передняя", oem: "48820-60090", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "Land Cruiser 300", year: "2022-2024", engine: "3.5TT бензин", category: "Электрика", name: "Свечи зажигания (комплект)", oem: "90919-01276", brand: "NGK", inStock: true },

    // Highlander
    { make: "Toyota", model: "Highlander", year: "2020-2024", engine: "2.5 гибрид", category: "Тормозная система", name: "Колодки тормозные передние", oem: "04465-48040", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "Highlander", year: "2020-2024", engine: "2.5 гибрид", category: "Фильтры", name: "Масляный фильтр", oem: "04152-YZZA1", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "Highlander", year: "2020-2024", engine: "2.5 гибрид", category: "Фильтры", name: "Воздушный фильтр", oem: "17801-0C030", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "Highlander", year: "2020-2024", engine: "2.5 гибрид", category: "Фильтры", name: "Салонный фильтр", oem: "87139-07110", brand: "Toyota", inStock: true },

    // Дополнительные детали для Camry
    { make: "Toyota", model: "Camry", year: "2018-2024", engine: "2.5 бензин", category: "Двигатель", name: "Ремень ГРМ (цепь)", oem: "13568-0K010", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "Camry", year: "2018-2024", engine: "2.5 бензин", category: "Подвеска", name: "Подшипник ступицы передний", oem: "43550-33230", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "Camry", year: "2018-2024", engine: "2.5 бензин", category: "Электрика", name: "Датчик кислорода (лямбда-зонд)", oem: "89467-33210", brand: "Denso", inStock: true },
    { make: "Toyota", model: "Camry", year: "2018-2024", engine: "2.5 бензин", category: "Охлаждение", name: "Радиатор охлаждения", oem: "16400-0C070", brand: "Toyota", inStock: false },
    { make: "Toyota", model: "Camry", year: "2018-2024", engine: "2.5 бензин", category: "Двигатель", name: "Прокладка клапанной крышки", oem: "11213-0T010", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "Camry", year: "2018-2024", engine: "2.5 бензин", category: "Привод", name: "Ролик натяжной ремня генератора", oem: "16620-0C010", brand: "Toyota", inStock: true },

    // Дополнительные детали для RAV4
    { make: "Toyota", model: "RAV4", year: "2019-2024", engine: "2.0 бензин", category: "Двигатель", name: "Ремень ГРМ (цепь)", oem: "13568-0R010", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "RAV4", year: "2019-2024", engine: "2.0 бензин", category: "Подвеска", name: "Подшипник ступицы передний", oem: "43550-42030", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "RAV4", year: "2019-2024", engine: "2.0 бензин", category: "Электрика", name: "Датчик кислорода (лямбда-зонд)", oem: "89467-42100", brand: "Denso", inStock: true },
    { make: "Toyota", model: "RAV4", year: "2019-2024", engine: "2.0 бензин", category: "Тормозная система", name: "Диски тормозные передние", oem: "43512-42210", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "RAV4", year: "2019-2024", engine: "2.0 бензин", category: "Двигатель", name: "Натяжитель цепи ГРМ", oem: "13540-0R010", brand: "Toyota", inStock: true },

    // Дополнительные детали для Corolla
    { make: "Toyota", model: "Corolla (E210)", year: "2019-2024", engine: "1.6 бензин", category: "Подвеска", name: "Подшипник ступицы передний", oem: "43550-02270", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "Corolla (E210)", year: "2019-2024", engine: "1.6 бензин", category: "Охлаждение", name: "Помпа водяная", oem: "16100-0T031", brand: "Aisin", inStock: true },
    { make: "Toyota", model: "Corolla (E210)", year: "2019-2024", engine: "1.6 бензин", category: "Электрика", name: "Датчик кислорода (лямбда-зонд)", oem: "89467-02210", brand: "Denso", inStock: true },
    { make: "Toyota", model: "Corolla (E210)", year: "2019-2024", engine: "1.6 бензин", category: "Двигатель", name: "Прокладка ГБЦ", oem: "11101-0T010", brand: "Toyota", inStock: false },

    // ========== BMW (дополнения) ==========
    // X3
    { make: "BMW", model: "X3 (G01)", year: "2018-2024", engine: "2.0 бензин (xDrive30i)", category: "Тормозная система", name: "Колодки тормозные передние", oem: "34116879240", brand: "Textar", inStock: true },
    { make: "BMW", model: "X3 (G01)", year: "2018-2024", engine: "2.0 бензин (xDrive30i)", category: "Тормозная система", name: "Колодки тормозные задние", oem: "34116879241", brand: "Textar", inStock: true },
    { make: "BMW", model: "X3 (G01)", year: "2018-2024", engine: "2.0 бензин (xDrive30i)", category: "Фильтры", name: "Масляный фильтр", oem: "11428507683", brand: "BMW", inStock: true },
    { make: "BMW", model: "X3 (G01)", year: "2018-2024", engine: "2.0 бензин (xDrive30i)", category: "Фильтры", name: "Воздушный фильтр двигателя", oem: "13718604229", brand: "BMW", inStock: true },
    { make: "BMW", model: "X3 (G01)", year: "2018-2024", engine: "2.0 бензин (xDrive30i)", category: "Фильтры", name: "Салонный фильтр", oem: "64319361503", brand: "BMW", inStock: true },
    { make: "BMW", model: "X3 (G01)", year: "2018-2024", engine: "2.0 бензин (xDrive30i)", category: "Подвеска", name: "Амортизатор передний", oem: "37106892745", brand: "Sachs", inStock: false },
    { make: "BMW", model: "X3 (G01)", year: "2018-2024", engine: "2.0 бензин (xDrive30i)", category: "Подвеска", name: "Стойка стабилизатора передняя", oem: "31356861821", brand: "BMW", inStock: true },
    { make: "BMW", model: "X3 (G01)", year: "2018-2024", engine: "2.0 бензин (xDrive30i)", category: "Электрика", name: "Свечи зажигания (комплект)", oem: "12218648939", brand: "NGK", inStock: true },

    // Дополнительные детали для 3 Series
    { make: "BMW", model: "3 Series (G20)", year: "2019-2024", engine: "2.0 бензин (320i)", category: "Двигатель", name: "Цепь ГРМ", oem: "11318685095", brand: "BMW", inStock: true },
    { make: "BMW", model: "3 Series (G20)", year: "2019-2024", engine: "2.0 бензин (320i)", category: "Подвеска", name: "Подшипник ступицы передний", oem: "31206892745", brand: "SKF", inStock: true },
    { make: "BMW", model: "3 Series (G20)", year: "2019-2024", engine: "2.0 бензин (320i)", category: "Электрика", name: "Датчик кислорода (лямбда-зонд)", oem: "11788648939", brand: "Bosch", inStock: true },
    { make: "BMW", model: "3 Series (G20)", year: "2019-2024", engine: "2.0 бензин (320i)", category: "Охлаждение", name: "Радиатор охлаждения", oem: "17118634549", brand: "Mahle", inStock: false },
    { make: "BMW", model: "3 Series (G20)", year: "2019-2024", engine: "2.0 бензин (320i)", category: "Двигатель", name: "Прокладка клапанной крышки", oem: "11128634549", brand: "BMW", inStock: true },

    // Дополнительные детали для X5
    { make: "BMW", model: "X5 (G05)", year: "2019-2024", engine: "3.0 бензин (xDrive40i)", category: "Подвеска", name: "Подшипник ступицы передний", oem: "31206892745", brand: "SKF", inStock: true },
    { make: "BMW", model: "X5 (G05)", year: "2019-2024", engine: "3.0 бензин (xDrive40i)", category: "Электрика", name: "Датчик кислорода (лямбда-зонд)", oem: "11788648939", brand: "Bosch", inStock: true },
    { make: "BMW", model: "X5 (G05)", year: "2019-2024", engine: "3.0 бензин (xDrive40i)", category: "Охлаждение", name: "Помпа водяная", oem: "11518634549", brand: "Mahle", inStock: true },

    // ========== MERCEDES (дополнения) ==========
    // GLE
    { make: "Mercedes", model: "GLE (W167)", year: "2019-2024", engine: "3.0 бензин (GLE450)", category: "Тормозная система", name: "Колодки тормозные передние", oem: "0004208907", brand: "Mercedes-Benz", inStock: true },
    { make: "Mercedes", model: "GLE (W167)", year: "2019-2024", engine: "3.0 бензин (GLE450)", category: "Тормозная система", name: "Колодки тормозные задние", oem: "0004209407", brand: "Mercedes-Benz", inStock: true },
    { make: "Mercedes", model: "GLE (W167)", year: "2019-2024", engine: "3.0 бензин (GLE450)", category: "Фильтры", name: "Масляный фильтр", oem: "0001801109", brand: "Mercedes-Benz", inStock: true },
    { make: "Mercedes", model: "GLE (W167)", year: "2019-2024", engine: "3.0 бензин (GLE450)", category: "Фильтры", name: "Воздушный фильтр", oem: "0001803600", brand: "Mercedes-Benz", inStock: true },
    { make: "Mercedes", model: "GLE (W167)", year: "2019-2024", engine: "3.0 бензин (GLE450)", category: "Фильтры", name: "Салонный фильтр", oem: "0008305200", brand: "MANN-FILTER", inStock: true },

    // Дополнительные детали для C-Class
    { make: "Mercedes", model: "C-Class (W206)", year: "2021-2024", engine: "1.5 бензин (C200)", category: "Подвеска", name: "Подшипник ступицы передний", oem: "2233300013", brand: "SKF", inStock: true },
    { make: "Mercedes", model: "C-Class (W206)", year: "2021-2024", engine: "1.5 бензин (C200)", category: "Электрика", name: "Свечи зажигания (комплект)", oem: "0041595803", brand: "Bosch", inStock: true },
    { make: "Mercedes", model: "C-Class (W206)", year: "2021-2024", engine: "1.5 бензин (C200)", category: "Охлаждение", name: "Термостат", oem: "0002030504", brand: "Mahle", inStock: true },
    { make: "Mercedes", model: "C-Class (W206)", year: "2021-2024", engine: "1.5 бензин (C200)", category: "Двигатель", name: "Ремень поликлиновой", oem: "0009931596", brand: "Continental", inStock: true },

    // ========== VOLKSWAGEN (дополнения) ==========
    // Touareg III
    { make: "Volkswagen", model: "Touareg III", year: "2018-2024", engine: "3.0 TSI бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "5Q0698151F", brand: "Textar", inStock: true },
    { make: "Volkswagen", model: "Touareg III", year: "2018-2024", engine: "3.0 TSI бензин", category: "Фильтры", name: "Масляный фильтр", oem: "06J115403Q", brand: "VAG", inStock: true },
    { make: "Volkswagen", model: "Touareg III", year: "2018-2024", engine: "3.0 TSI бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "5Q0129620B", brand: "VAG", inStock: true },
    { make: "Volkswagen", model: "Touareg III", year: "2018-2024", engine: "3.0 TSI бензин", category: "Фильтры", name: "Салонный фильтр", oem: "5Q0819439B", brand: "VAG", inStock: true },
    { make: "Volkswagen", model: "Touareg III", year: "2018-2024", engine: "3.0 TSI бензин", category: "Подвеска", name: "Амортизатор передний", oem: "5Q0413031DP", brand: "Sachs", inStock: false },
    { make: "Volkswagen", model: "Touareg III", year: "2018-2024", engine: "3.0 TDI дизель", category: "Фильтры", name: "Масляный фильтр", oem: "04L115466K", brand: "VAG", inStock: true },

    // Golf VIII
    { make: "Volkswagen", model: "Golf VIII", year: "2020-2024", engine: "1.4 TSI бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "5Q0698151F", brand: "Textar", inStock: true },
    { make: "Volkswagen", model: "Golf VIII", year: "2020-2024", engine: "1.4 TSI бензин", category: "Фильтры", name: "Масляный фильтр", oem: "06J115403Q", brand: "VAG", inStock: true },
    { make: "Volkswagen", model: "Golf VIII", year: "2020-2024", engine: "1.4 TSI бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "5Q0129620B", brand: "VAG", inStock: true },
    { make: "Volkswagen", model: "Golf VIII", year: "2020-2024", engine: "1.4 TSI бензин", category: "Фильтры", name: "Салонный фильтр", oem: "5Q0819439B", brand: "VAG", inStock: true },
    { make: "Volkswagen", model: "Golf VIII", year: "2020-2024", engine: "1.4 TSI бензин", category: "Электрика", name: "Свечи зажигания (комплект)", oem: "06K905601A", brand: "NGK", inStock: true },

    // Дополнительные детали для Passat
    { make: "Volkswagen", model: "Passat B8", year: "2015-2023", engine: "2.0 TSI бензин", category: "Двигатель", name: "Цепь ГРМ", oem: "06K109158J", brand: "VAG", inStock: true },
    { make: "Volkswagen", model: "Passat B8", year: "2015-2023", engine: "2.0 TSI бензин", category: "Подвеска", name: "Подшипник ступицы передний", oem: "5Q0407621J", brand: "SKF", inStock: true },
    { make: "Volkswagen", model: "Passat B8", year: "2015-2023", engine: "2.0 TSI бензин", category: "Электрика", name: "Датчик кислорода (лямбда-зонд)", oem: "06K906262K", brand: "Bosch", inStock: true },
    { make: "Volkswagen", model: "Passat B8", year: "2015-2023", engine: "2.0 TSI бензин", category: "Охлаждение", name: "Радиатор охлаждения", oem: "5Q0121251P", brand: "VAG", inStock: false },
    { make: "Volkswagen", model: "Passat B8", year: "2015-2023", engine: "2.0 TDI дизель", category: "Подвеска", name: "Подшипник ступицы задний", oem: "5Q0501611E", brand: "SKF", inStock: true },

    // Дополнительные детали для Tiguan
    { make: "Volkswagen", model: "Tiguan II", year: "2016-2024", engine: "2.0 TSI бензин", category: "Двигатель", name: "Цепь ГРМ", oem: "06K109158J", brand: "VAG", inStock: true },
    { make: "Volkswagen", model: "Tiguan II", year: "2016-2024", engine: "2.0 TSI бензин", category: "Подвеска", name: "Подшипник ступицы передний", oem: "5Q0407621J", brand: "SKF", inStock: true },
    { make: "Volkswagen", model: "Tiguan II", year: "2016-2024", engine: "2.0 TSI бензин", category: "Охлаждение", name: "Помпа водяная", oem: "06K121600D", brand: "VAG", inStock: true },

    // ========== HYUNDAI (дополнения) ==========
    // Santa Fe
    { make: "Hyundai", model: "Santa Fe (TM)", year: "2018-2024", engine: "2.2 CRDi дизель", category: "Тормозная система", name: "Колодки тормозные передние", oem: "58101-B8000", brand: "Hyundai", inStock: true },
    { make: "Hyundai", model: "Santa Fe (TM)", year: "2018-2024", engine: "2.2 CRDi дизель", category: "Тормозная система", name: "Колодки тормозные задние", oem: "58102-B8000", brand: "Hyundai", inStock: true },
    { make: "Hyundai", model: "Santa Fe (TM)", year: "2018-2024", engine: "2.2 CRDi дизель", category: "Фильтры", name: "Масляный фильтр", oem: "26300-35530", brand: "Hyundai", inStock: true },
    { make: "Hyundai", model: "Santa Fe (TM)", year: "2018-2024", engine: "2.2 CRDi дизель", category: "Фильтры", name: "Воздушный фильтр", oem: "28113-B8000", brand: "Hyundai", inStock: true },
    { make: "Hyundai", model: "Santa Fe (TM)", year: "2018-2024", engine: "2.2 CRDi дизель", category: "Фильтры", name: "Салонный фильтр", oem: "97133-B8000", brand: "Hyundai", inStock: true },
    { make: "Hyundai", model: "Santa Fe (TM)", year: "2018-2024", engine: "2.2 CRDi дизель", category: "Фильтры", name: "Топливный фильтр", oem: "31922-2F000", brand: "Hyundai", inStock: true },

    // Elantra
    { make: "Hyundai", model: "Elantra (CN7)", year: "2021-2024", engine: "2.0 бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "58101-L5A10", brand: "Hyundai", inStock: true },
    { make: "Hyundai", model: "Elantra (CN7)", year: "2021-2024", engine: "2.0 бензин", category: "Фильтры", name: "Масляный фильтр", oem: "26300-35530", brand: "Hyundai", inStock: true },
    { make: "Hyundai", model: "Elantra (CN7)", year: "2021-2024", engine: "2.0 бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "28113-L1000", brand: "Hyundai", inStock: true },
    { make: "Hyundai", model: "Elantra (CN7)", year: "2021-2024", engine: "2.0 бензин", category: "Фильтры", name: "Салонный фильтр", oem: "97133-L1000", brand: "Hyundai", inStock: true },
    { make: "Hyundai", model: "Elantra (CN7)", year: "2021-2024", engine: "1.6 T-GDI бензин", category: "Тормозная система", name: "Диски тормозные передние", oem: "51712-L2000", brand: "Hyundai", inStock: true },

    // Дополнительные детали для Sonata & Tucson
    { make: "Hyundai", model: "Sonata (DN8)", year: "2020-2024", engine: "2.0 бензин", category: "Двигатель", name: "Ремень ГРМ (цепь)", oem: "24321-2G100", brand: "Hyundai", inStock: true },
    { make: "Hyundai", model: "Sonata (DN8)", year: "2020-2024", engine: "2.0 бензин", category: "Подвеска", name: "Подшипник ступицы передний", oem: "51750-L1000", brand: "SKF", inStock: true },
    { make: "Hyundai", model: "Tucson (NX4)", year: "2021-2024", engine: "1.6 T-GDI бензин", category: "Двигатель", name: "Цепь ГРМ", oem: "24321-2G100", brand: "Hyundai", inStock: true },
    { make: "Hyundai", model: "Tucson (NX4)", year: "2021-2024", engine: "1.6 T-GDI бензин", category: "Подвеска", name: "Подшипник ступицы передний", oem: "51750-N9000", brand: "SKF", inStock: true },
    { make: "Hyundai", model: "Tucson (NX4)", year: "2021-2024", engine: "1.6 T-GDI бензин", category: "Электрика", name: "Датчик кислорода (лямбда-зонд)", oem: "39210-2G100", brand: "Bosch", inStock: true },

    // ========== KIA (дополнения) ==========
    // Seltos
    { make: "Kia", model: "Seltos (SP2)", year: "2020-2024", engine: "2.0 бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "58101-L5A10", brand: "Kia", inStock: true },
    { make: "Kia", model: "Seltos (SP2)", year: "2020-2024", engine: "2.0 бензин", category: "Фильтры", name: "Масляный фильтр", oem: "26300-35530", brand: "Kia", inStock: true },
    { make: "Kia", model: "Seltos (SP2)", year: "2020-2024", engine: "2.0 бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "28113-L1000", brand: "Kia", inStock: true },
    { make: "Kia", model: "Seltos (SP2)", year: "2020-2024", engine: "2.0 бензин", category: "Фильтры", name: "Салонный фильтр", oem: "97133-L1000", brand: "Kia", inStock: true },
    { make: "Kia", model: "Seltos (SP2)", year: "2020-2024", engine: "1.6 T-GDI бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "58101-N9000", brand: "Kia", inStock: true },

    // Sorento
    { make: "Kia", model: "Sorento (MQ4)", year: "2021-2024", engine: "2.5 T-GDI бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "58101-P2000", brand: "Kia", inStock: true },
    { make: "Kia", model: "Sorento (MQ4)", year: "2021-2024", engine: "2.5 T-GDI бензин", category: "Тормозная система", name: "Колодки тормозные задние", oem: "58102-P2000", brand: "Kia", inStock: true },
    { make: "Kia", model: "Sorento (MQ4)", year: "2021-2024", engine: "2.5 T-GDI бензин", category: "Фильтры", name: "Масляный фильтр", oem: "26300-35530", brand: "Kia", inStock: true },
    { make: "Kia", model: "Sorento (MQ4)", year: "2021-2024", engine: "2.5 T-GDI бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "28113-P2000", brand: "Kia", inStock: true },
    { make: "Kia", model: "Sorento (MQ4)", year: "2021-2024", engine: "2.5 T-GDI бензин", category: "Фильтры", name: "Салонный фильтр", oem: "97133-P2000", brand: "Kia", inStock: true },

    // Cerato
    { make: "Kia", model: "Cerato (BD)", year: "2019-2024", engine: "2.0 бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "58101-L5A10", brand: "Kia", inStock: true },
    { make: "Kia", model: "Cerato (BD)", year: "2019-2024", engine: "2.0 бензин", category: "Фильтры", name: "Масляный фильтр", oem: "26300-35530", brand: "Kia", inStock: true },
    { make: "Kia", model: "Cerato (BD)", year: "2019-2024", engine: "2.0 бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "28113-L1000", brand: "Kia", inStock: true },
    { make: "Kia", model: "Cerato (BD)", year: "2019-2024", engine: "2.0 бензин", category: "Фильтры", name: "Салонный фильтр", oem: "97133-L1000", brand: "Kia", inStock: true },

    // Дополнительные детали для K5, Sportage
    { make: "Kia", model: "K5 (DL3)", year: "2020-2024", engine: "2.0 бензин", category: "Подвеска", name: "Подшипник ступицы передний", oem: "51750-L1000", brand: "SKF", inStock: true },
    { make: "Kia", model: "K5 (DL3)", year: "2020-2024", engine: "2.5 бензин", category: "Двигатель", name: "Цепь ГРМ", oem: "24321-2G100", brand: "Kia", inStock: true },
    { make: "Kia", model: "Sportage (NQ5)", year: "2022-2024", engine: "2.0 бензин", category: "Подвеска", name: "Подшипник ступицы передний", oem: "51750-N9000", brand: "SKF", inStock: true },
    { make: "Kia", model: "Sportage (NQ5)", year: "2022-2024", engine: "1.6 T-GDI бензин", category: "Подвеска", name: "Амортизатор задний", oem: "55350-N9000", brand: "Hyundai", inStock: false },
    { make: "Kia", model: "Rio (YB)", year: "2017-2023", engine: "1.6 бензин", category: "Подвеска", name: "Стойка стабилизатора передняя", oem: "54830-R1000", brand: "Kia", inStock: true },

    // ========== FORD (дополнения) ==========
    // Explorer
    { make: "Ford", model: "Explorer VI", year: "2020-2024", engine: "2.3 EcoBoost бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "2181763", brand: "Ford", inStock: true },
    { make: "Ford", model: "Explorer VI", year: "2020-2024", engine: "2.3 EcoBoost бензин", category: "Фильтры", name: "Масляный фильтр", oem: "1896233", brand: "Ford", inStock: true },
    { make: "Ford", model: "Explorer VI", year: "2020-2024", engine: "2.3 EcoBoost бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "2180592", brand: "Ford", inStock: true },
    { make: "Ford", model: "Explorer VI", year: "2020-2024", engine: "2.3 EcoBoost бензин", category: "Фильтры", name: "Салонный фильтр", oem: "2196941", brand: "Ford", inStock: true },
    { make: "Ford", model: "Explorer VI", year: "2020-2024", engine: "2.3 EcoBoost бензин", category: "Подвеска", name: "Амортизатор передний", oem: "2475658", brand: "Ford", inStock: false },

    // Дополнительные детали для Focus, Kuga
    { make: "Ford", model: "Focus IV", year: "2018-2024", engine: "1.5 EcoBoost бензин", category: "Подвеска", name: "Подшипник ступицы передний", oem: "2392163", brand: "SKF", inStock: true },
    { make: "Ford", model: "Focus IV", year: "2018-2024", engine: "1.5 EcoBoost бензин", category: "Электрика", name: "Свечи зажигания (комплект)", oem: "1755677", brand: "NGK", inStock: true },
    { make: "Ford", model: "Focus IV", year: "2018-2024", engine: "1.5 EcoBoost бензин", category: "Охлаждение", name: "Термостат", oem: "1238103", brand: "Mahle", inStock: true },
    { make: "Ford", model: "Kuga III", year: "2021-2024", engine: "2.5 бензин гибрид", category: "Подвеска", name: "Подшипник ступицы передний", oem: "2392163", brand: "SKF", inStock: true },
    { make: "Ford", model: "Kuga III", year: "2021-2024", engine: "2.5 бензин гибрид", category: "Электрика", name: "Свечи зажигания (комплект)", oem: "1755677", brand: "NGK", inStock: true },

    // ========== NISSAN (дополнения) ==========
    // Murano
    { make: "Nissan", model: "Murano Z52", year: "2015-2024", engine: "3.5 бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "D1060-1BA0A", brand: "Nissan", inStock: true },
    { make: "Nissan", model: "Murano Z52", year: "2015-2024", engine: "3.5 бензин", category: "Фильтры", name: "Масляный фильтр", oem: "15208-65V0A", brand: "Nissan", inStock: true },
    { make: "Nissan", model: "Murano Z52", year: "2015-2024", engine: "3.5 бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "16546-1BA0A", brand: "Nissan", inStock: true },
    { make: "Nissan", model: "Murano Z52", year: "2015-2024", engine: "3.5 бензин", category: "Фильтры", name: "Салонный фильтр", oem: "27273-1BA0A", brand: "Nissan", inStock: true },
    { make: "Nissan", model: "Murano Z52", year: "2015-2024", engine: "3.5 бензин", category: "Электрика", name: "Свечи зажигания (комплект)", oem: "22401-1BA0A", brand: "NGK", inStock: true },

    // Дополнительные детали для Qashqai
    { make: "Nissan", model: "Qashqai J12", year: "2021-2024", engine: "1.3 DIG-T бензин", category: "Подвеска", name: "Подшипник ступицы передний", oem: "40202-JP00C", brand: "SKF", inStock: true },
    { make: "Nissan", model: "Qashqai J12", year: "2021-2024", engine: "1.3 DIG-T бензин", category: "Электрика", name: "Свечи зажигания (комплект)", oem: "22401-JP00A", brand: "NGK", inStock: true },
    { make: "Nissan", model: "Qashqai J12", year: "2021-2024", engine: "1.3 DIG-T бензин", category: "Охлаждение", name: "Помпа водяная", oem: "21010-JP00A", brand: "Aisin", inStock: true },
    { make: "Nissan", model: "X-Trail T33", year: "2022-2024", engine: "2.0 бензин", category: "Подвеска", name: "Подшипник ступицы передний", oem: "40202-JP00C", brand: "SKF", inStock: true },

    // ========== MAZDA (дополнения) ==========
    // CX-30
    { make: "Mazda", model: "CX-30 (DM)", year: "2020-2024", engine: "2.0 SkyActiv бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "KDY0-26-38Z", brand: "Mazda", inStock: true },
    { make: "Mazda", model: "CX-30 (DM)", year: "2020-2024", engine: "2.0 SkyActiv бензин", category: "Фильтры", name: "Масляный фильтр", oem: "WLY7-14-302", brand: "Mazda", inStock: true },
    { make: "Mazda", model: "CX-30 (DM)", year: "2020-2024", engine: "2.0 SkyActiv бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "KDY0-13-Z40", brand: "Mazda", inStock: true },
    { make: "Mazda", model: "CX-30 (DM)", year: "2020-2024", engine: "2.0 SkyActiv бензин", category: "Фильтры", name: "Салонный фильтр", oem: "KDY0-61-J6X", brand: "Mazda", inStock: true },
    { make: "Mazda", model: "CX-30 (DM)", year: "2020-2024", engine: "2.0 SkyActiv бензин", category: "Электрика", name: "Свечи зажигания (комплект)", oem: "PE01-18-110", brand: "NGK", inStock: true },

    // Mazda3
    { make: "Mazda", model: "Mazda3 (BP)", year: "2019-2024", engine: "2.0 SkyActiv бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "KDY0-26-38Z", brand: "Mazda", inStock: true },
    { make: "Mazda", model: "Mazda3 (BP)", year: "2019-2024", engine: "2.0 SkyActiv бензин", category: "Фильтры", name: "Масляный фильтр", oem: "WLY7-14-302", brand: "Mazda", inStock: true },
    { make: "Mazda", model: "Mazda3 (BP)", year: "2019-2024", engine: "2.0 SkyActiv бензин", category: "Фильтры", name: "Салонный фильтр", oem: "KDY0-61-J6X", brand: "Mazda", inStock: true },

    // Дополнительные детали для CX-5, Mazda6
    { make: "Mazda", model: "CX-5 (KF)", year: "2017-2024", engine: "2.0 SkyActiv бензин", category: "Подвеска", name: "Подшипник ступицы передний", oem: "KDY0-26-37Z", brand: "SKF", inStock: true },
    { make: "Mazda", model: "CX-5 (KF)", year: "2017-2024", engine: "2.0 SkyActiv бензин", category: "Охлаждение", name: "Термостат", oem: "PE01-15-171", brand: "Mahle", inStock: true },
    { make: "Mazda", model: "Mazda6 (GJ)", year: "2013-2024", engine: "2.0 SkyActiv бензин", category: "Подвеска", name: "Подшипник ступицы передний", oem: "GJYA-26-37Z", brand: "SKF", inStock: true },
    { make: "Mazda", model: "Mazda6 (GJ)", year: "2013-2024", engine: "2.0 SkyActiv бензин", category: "Электрика", name: "Свечи зажигания (комплект)", oem: "PE01-18-110", brand: "NGK", inStock: true },

    // ========== SKODA (дополнения) ==========
    // Rapid
    { make: "Skoda", model: "Rapid", year: "2012-2024", engine: "1.6 бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "5Q0698151F", brand: "Textar", inStock: true },
    { make: "Skoda", model: "Rapid", year: "2012-2024", engine: "1.6 бензин", category: "Фильтры", name: "Масляный фильтр", oem: "06J115403Q", brand: "VAG", inStock: true },
    { make: "Skoda", model: "Rapid", year: "2012-2024", engine: "1.6 бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "5Q0129620B", brand: "VAG", inStock: true },
    { make: "Skoda", model: "Rapid", year: "2012-2024", engine: "1.6 бензин", category: "Фильтры", name: "Салонный фильтр", oem: "5Q0819439B", brand: "VAG", inStock: true },

    // Superb
    { make: "Skoda", model: "Superb III", year: "2015-2024", engine: "2.0 TSI бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "5Q0698151F", brand: "Textar", inStock: true },
    { make: "Skoda", model: "Superb III", year: "2015-2024", engine: "2.0 TSI бензин", category: "Тормозная система", name: "Колодки тормозные задние", oem: "5Q0698451G", brand: "Textar", inStock: true },
    { make: "Skoda", model: "Superb III", year: "2015-2024", engine: "2.0 TSI бензин", category: "Фильтры", name: "Масляный фильтр", oem: "06J115403Q", brand: "VAG", inStock: true },
    { make: "Skoda", model: "Superb III", year: "2015-2024", engine: "2.0 TSI бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "5Q0129620B", brand: "VAG", inStock: true },
    { make: "Skoda", model: "Superb III", year: "2015-2024", engine: "2.0 TSI бензин", category: "Фильтры", name: "Салонный фильтр", oem: "5Q0819439B", brand: "VAG", inStock: true },
    { make: "Skoda", model: "Superb III", year: "2015-2024", engine: "2.0 TSI бензин", category: "Электрика", name: "Свечи зажигания (комплект)", oem: "06K905601A", brand: "NGK", inStock: true },

    // Дополнительные детали для Octavia, Kodiaq
    { make: "Skoda", model: "Octavia A8", year: "2020-2024", engine: "1.4 TSI бензин", category: "Подвеска", name: "Подшипник ступицы передний", oem: "5Q0407621J", brand: "SKF", inStock: true },
    { make: "Skoda", model: "Octavia A8", year: "2020-2024", engine: "1.4 TSI бензин", category: "Двигатель", name: "Цепь ГРМ", oem: "06K109158J", brand: "VAG", inStock: true },
    { make: "Skoda", model: "Kodiaq", year: "2017-2024", engine: "2.0 TSI бензин", category: "Подвеска", name: "Подшипник ступицы передний", oem: "5Q0407621J", brand: "SKF", inStock: true },
    { make: "Skoda", model: "Kodiaq", year: "2017-2024", engine: "2.0 TSI бензин", category: "Электрика", name: "Свечи зажигания (комплект)", oem: "06K905601A", brand: "NGK", inStock: true },

    // ========== AUDI (дополнения) ==========
    // Q3
    { make: "Audi", model: "Q3 (F3)", year: "2019-2024", engine: "2.0 TFSI бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "5Q0698151F", brand: "Textar", inStock: true },
    { make: "Audi", model: "Q3 (F3)", year: "2019-2024", engine: "2.0 TFSI бензин", category: "Фильтры", name: "Масляный фильтр", oem: "06J115403Q", brand: "VAG", inStock: true },
    { make: "Audi", model: "Q3 (F3)", year: "2019-2024", engine: "2.0 TFSI бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "5Q0129620B", brand: "VAG", inStock: true },
    { make: "Audi", model: "Q3 (F3)", year: "2019-2024", engine: "2.0 TFSI бензин", category: "Фильтры", name: "Салонный фильтр", oem: "5Q0819439B", brand: "VAG", inStock: true },

    // Q7
    { make: "Audi", model: "Q7 (4M)", year: "2015-2024", engine: "3.0 TFSI бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "4M0698151F", brand: "Textar", inStock: true },
    { make: "Audi", model: "Q7 (4M)", year: "2015-2024", engine: "3.0 TFSI бензин", category: "Фильтры", name: "Масляный фильтр", oem: "06J115403Q", brand: "VAG", inStock: true },
    { make: "Audi", model: "Q7 (4M)", year: "2015-2024", engine: "3.0 TFSI бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "4M0129620A", brand: "VAG", inStock: true },
    { make: "Audi", model: "Q7 (4M)", year: "2015-2024", engine: "3.0 TFSI бензин", category: "Фильтры", name: "Салонный фильтр", oem: "4M0819439", brand: "VAG", inStock: true },

    // Дополнительные детали для A4, A6, Q5
    { make: "Audi", model: "A4 (B9)", year: "2016-2024", engine: "2.0 TFSI бензин", category: "Подвеска", name: "Подшипник ступицы передний", oem: "8W0407621B", brand: "SKF", inStock: true },
    { make: "Audi", model: "A4 (B9)", year: "2016-2024", engine: "2.0 TFSI бензин", category: "Двигатель", name: "Цепь ГРМ", oem: "06K109158J", brand: "VAG", inStock: true },
    { make: "Audi", model: "A6 (C8)", year: "2018-2024", engine: "3.0 TFSI бензин", category: "Подвеска", name: "Подшипник ступицы передний", oem: "4K0407621B", brand: "SKF", inStock: true },
    { make: "Audi", model: "Q5 (80A)", year: "2018-2024", engine: "2.0 TFSI бензин", category: "Подвеска", name: "Подшипник ступицы передний", oem: "80A407621", brand: "SKF", inStock: true },
    { make: "Audi", model: "Q5 (80A)", year: "2018-2024", engine: "2.0 TFSI бензин", category: "Двигатель", name: "Цепь ГРМ", oem: "06K109158J", brand: "VAG", inStock: true },

    // ========== RENAULT (дополнения) ==========
    // Arkana
    { make: "Renault", model: "Arkana", year: "2020-2024", engine: "1.3 TCe бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "41060-6483R", brand: "Renault", inStock: true },
    { make: "Renault", model: "Arkana", year: "2020-2024", engine: "1.3 TCe бензин", category: "Фильтры", name: "Масляный фильтр", oem: "15208-6500R", brand: "Renault", inStock: true },
    { make: "Renault", model: "Arkana", year: "2020-2024", engine: "1.3 TCe бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "16546-6483R", brand: "Renault", inStock: true },
    { make: "Renault", model: "Arkana", year: "2020-2024", engine: "1.3 TCe бензин", category: "Фильтры", name: "Салонный фильтр", oem: "27273-6483R", brand: "Renault", inStock: true },
    { make: "Renault", model: "Arkana", year: "2020-2024", engine: "1.3 TCe бензин", category: "Электрика", name: "Свечи зажигания (комплект)", oem: "22401-6283R", brand: "NGK", inStock: true },
    { make: "Renault", model: "Arkana", year: "2020-2024", engine: "1.6 бензин", category: "Фильтры", name: "Масляный фильтр", oem: "15208-6500R", brand: "Renault", inStock: true },

    // Kaptur
    { make: "Renault", model: "Kaptur", year: "2016-2024", engine: "1.6 бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "41060-9625R", brand: "Renault", inStock: true },
    { make: "Renault", model: "Kaptur", year: "2016-2024", engine: "1.6 бензин", category: "Фильтры", name: "Масляный фильтр", oem: "15208-6500R", brand: "Renault", inStock: true },
    { make: "Renault", model: "Kaptur", year: "2016-2024", engine: "1.6 бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "16546-9625R", brand: "Renault", inStock: true },
    { make: "Renault", model: "Kaptur", year: "2016-2024", engine: "1.6 бензин", category: "Фильтры", name: "Салонный фильтр", oem: "27273-9625R", brand: "Renault", inStock: true },

    // Дополнительные детали для Duster, Logan
    { make: "Renault", model: "Duster II", year: "2021-2024", engine: "1.3 TCe бензин", category: "Подвеска", name: "Подшипник ступицы передний", oem: "40202-6483R", brand: "SKF", inStock: true },
    { make: "Renault", model: "Duster II", year: "2021-2024", engine: "1.3 TCe бензин", category: "Электрика", name: "Свечи зажигания (комплект)", oem: "22401-6483R", brand: "NGK", inStock: true },
    { make: "Renault", model: "Logan II", year: "2015-2024", engine: "1.6 бензин", category: "Подвеска", name: "Амортизатор передний", oem: "56210-9625R", brand: "Renault", inStock: true },

    // ========== LADA (дополнения) ==========
    // Niva Travel
    { make: "Lada", model: "Niva Travel", year: "2021-2024", engine: "1.8 8V бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "21210-3501080", brand: "Lada", inStock: true },
    { make: "Lada", model: "Niva Travel", year: "2021-2024", engine: "1.8 8V бензин", category: "Фильтры", name: "Масляный фильтр", oem: "21080-1012005", brand: "Lada", inStock: true },
    { make: "Lada", model: "Niva Travel", year: "2021-2024", engine: "1.8 8V бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "21210-1109080", brand: "Lada", inStock: true },
    { make: "Lada", model: "Niva Travel", year: "2021-2024", engine: "1.8 8V бензин", category: "Фильтры", name: "Салонный фильтр", oem: "21230-8122010", brand: "Lada", inStock: true },
    { make: "Lada", model: "Niva Travel", year: "2021-2024", engine: "1.8 8V бензин", category: "Подвеска", name: "Амортизатор передний", oem: "21210-2905002", brand: "Lada", inStock: true },

    // XRAY
    { make: "Lada", model: "XRAY", year: "2016-2024", engine: "1.6 16V бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "21110-3501080", brand: "Lada", inStock: true },
    { make: "Lada", model: "XRAY", year: "2016-2024", engine: "1.6 16V бензин", category: "Фильтры", name: "Масляный фильтр", oem: "21080-1012005", brand: "Lada", inStock: true },
    { make: "Lada", model: "XRAY", year: "2016-2024", engine: "1.6 16V бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "21129-1109080", brand: "Lada", inStock: true },
    { make: "Lada", model: "XRAY", year: "2016-2024", engine: "1.6 16V бензин", category: "Фильтры", name: "Салонный фильтр", oem: "21230-8122010", brand: "Lada", inStock: true },

    // Дополнительные детали для Vesta, Granta
    { make: "Lada", model: "Vesta", year: "2015-2024", engine: "1.6 16V бензин", category: "Двигатель", name: "Ремень ГРМ (комплект)", oem: "21116-1006040", brand: "Lada", inStock: true },
    { make: "Lada", model: "Vesta", year: "2015-2024", engine: "1.6 16V бензин", category: "Подвеска", name: "Подшипник ступицы передний", oem: "21210-3103012", brand: "Lada", inStock: true },
    { make: "Lada", model: "Vesta", year: "2015-2024", engine: "1.6 16V бензин", category: "Охлаждение", name: "Помпа водяная", oem: "21120-1307010", brand: "Lada", inStock: true },
    { make: "Lada", model: "Granta", year: "2011-2024", engine: "1.6 8V бензин", category: "Двигатель", name: "Ремень ГРМ", oem: "21080-1006040", brand: "Lada", inStock: true },
    { make: "Lada", model: "Granta", year: "2011-2024", engine: "1.6 8V бензин", category: "Подвеска", name: "Стойка стабилизатора передняя", oem: "21080-2906040", brand: "Lada", inStock: true },
    { make: "Lada", model: "Largus", year: "2012-2024", engine: "1.6 16V бензин", category: "Подвеска", name: "Амортизатор задний", oem: "84500-84500R", brand: "Lada", inStock: true },

    // ========== CHERY (дополнения) ==========
    // Tiggo 5x
    { make: "Chery", model: "Tiggo 5x", year: "2020-2024", engine: "1.5T бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "T15-3501080", brand: "Chery", inStock: true },
    { make: "Chery", model: "Tiggo 5x", year: "2020-2024", engine: "1.5T бензин", category: "Фильтры", name: "Масляный фильтр", oem: "481H-1012010", brand: "Chery", inStock: true },
    { make: "Chery", model: "Tiggo 5x", year: "2020-2024", engine: "1.5T бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "T15-1109110", brand: "Chery", inStock: true },
    { make: "Chery", model: "Tiggo 5x", year: "2020-2024", engine: "1.5T бензин", category: "Фильтры", name: "Салонный фильтр", oem: "T15-8107010", brand: "Chery", inStock: true },
    { make: "Chery", model: "Tiggo 5x", year: "2020-2024", engine: "1.5T бензин", category: "Электрика", name: "Свечи зажигания (комплект)", oem: "F01R-00001", brand: "Chery", inStock: true },

    // Дополнительные детали для Chery
    { make: "Chery", model: "Tiggo 4", year: "2019-2024", engine: "1.5T бензин", category: "Подвеска", name: "Подшипник ступицы передний", oem: "T15-3103015", brand: "Chery", inStock: true },
    { make: "Chery", model: "Tiggo 7 Pro", year: "2020-2024", engine: "1.5T бензин", category: "Подвеска", name: "Подшипник ступицы передний", oem: "T15-3103015", brand: "Chery", inStock: true },
    { make: "Chery", model: "Tiggo 8 Pro", year: "2021-2024", engine: "2.0T бензин", category: "Подвеска", name: "Амортизатор передний", oem: "T18-2905005", brand: "Chery", inStock: false },
    { make: "Chery", model: "Tiggo 8 Pro", year: "2021-2024", engine: "2.0T бензин", category: "Подвеска", name: "Подшипник ступицы передний", oem: "T18-3103015", brand: "Chery", inStock: true },

    // ========== GEELY (дополнения) ==========
    // Tugella
    { make: "Geely", model: "Tugella", year: "2022-2024", engine: "2.0T бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "1019010100", brand: "Geely", inStock: true },
    { make: "Geely", model: "Tugella", year: "2022-2024", engine: "2.0T бензин", category: "Фильтры", name: "Масляный фильтр", oem: "1012010001", brand: "Geely", inStock: true },
    { make: "Geely", model: "Tugella", year: "2022-2024", engine: "2.0T бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "1109110005", brand: "Geely", inStock: true },
    { make: "Geely", model: "Tugella", year: "2022-2024", engine: "2.0T бензин", category: "Фильтры", name: "Салонный фильтр", oem: "8107010001", brand: "Geely", inStock: true },
    { make: "Geely", model: "Tugella", year: "2022-2024", engine: "2.0T бензин", category: "Электрика", name: "Свечи зажигания (комплект)", oem: "F01R-00001", brand: "Geely", inStock: true },

    // Дополнительные детали для Geely
    { make: "Geely", model: "Monjaro", year: "2022-2024", engine: "2.0T бензин", category: "Подвеска", name: "Подшипник ступицы передний", oem: "1019010200", brand: "Geely", inStock: true },
    { make: "Geely", model: "Monjaro", year: "2022-2024", engine: "2.0T бензин", category: "Электрика", name: "Свечи зажигания (комплект)", oem: "F01R-00001", brand: "NGK", inStock: true },
    { make: "Geely", model: "Coolray", year: "2020-2024", engine: "1.5T бензин", category: "Подвеска", name: "Подшипник ступицы передний", oem: "1019010200", brand: "Geely", inStock: true },
    { make: "Geely", model: "Atlas", year: "2018-2024", engine: "2.4 бензин", category: "Фильтры", name: "Салонный фильтр", oem: "8107010001", brand: "Geely", inStock: true },

    // ========== HAVAL (дополнения) ==========
    // Dargo
    { make: "Haval", model: "Dargo", year: "2022-2024", engine: "2.0T бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "3501080X", brand: "Haval", inStock: true },
    { make: "Haval", model: "Dargo", year: "2022-2024", engine: "2.0T бензин", category: "Фильтры", name: "Масляный фильтр", oem: "1012000X", brand: "Haval", inStock: true },
    { make: "Haval", model: "Dargo", year: "2022-2024", engine: "2.0T бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "1109000X", brand: "Haval", inStock: true },
    { make: "Haval", model: "Dargo", year: "2022-2024", engine: "2.0T бензин", category: "Фильтры", name: "Салонный фильтр", oem: "8107000X", brand: "Haval", inStock: true },
    { make: "Haval", model: "Dargo", year: "2022-2024", engine: "2.0T бензин", category: "Подвеска", name: "Амортизатор передний", oem: "2905000X", brand: "Haval", inStock: false },

    // Дополнительные детали для Haval
    { make: "Haval", model: "Jolion", year: "2021-2024", engine: "1.5T бензин", category: "Подвеска", name: "Подшипник ступицы передний", oem: "3103015X", brand: "Haval", inStock: true },
    { make: "Haval", model: "Jolion", year: "2021-2024", engine: "1.5T бензин", category: "Электрика", name: "Свечи зажигания (комплект)", oem: "F01R-00001", brand: "NGK", inStock: true },
    { make: "Haval", model: "F7", year: "2019-2024", engine: "2.0T бензин", category: "Подвеска", name: "Подшипник ступицы передний", oem: "3103015X", brand: "Haval", inStock: true },
    { make: "Haval", model: "F7", year: "2019-2024", engine: "2.0T бензин", category: "Электрика", name: "Свечи зажигания (комплект)", oem: "F01R-00001", brand: "NGK", inStock: true },

    // ========== EXEED (дополнения) ==========
    { make: "Exeed", model: "LX", year: "2020-2024", engine: "1.5T бензин", category: "Подвеска", name: "Подшипник ступицы передний", oem: "EXD-3103015", brand: "Exeed", inStock: true },
    { make: "Exeed", model: "TXL", year: "2021-2024", engine: "2.0T бензин", category: "Подвеска", name: "Подшипник ступицы передний", oem: "EXD-3103015", brand: "Exeed", inStock: true },
    { make: "Exeed", model: "TXL", year: "2021-2024", engine: "2.0T бензин", category: "Электрика", name: "Свечи зажигания (комплект)", oem: "EXD-F01R", brand: "NGK", inStock: true },
    { make: "Exeed", model: "VX", year: "2021-2024", engine: "2.0T бензин", category: "Подвеска", name: "Подшипник ступицы передний", oem: "EXD-3103015", brand: "Exeed", inStock: true },
    { make: "Exeed", model: "VX", year: "2021-2024", engine: "2.0T бензин", category: "Электрика", name: "Датчик кислорода (лямбда-зонд)", oem: "EXD-89467", brand: "Bosch", inStock: true },

    // ========== OMODA (новый бренд) ==========
    { make: "Omoda", model: "C5", year: "2023-2024", engine: "1.5T бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "OMD-3501080", brand: "Omoda", inStock: true },
    { make: "Omoda", model: "C5", year: "2023-2024", engine: "1.5T бензин", category: "Тормозная система", name: "Колодки тормозные задние", oem: "OMD-3501090", brand: "Omoda", inStock: true },
    { make: "Omoda", model: "C5", year: "2023-2024", engine: "1.5T бензин", category: "Фильтры", name: "Масляный фильтр", oem: "OMD-1012000", brand: "Omoda", inStock: true },
    { make: "Omoda", model: "C5", year: "2023-2024", engine: "1.5T бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "OMD-1109000", brand: "Omoda", inStock: true },
    { make: "Omoda", model: "C5", year: "2023-2024", engine: "1.5T бензин", category: "Фильтры", name: "Салонный фильтр", oem: "OMD-8107000", brand: "Omoda", inStock: true },
    { make: "Omoda", model: "C5", year: "2023-2024", engine: "1.5T бензин", category: "Электрика", name: "Свечи зажигания (комплект)", oem: "F01R-00001", brand: "NGK", inStock: true },
    { make: "Omoda", model: "C5", year: "2023-2024", engine: "1.5T бензин", category: "Подвеска", name: "Амортизатор передний", oem: "OMD-2905000", brand: "Omoda", inStock: false },

    // ========== CHANGAN (новый бренд) ==========
    { make: "Changan", model: "CS55", year: "2022-2024", engine: "1.5T бензин", category: "Тормозная система", name: "Колодки тормозные передние", oem: "CHA-3501080", brand: "Changan", inStock: true },
    { make: "Changan", model: "CS55", year: "2022-2024", engine: "1.5T бензин", category: "Тормозная система", name: "Колодки тормозные задние", oem: "CHA-3501090", brand: "Changan", inStock: true },
    { make: "Changan", model: "CS55", year: "2022-2024", engine: "1.5T бензин", category: "Фильтры", name: "Масляный фильтр", oem: "CHA-1012000", brand: "Changan", inStock: true },
    { make: "Changan", model: "CS55", year: "2022-2024", engine: "1.5T бензин", category: "Фильтры", name: "Воздушный фильтр", oem: "CHA-1109000", brand: "Changan", inStock: true },
    { make: "Changan", model: "CS55", year: "2022-2024", engine: "1.5T бензин", category: "Фильтры", name: "Салонный фильтр", oem: "CHA-8107000", brand: "Changan", inStock: true },
    { make: "Changan", model: "CS55", year: "2022-2024", engine: "1.5T бензин", category: "Электрика", name: "Свечи зажигания (комплект)", oem: "F01R-00001", brand: "NGK", inStock: true },
    { make: "Changan", model: "CS55", year: "2022-2024", engine: "1.5T бензин", category: "Подвеска", name: "Подшипник ступицы передний", oem: "CHA-3103015", brand: "Changan", inStock: true },

    // Универсальные — дополнения
    { make: "Universal", model: "Универсальные", year: "—", engine: "—", category: "Масла и жидкости", name: "Масло моторное 10W-40 полусинтетика 4л", oem: "MOB-10W40-4L", brand: "Mobil", inStock: true },
    { make: "Universal", model: "Универсальные", year: "—", engine: "—", category: "Масла и жидкости", name: "Масло трансмиссионное 75W-90 1л", oem: "TRANS-75W90", brand: "Castrol", inStock: true },
    { make: "Universal", model: "Универсальные", year: "—", engine: "—", category: "Масла и жидкости", name: "Антифриз синий (G12+) 5л", oem: "81114-AA540", brand: "Felix", inStock: true },
    { make: "Universal", model: "Универсальные", year: "—", engine: "—", category: "Двигатель", name: "Прокладка ГБЦ универсальная", oem: "GBC-GASKET", brand: "Victor Reinz", inStock: true },
    { make: "Universal", model: "Универсальные", year: "—", engine: "—", category: "Привод", name: "Ремень поликлиновой универсальный", oem: "BELT-6PK-1785", brand: "Continental", inStock: true },
    { make: "Universal", model: "Универсальные", year: "—", engine: "—", category: "Электрика", name: "Лампа головного света H7", oem: "H7-12V55W", brand: "Osram", inStock: true },
    { make: "Universal", model: "Универсальные", year: "—", engine: "—", category: "Электрика", name: "Лампа головного света H4", oem: "H4-12V60W", brand: "Philips", inStock: true },
    { make: "Universal", model: "Универсальные", year: "—", engine: "—", category: "Кузов", name: "Щетки стеклоочистителя бескаркасные 26\"", oem: "WW-26-BF", brand: "Bosch", inStock: true },
    { make: "Universal", model: "Универсальные", year: "—", engine: "—", category: "Кузов", name: "Щетки стеклоочистителя бескаркасные 22\"", oem: "WW-22-BF", brand: "Bosch", inStock: true },

    // ===== НОВЫЕ КАТЕГОРИИ ПО МАРКАМ =====

    // --- Toyota: Рулевое управление, Трансмиссия, Топливная, Зажигание ---
    { make: "Toyota", model: "Camry", year: "2018-2024", engine: "2.5 бензин", category: "Рулевое управление", name: "Наконечник рулевой тяги", oem: "45504-33210", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "Camry", year: "2018-2024", engine: "2.5 бензин", category: "Система зажигания", name: "Катушка зажигания", oem: "90919-02257", brand: "Denso", inStock: true },
    { make: "Toyota", model: "Camry", year: "2018-2024", engine: "2.5 бензин", category: "Топливная система", name: "Топливный насос (бензонасос)", oem: "23221-0T010", brand: "Denso", inStock: false },
    { make: "Toyota", model: "Camry", year: "2018-2024", engine: "2.5 бензин", category: "Трансмиссия", name: "Масло ATF WS 4л", oem: "08886-81510", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "Camry", year: "2018-2024", engine: "2.5 бензин", category: "Электроника", name: "Датчик ABS передний", oem: "89541-33210", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "Camry", year: "2018-2024", engine: "2.5 бензин", category: "Отопление и кондиционирование", name: "Радиатор отопителя (печки)", oem: "87107-33210", brand: "Toyota", inStock: false },

    { make: "Toyota", model: "RAV4", year: "2019-2024", engine: "2.0 бензин", category: "Рулевое управление", name: "Наконечник рулевой тяги", oem: "45504-42030", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "RAV4", year: "2019-2024", engine: "2.0 бензин", category: "Система зажигания", name: "Катушка зажигания", oem: "90919-02257", brand: "Denso", inStock: true },
    { make: "Toyota", model: "RAV4", year: "2019-2024", engine: "2.0 бензин", category: "Топливная система", name: "Топливный фильтр", oem: "23300-0R010", brand: "Toyota", inStock: true },

    { make: "Toyota", model: "Corolla (E210)", year: "2019-2024", engine: "1.6 бензин", category: "Рулевое управление", name: "Наконечник рулевой тяги", oem: "45504-02270", brand: "Toyota", inStock: true },
    { make: "Toyota", model: "Corolla (E210)", year: "2019-2024", engine: "1.6 бензин", category: "Система зажигания", name: "Катушка зажигания", oem: "90919-02257", brand: "Denso", inStock: true },

    // --- BMW: Рулевое управление, Зажигание, Отопление ---
    { make: "BMW", model: "3 Series (G20)", year: "2019-2024", engine: "2.0 бензин (320i)", category: "Рулевое управление", name: "Наконечник рулевой тяги", oem: "32106892745", brand: "BMW", inStock: true },
    { make: "BMW", model: "3 Series (G20)", year: "2019-2024", engine: "2.0 бензин (320i)", category: "Система зажигания", name: "Катушка зажигания", oem: "12138648939", brand: "Bosch", inStock: true },
    { make: "BMW", model: "3 Series (G20)", year: "2019-2024", engine: "2.0 бензин (320i)", category: "Топливная система", name: "Топливный насос (бензонасос)", oem: "16118634549", brand: "Bosch", inStock: false },
    { make: "BMW", model: "3 Series (G20)", year: "2019-2024", engine: "2.0 бензин (320i)", category: "Отопление и кондиционирование", name: "Радиатор отопителя (печки)", oem: "64119361503", brand: "Mahle", inStock: false },

    { make: "BMW", model: "X3 (G01)", year: "2018-2024", engine: "2.0 бензин (xDrive30i)", category: "Рулевое управление", name: "Наконечник рулевой тяги", oem: "32106892745", brand: "BMW", inStock: true },
    { make: "BMW", model: "X3 (G01)", year: "2018-2024", engine: "2.0 бензин (xDrive30i)", category: "Система зажигания", name: "Катушка зажигания", oem: "12138648939", brand: "Bosch", inStock: true },

    // --- Mercedes: Рулевое, Зажигание, Топливная ---
    { make: "Mercedes", model: "C-Class (W206)", year: "2021-2024", engine: "1.5 бензин (C200)", category: "Рулевое управление", name: "Наконечник рулевой тяги", oem: "2233300013", brand: "Mercedes-Benz", inStock: true },
    { make: "Mercedes", model: "C-Class (W206)", year: "2021-2024", engine: "1.5 бензин (C200)", category: "Система зажигания", name: "Катушка зажигания", oem: "0041595803", brand: "Bosch", inStock: true },
    { make: "Mercedes", model: "C-Class (W206)", year: "2021-2024", engine: "1.5 бензин (C200)", category: "Топливная система", name: "Топливный насос (бензонасос)", oem: "0004700504", brand: "Bosch", inStock: false },

    // --- VW: Рулевое, Зажигание, Топливная, Электроника ---
    { make: "Volkswagen", model: "Passat B8", year: "2015-2023", engine: "2.0 TSI бензин", category: "Рулевое управление", name: "Наконечник рулевой тяги", oem: "5Q0423811", brand: "VAG", inStock: true },
    { make: "Volkswagen", model: "Passat B8", year: "2015-2023", engine: "2.0 TSI бензин", category: "Система зажигания", name: "Катушка зажигания", oem: "06K905110D", brand: "Bosch", inStock: true },
    { make: "Volkswagen", model: "Passat B8", year: "2015-2023", engine: "2.0 TSI бензин", category: "Топливная система", name: "Топливный насос высокого давления", oem: "06K127026P", brand: "Bosch", inStock: false },
    { make: "Volkswagen", model: "Passat B8", year: "2015-2023", engine: "2.0 TSI бензин", category: "Электроника", name: "Датчик ABS", oem: "5Q0907379E", brand: "Bosch", inStock: true },
    { make: "Volkswagen", model: "Passat B8", year: "2015-2023", engine: "2.0 TSI бензин", category: "Отопление и кондиционирование", name: "Моторчик отопителя (печки)", oem: "5Q1819021", brand: "VAG", inStock: false },
    { make: "Volkswagen", model: "Passat B8", year: "2015-2023", engine: "2.0 TDI дизель", category: "Топливная система", name: "Форсунка дизельная", oem: "04L130277Q", brand: "Bosch", inStock: false },

    { make: "Volkswagen", model: "Tiguan II", year: "2016-2024", engine: "2.0 TSI бензин", category: "Рулевое управление", name: "Наконечник рулевой тяги", oem: "5Q0423811", brand: "VAG", inStock: true },
    { make: "Volkswagen", model: "Tiguan II", year: "2016-2024", engine: "2.0 TSI бензин", category: "Система зажигания", name: "Катушка зажигания", oem: "06K905110D", brand: "Bosch", inStock: true },

    // --- Hyundai: Рулевое, Зажигание, Топливная, Электроника ---
    { make: "Hyundai", model: "Sonata (DN8)", year: "2020-2024", engine: "2.0 бензин", category: "Рулевое управление", name: "Наконечник рулевой тяги", oem: "56820-L1000", brand: "Hyundai", inStock: true },
    { make: "Hyundai", model: "Sonata (DN8)", year: "2020-2024", engine: "2.0 бензин", category: "Система зажигания", name: "Катушка зажигания", oem: "27301-2G100", brand: "Hyundai", inStock: true },
    { make: "Hyundai", model: "Sonata (DN8)", year: "2020-2024", engine: "2.0 бензин", category: "Топливная система", name: "Топливный насос (бензонасос)", oem: "31110-L1000", brand: "Hyundai", inStock: false },
    { make: "Hyundai", model: "Sonata (DN8)", year: "2020-2024", engine: "2.0 бензин", category: "Отопление и кондиционирование", name: "Компрессор кондиционера", oem: "97701-L1000", brand: "Hyundai", inStock: false },

    { make: "Hyundai", model: "Tucson (NX4)", year: "2021-2024", engine: "1.6 T-GDI бензин", category: "Рулевое управление", name: "Наконечник рулевой тяги", oem: "56820-N9000", brand: "Hyundai", inStock: true },
    { make: "Hyundai", model: "Tucson (NX4)", year: "2021-2024", engine: "1.6 T-GDI бензин", category: "Система зажигания", name: "Катушка зажигания", oem: "27301-2G100", brand: "Hyundai", inStock: true },

    // --- Kia: Рулевое, Зажигание, Топливная ---
    { make: "Kia", model: "K5 (DL3)", year: "2020-2024", engine: "2.0 бензин", category: "Рулевое управление", name: "Наконечник рулевой тяги", oem: "56820-L1000", brand: "Kia", inStock: true },
    { make: "Kia", model: "K5 (DL3)", year: "2020-2024", engine: "2.0 бензин", category: "Система зажигания", name: "Катушка зажигания", oem: "27301-2G100", brand: "Kia", inStock: true },
    { make: "Kia", model: "K5 (DL3)", year: "2020-2024", engine: "2.0 бензин", category: "Топливная система", name: "Топливный насос (бензонасос)", oem: "31110-L1000", brand: "Kia", inStock: false },

    { make: "Kia", model: "Sportage (NQ5)", year: "2022-2024", engine: "2.0 бензин", category: "Рулевое управление", name: "Наконечник рулевой тяги", oem: "56820-N9000", brand: "Kia", inStock: true },
    { make: "Kia", model: "Sportage (NQ5)", year: "2022-2024", engine: "2.0 бензин", category: "Система зажигания", name: "Катушка зажигания", oem: "27301-2G100", brand: "Kia", inStock: true },

    // --- Lada: Рулевое, Сцепление, Зажигание, Топливная ---
    { make: "Lada", model: "Vesta", year: "2015-2024", engine: "1.6 16V бензин", category: "Рулевое управление", name: "Наконечник рулевой тяги", oem: "21210-3414028", brand: "Lada", inStock: true },
    { make: "Lada", model: "Vesta", year: "2015-2024", engine: "1.6 16V бензин", category: "Трансмиссия", name: "Комплект сцепления", oem: "21900-1601080", brand: "Lada", inStock: true },
    { make: "Lada", model: "Vesta", year: "2015-2024", engine: "1.6 16V бензин", category: "Система зажигания", name: "Катушка зажигания", oem: "21110-3705010", brand: "Lada", inStock: true },
    { make: "Lada", model: "Vesta", year: "2015-2024", engine: "1.6 16V бензин", category: "Топливная система", name: "Топливный насос (бензонасос)", oem: "21900-1139008", brand: "Lada", inStock: false },
    { make: "Lada", model: "Vesta", year: "2015-2024", engine: "1.6 16V бензин", category: "Электроника", name: "Датчик ABS", oem: "21900-3560012", brand: "Lada", inStock: true },

    { make: "Lada", model: "Granta", year: "2011-2024", engine: "1.6 8V бензин", category: "Рулевое управление", name: "Наконечник рулевой тяги", oem: "21080-3414028", brand: "Lada", inStock: true },
    { make: "Lada", model: "Granta", year: "2011-2024", engine: "1.6 8V бензин", category: "Трансмиссия", name: "Комплект сцепления", oem: "21080-1601080", brand: "Lada", inStock: true },
    { make: "Lada", model: "Granta", year: "2011-2024", engine: "1.6 8V бензин", category: "Система зажигания", name: "Катушка зажигания", oem: "21110-3705010", brand: "Lada", inStock: true },
    { make: "Lada", model: "Granta", year: "2011-2024", engine: "1.6 8V бензин", category: "Выхлопная система", name: "Глушитель задний", oem: "21080-1203008", brand: "Lada", inStock: false },

    // --- Renault: Рулевое, Сцепление, Зажигание ---
    { make: "Renault", model: "Duster II", year: "2021-2024", engine: "1.3 TCe бензин", category: "Рулевое управление", name: "Наконечник рулевой тяги", oem: "48520-6483R", brand: "Renault", inStock: true },
    { make: "Renault", model: "Duster II", year: "2021-2024", engine: "1.3 TCe бензин", category: "Трансмиссия", name: "Комплект сцепления", oem: "30205-6483R", brand: "Renault", inStock: true },
    { make: "Renault", model: "Duster II", year: "2021-2024", engine: "1.3 TCe бензин", category: "Система зажигания", name: "Катушка зажигания", oem: "22401-6483R", brand: "Renault", inStock: true },
    { make: "Renault", model: "Duster II", year: "2021-2024", engine: "1.3 TCe бензин", category: "Выхлопная система", name: "Катализатор", oem: "20110-6483R", brand: "Renault", inStock: false },

    { make: "Renault", model: "Logan II", year: "2015-2024", engine: "1.6 бензин", category: "Рулевое управление", name: "Наконечник рулевой тяги", oem: "48520-9625R", brand: "Renault", inStock: true },
    { make: "Renault", model: "Logan II", year: "2015-2024", engine: "1.6 бензин", category: "Система зажигания", name: "Катушка зажигания", oem: "22401-9625R", brand: "Renault", inStock: true },
    { make: "Renault", model: "Logan II", year: "2015-2024", engine: "1.6 бензин", category: "Трансмиссия", name: "Масло КПП 75W-80 2л", oem: "7711497024", brand: "Renault", inStock: true },

    // --- Nissan: Рулевое, Зажигание, Топливная ---
    { make: "Nissan", model: "Qashqai J12", year: "2021-2024", engine: "1.3 DIG-T бензин", category: "Рулевое управление", name: "Наконечник рулевой тяги", oem: "48520-JP00C", brand: "Nissan", inStock: true },
    { make: "Nissan", model: "Qashqai J12", year: "2021-2024", engine: "1.3 DIG-T бензин", category: "Система зажигания", name: "Катушка зажигания", oem: "22448-JP00A", brand: "NGK", inStock: true },
    { make: "Nissan", model: "Qashqai J12", year: "2021-2024", engine: "1.3 DIG-T бензин", category: "Топливная система", name: "Топливный насос (бензонасос)", oem: "17040-JP00C", brand: "Nissan", inStock: false },

    // --- Mazda: Рулевое, Зажигание ---
    { make: "Mazda", model: "CX-5 (KF)", year: "2017-2024", engine: "2.0 SkyActiv бензин", category: "Рулевое управление", name: "Наконечник рулевой тяги", oem: "KDY0-32-280", brand: "Mazda", inStock: true },
    { make: "Mazda", model: "CX-5 (KF)", year: "2017-2024", engine: "2.0 SkyActiv бензин", category: "Система зажигания", name: "Катушка зажигания", oem: "PE01-18-100", brand: "Mazda", inStock: true },
    { make: "Mazda", model: "CX-5 (KF)", year: "2017-2024", engine: "2.0 SkyActiv бензин", category: "Отопление и кондиционирование", name: "Компрессор кондиционера", oem: "KDY0-61-450", brand: "Denso", inStock: false },
    { make: "Mazda", model: "CX-5 (KF)", year: "2017-2024", engine: "2.0 SkyActiv бензин", category: "Электроника", name: "Датчик ABS", oem: "KDY0-43-7E0", brand: "Mazda", inStock: true },

    // --- Ford: Рулевое, Зажигание ---
    { make: "Ford", model: "Focus IV", year: "2018-2024", engine: "1.5 EcoBoost бензин", category: "Рулевое управление", name: "Наконечник рулевой тяги", oem: "2392163", brand: "Ford", inStock: true },
    { make: "Ford", model: "Focus IV", year: "2018-2024", engine: "1.5 EcoBoost бензин", category: "Система зажигания", name: "Катушка зажигания", oem: "1755677", brand: "Ford", inStock: true },
    { make: "Ford", model: "Focus IV", year: "2018-2024", engine: "1.5 EcoBoost бензин", category: "Топливная система", name: "Топливный насос (бензонасос)", oem: "2392163", brand: "Ford", inStock: false },

    // --- Skoda: Рулевое, Зажигание, Топливная ---
    { make: "Skoda", model: "Octavia A8", year: "2020-2024", engine: "1.4 TSI бензин", category: "Рулевое управление", name: "Наконечник рулевой тяги", oem: "5Q0423811", brand: "VAG", inStock: true },
    { make: "Skoda", model: "Octavia A8", year: "2020-2024", engine: "1.4 TSI бензин", category: "Система зажигания", name: "Катушка зажигания", oem: "06K905110D", brand: "Bosch", inStock: true },
    { make: "Skoda", model: "Octavia A8", year: "2020-2024", engine: "1.4 TSI бензин", category: "Топливная система", name: "Топливный насос (бензонасос)", oem: "5Q0919087M", brand: "Bosch", inStock: false },

    // --- Audi: Рулевое, Зажигание ---
    { make: "Audi", model: "A4 (B9)", year: "2016-2024", engine: "2.0 TFSI бензин", category: "Рулевое управление", name: "Наконечник рулевой тяги", oem: "8W0423811", brand: "VAG", inStock: true },
    { make: "Audi", model: "A4 (B9)", year: "2016-2024", engine: "2.0 TFSI бензин", category: "Система зажигания", name: "Катушка зажигания", oem: "06K905110D", brand: "Bosch", inStock: true },

    // --- Китайские бренды: Рулевое, Зажигание, Топливная ---
    { make: "Chery", model: "Tiggo 4", year: "2019-2024", engine: "1.5T бензин", category: "Рулевое управление", name: "Наконечник рулевой тяги", oem: "T15-3414028", brand: "Chery", inStock: true },
    { make: "Chery", model: "Tiggo 4", year: "2019-2024", engine: "1.5T бензин", category: "Система зажигания", name: "Катушка зажигания", oem: "F01R-00002", brand: "Chery", inStock: true },

    { make: "Geely", model: "Monjaro", year: "2022-2024", engine: "2.0T бензин", category: "Рулевое управление", name: "Наконечник рулевой тяги", oem: "1019020100", brand: "Geely", inStock: true },
    { make: "Geely", model: "Monjaro", year: "2022-2024", engine: "2.0T бензин", category: "Система зажигания", name: "Катушка зажигания", oem: "F01R-00002", brand: "Geely", inStock: true },
    { make: "Geely", model: "Monjaro", year: "2022-2024", engine: "2.0T бензин", category: "Топливная система", name: "Топливный насос (бензонасос)", oem: "1019070100", brand: "Geely", inStock: false },

    { make: "Haval", model: "Jolion", year: "2021-2024", engine: "1.5T бензин", category: "Рулевое управление", name: "Наконечник рулевой тяги", oem: "3414028X", brand: "Haval", inStock: true },
    { make: "Haval", model: "Jolion", year: "2021-2024", engine: "1.5T бензин", category: "Система зажигания", name: "Катушка зажигания", oem: "F01R-00002", brand: "Haval", inStock: true },
    { make: "Haval", model: "Jolion", year: "2021-2024", engine: "1.5T бензин", category: "Трансмиссия", name: "Масло DSG (робот) 2л", oem: "DSG-OIL-2L", brand: "Haval", inStock: true },

    { make: "Exeed", model: "TXL", year: "2021-2024", engine: "2.0T бензин", category: "Рулевое управление", name: "Наконечник рулевой тяги", oem: "EXD-3414028", brand: "Exeed", inStock: true },
    { make: "Exeed", model: "TXL", year: "2021-2024", engine: "2.0T бензин", category: "Система зажигания", name: "Катушка зажигания", oem: "EXD-F01R2", brand: "Exeed", inStock: true },

    { make: "Omoda", model: "C5", year: "2023-2024", engine: "1.5T бензин", category: "Рулевое управление", name: "Наконечник рулевой тяги", oem: "OMD-3414028", brand: "Omoda", inStock: true },
    { make: "Omoda", model: "C5", year: "2023-2024", engine: "1.5T бензин", category: "Система зажигания", name: "Катушка зажигания", oem: "F01R-00002", brand: "Omoda", inStock: true },
    { make: "Omoda", model: "C5", year: "2023-2024", engine: "1.5T бензин", category: "Топливная система", name: "Топливный насос (бензонасос)", oem: "OMD-1107010", brand: "Omoda", inStock: false },

    { make: "Changan", model: "CS55", year: "2022-2024", engine: "1.5T бензин", category: "Рулевое управление", name: "Наконечник рулевой тяги", oem: "CHA-3414028", brand: "Changan", inStock: true },
    { make: "Changan", model: "CS55", year: "2022-2024", engine: "1.5T бензин", category: "Система зажигания", name: "Катушка зажигания", oem: "F01R-00002", brand: "Changan", inStock: true },

    // --- Универсальные: новые категории ---
    { make: "Universal", model: "Универсальные", year: "—", engine: "—", category: "Трансмиссия", name: "Масло ATF Dexron III 1л", oem: "ATF-D3-1L", brand: "Mobil", inStock: true },
    { make: "Universal", model: "Универсальные", year: "—", engine: "—", category: "Трансмиссия", name: "Масло трансмиссионное 80W-90 4л", oem: "TRANS-80W90", brand: "Castrol", inStock: true },
    { make: "Universal", model: "Универсальные", year: "—", engine: "—", category: "Электроника", name: "Датчик температуры ОЖ", oem: "SENSOR-TEMP", brand: "Bosch", inStock: true },
    { make: "Universal", model: "Универсальные", year: "—", engine: "—", category: "Электроника", name: "Датчик давления масла", oem: "SENSOR-OIL-P", brand: "Bosch", inStock: true },
    { make: "Universal", model: "Универсальные", year: "—", engine: "—", category: "Система зажигания", name: "Катушка зажигания универсальная", oem: "IGN-COIL-U", brand: "Bosch", inStock: true },
    { make: "Universal", model: "Универсальные", year: "—", engine: "—", category: "Выхлопная система", name: "Гофра выхлопной системы", oem: "EXH-BELLOW", brand: "Walker", inStock: true },
    { make: "Universal", model: "Универсальные", year: "—", engine: "—", category: "Отопление и кондиционирование", name: "Фреон R134a 300г", oem: "AC-R134A", brand: "Honeywell", inStock: true },
    { make: "Universal", model: "Универсальные", year: "—", engine: "—", category: "Отопление и кондиционирование", name: "Компрессор кондиционера универсальный", oem: "AC-COMP-U", brand: "Denso", inStock: false },
    { make: "Universal", model: "Универсальные", year: "—", engine: "—", category: "Топливная система", name: "Форсунка универсальная", oem: "INJ-UNIV", brand: "Bosch", inStock: false },
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
    campaignId: "5rermd1rb54c6955f9a4aeed5c54e0",
    type: "takprodam_short",
    color: "#6f42c1",
    icon: "fa-solid fa-wrench",
    network: "Takprodam (Admitad) ~3.5%",
    erid: "25H8d7vbP8SRTvHZB1b5vJ",
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
    if (s.type === 'takprodam_short') {
      let url = `https://ad.admitad.com/g/${s.campaignId}/?ulp=${encodeURIComponent(directUrl)}&erid=${s.erid}`;
      return { ...s, fullUrl: url };
    }
    let url = `https://ad.admitad.com/g/${s.campaignId}/?ulp=${encodeURIComponent(directUrl)}`;
    if (s.erid) url += `&erid=${s.erid}`;
    return { ...s, fullUrl: url };
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
