// ==========================================
// АвтоТема — База брендов, тегов и таксономии для хаб-страниц и перелинковки
// ==========================================

const BRANDS = [
    {
        slug: 'chery',
        name: 'Chery',
        nameRu: 'Чери',
        country: 'Китай 🇨🇳',
        year: 1997,
        logo: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=300&auto=format&fit=crop&q=80',
        heroImage: '/images/art-17.jpg',
        description: 'Chery — один из лидеров китайского автопрома на российском рынке. Производитель популярных кроссоверов линейки Tiggo и седанов Arrizo с современными турбомоторами и богатым оснащением.',
        keywords: ['chery', 'чери', 'tiggo', 'тигго', 'arrizo', 'арризо']
    },
    {
        slug: 'geely',
        name: 'Geely',
        nameRu: 'Джили',
        country: 'Китай 🇨🇳',
        year: 1986,
        logo: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=300&auto=format&fit=crop&q=80',
        heroImage: '/images/art-23.jpg',
        description: 'Geely — технологический гигант, владеющий Volvo, Zeekr и Lotus. Кроссоверы Coolray, Monjaro и Atlas задают стандарты качества, безопасности и управляемости в своём классе.',
        keywords: ['geely', 'джили', 'coolray', 'кулрей', 'monjaro', 'монжаро', 'atlas', 'атлас', 'emgrand']
    },
    {
        slug: 'haval',
        name: 'Haval',
        nameRu: 'Хавейл',
        country: 'Китай 🇨🇳',
        year: 2013,
        logo: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=300&auto=format&fit=crop&q=80',
        heroImage: '/images/art-75.jpg',
        description: 'Haval — специализированный бренд кроссоверов и внедорожников концерна Great Wall с собственным заводом полного цикла в Тульской области. Бестселлер Jolion — самый популярный иностранный кроссовер в РФ.',
        keywords: ['haval', 'хавейл', 'хавал', 'jolion', 'джолион', 'dargo', 'дарго', 'f7', 'h3']
    },
    {
        slug: 'lada',
        name: 'Lada (АвтоВАЗ)',
        nameRu: 'Лада',
        country: 'Россия 🇷🇺',
        year: 1966,
        logo: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300&auto=format&fit=crop&q=80',
        heroImage: '/images/art-53.jpg',
        description: 'Lada — флагман отечественного автомобилестроения. Модели Vesta NG, Granta, Niva Legend и новая Iskra обеспечивают высокую ремонтопригодность, доступность запчастей и адаптацию к суровому климату.',
        keywords: ['lada', 'лада', 'ваз', 'автоваз', 'vesta', 'веста', 'granta', 'гранта', 'niva', 'нива', 'iskra', 'искра']
    },
    {
        slug: 'changan',
        name: 'Changan',
        nameRu: 'Чанган',
        country: 'Китай 🇨🇳',
        year: 1862,
        logo: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=300&auto=format&fit=crop&q=80',
        heroImage: '/images/art-26.jpg',
        description: 'Changan — старейший автопроизводитель Китая с широчайшей модельной гаммой в РФ. Известен надёжными двигателями BlueCore, классическими гидроавтоматами Aisin и серией UNI.',
        keywords: ['changan', 'чанган', 'cs75', 'cs55', 'uni-k', 'uni-v', 'uni-t']
    },
    {
        slug: 'zeekr',
        name: 'Zeekr',
        nameRu: 'Зикр',
        country: 'Китай 🇨🇳',
        year: 2021,
        logo: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=300&auto=format&fit=crop&q=80',
        heroImage: '/images/art-25.jpg',
        description: 'Zeekr — премиальный суббренд Geely, перевернувший рынок электрокаров. 800-вольтовая архитектура, разгон до сотни за 3.8 с и запас хода свыше 700 км делают Zeekr 001 эталоном сегмента.',
        keywords: ['zeekr', 'зикр', '001', '007', '009', 'zeekr x']
    },
    {
        slug: 'li-auto',
        name: 'Li Auto (Lixiang)',
        nameRu: 'Ли Авто / Лисян',
        country: 'Китай 🇨🇳',
        year: 2015,
        logo: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=300&auto=format&fit=crop&q=80',
        heroImage: '/images/art-21.jpg',
        description: 'Li Auto — лидер в сегменте последовательных премиум-гибридов (EREV). Кроссоверы L7, L8 и L9 предлагают пневмоподвеску, королевский комфорт и запас хода до 1300+ км.',
        keywords: ['li auto', 'lixiang', 'лисян', 'ли авто', 'l7', 'l8', 'l9', 'mega']
    },
    {
        slug: 'xiaomi',
        name: 'Xiaomi Auto',
        nameRu: 'Сяоми',
        country: 'Китай 🇨🇳',
        year: 2021,
        logo: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=300&auto=format&fit=crop&q=80',
        heroImage: '/images/art-27.jpg',
        description: 'Xiaomi Auto — сенсационный дебют технологического гиганта. Электроседан SU7 Max развивает 673 л.с., разгоняется до 100 км/ч за 2.78 с и глубоко интегрирован в экосистему HyperOS.',
        keywords: ['xiaomi', 'сяоми', 'su7', 'su7 max', 'hyperos']
    },
    {
        slug: 'tank',
        name: 'Tank',
        nameRu: 'Танк',
        country: 'Китай 🇨🇳',
        year: 2021,
        logo: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=300&auto=format&fit=crop&q=80',
        heroImage: '/images/art-54.jpg',
        description: 'Tank — премиальные рамные внедорожники повышенной проходимости от Great Wall. Настоящий полный привод с блокировками, понижающей передачей и клиренсом до 224 мм для любых экспедиций.',
        keywords: ['tank', 'танк', 'tank 300', 'tank 500', 'tank 700']
    },
    {
        slug: 'exeed',
        name: 'Exeed',
        nameRu: 'Эксид',
        country: 'Китай 🇨🇳',
        year: 2018,
        logo: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=300&auto=format&fit=crop&q=80',
        heroImage: '/images/art-17.jpg',
        description: 'Exeed — премиальное подразделение Chery. Купе-кроссовер RX с адаптивной подвеской CDC, флагман VX и кроссовер TXL сочетают премиальную отделку, полный привод и передовую безопасность.',
        keywords: ['exeed', 'эксид', 'exeed rx', 'exeed vx', 'exeed txl', 'exeed lx']
    },
    {
        slug: 'moskvich',
        name: 'Москвич',
        nameRu: 'Москвич',
        country: 'Россия 🇷🇺',
        year: 1930,
        logo: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300&auto=format&fit=crop&q=80',
        heroImage: '/images/art-56.jpg',
        description: 'Москвич — возрождённая российская автомобильная марка. Городской кроссовер Москвич 3, электромобиль Москвич 3е и седан Москвич 6 собираются на столичном заводе «Москвич».',
        keywords: ['москвич', 'moskvich', 'москвич 3', 'москвич 6', 'москвич 8']
    },
    {
        slug: 'bmw',
        name: 'BMW',
        nameRu: 'БМВ',
        country: 'Германия 🇩🇪',
        year: 1916,
        logo: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=300&auto=format&fit=crop&q=80',
        heroImage: '/images/art-10.jpg',
        description: 'BMW (Bayerische Motoren Werke) — легендарный баварский бренд, синоним драйверского удовольствия за рулем («С удовольствием за рулем»). Создатель культовых M-серий и кроссоверов X-line.',
        keywords: ['bmw', 'бмв', 'bayerische', 'm3', 'm5', 'x5', 'x6', 'x7']
    },
    {
        slug: 'mercedes',
        name: 'Mercedes-Benz',
        nameRu: 'Мерседес-Бенц',
        country: 'Германия 🇩🇪',
        year: 1926,
        logo: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=300&auto=format&fit=crop&q=80',
        heroImage: '/images/art-09.jpg',
        description: 'Mercedes-Benz — пионер мирового автомобилестроения и эталон премиального комфорта («The Best or Nothing»). От легендарных седанов S-Class до спортивных болидов Mercedes-AMG.',
        keywords: ['mercedes', 'мерседес', 'daimler', 'amg', 'майбах', 'maybach', 's-class', 'e-class']
    },
    {
        slug: 'porsche',
        name: 'Porsche',
        nameRu: 'Порше',
        country: 'Германия 🇩🇪',
        year: 1931,
        logo: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300&auto=format&fit=crop&q=80',
        heroImage: '/images/art-16.jpg',
        description: 'Porsche — вершина немецкой инженерной мысли и спортивного автопрома. Культовый Porsche 911, бестселлер Cayenne, фастбек Panamera и электрический Taycan.',
        keywords: ['porsche', 'порше', '911', 'cayenne', 'кайен', 'panamera', 'панамера', 'taycan', 'тайкан']
    },
    {
        slug: 'toyota',
        name: 'Toyota',
        nameRu: 'Тойота',
        country: 'Япония 🇯🇵',
        year: 1937,
        logo: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=300&auto=format&fit=crop&q=80',
        heroImage: '/images/art-03.jpg',
        description: 'Toyota — мировой лидер по объему продаж и эталон надежности. Легендарные седаны Camry, кроссоверы RAV4 и неубиваемые рамные внедорожники Land Cruiser.',
        keywords: ['toyota', 'тойота', 'camry', 'камри', 'rav4', 'рав4', 'land cruiser', 'ленд крузер', 'corolla']
    },
    {
        slug: 'kia',
        name: 'Kia',
        nameRu: 'Киа',
        country: 'Южная Корея 🇰🇷',
        year: 1944,
        logo: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=300&auto=format&fit=crop&q=80',
        heroImage: '/images/art-70.jpg',
        description: 'Kia — корейский автопроизводитель, покоривший мир ярким дизайном и передовыми технологиями. В авангарде — новая электрическая линейка EV3, EV6, EV9 и бестселлеры Sportage и K5.',
        keywords: ['kia', 'киа', 'ev3', 'ev6', 'sportage', 'спортейдж', 'k5', 'sorento', 'рио', 'rio']
    },
    {
        slug: 'tesla',
        name: 'Tesla',
        nameRu: 'Тесла',
        country: 'США 🇺🇸',
        year: 2003,
        logo: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=300&auto=format&fit=crop&q=80',
        heroImage: '/images/art-74.jpg',
        description: 'Tesla — компания Илона Маска, совершившая глобальную революцию в индустрии электромобилей. Model Y и Model 3 — самые продаваемые электромобили в мире с автопилотом Full Self-Driving.',
        keywords: ['tesla', 'тесла', 'model y', 'model 3', 'model s', 'model x', 'cybertruck', 'маск']
    },
    {
        slug: 'volkswagen',
        name: 'Volkswagen',
        nameRu: 'Фольксваген',
        country: 'Германия 🇩🇪',
        year: 1937,
        logo: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=300&auto=format&fit=crop&q=80',
        heroImage: '/images/art-14.jpg',
        description: 'Volkswagen — один из крупнейших автоконцернов мира. Создатель «народного автомобиля» Beetle, легендарного семейства Golf, бестселлера Tiguan и флагманского внедорожника Touareg.',
        keywords: ['volkswagen', 'фольксваген', 'vw', 'golf', 'гольф', 'tiguan', 'тигуан', 'passat', 'пассат', 'touareg']
    },
    {
        slug: 'audi',
        name: 'Audi',
        nameRu: 'Ауди',
        country: 'Германия 🇩🇪',
        year: 1909,
        logo: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=300&auto=format&fit=crop&q=80',
        heroImage: '/images/art-18.jpg',
        description: 'Audi — «Превосходство высоких технологий» (Vorsprung durch Technik). Легендарная система постоянного полного привода Quattro, матричная оптика и премиальный спорт в линейках RS и Q.',
        keywords: ['audi', 'ауди', 'quattro', 'кваттро', 'a4', 'a6', 'q7', 'q8', 'rs6']
    },
    {
        slug: 'esteo',
        name: 'ESTEO',
        nameRu: 'Эстео',
        country: 'Россия / СНГ 🇷🇺',
        year: 2025,
        logo: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300&auto=format&fit=crop&q=80',
        heroImage: '/images/art-24.jpg',
        description: 'ESTEO — новый высокотехнологичный бренд гибридных премиум-кроссоверов. Флагман V27 мощностью 456 л.с. предлагает запас хода до 1200 км и адаптивный полный привод.',
        keywords: ['esteo', 'эстео', 'v27', 'esteo v27']
    },
    {
        slug: 'ferrari',
        name: 'Ferrari',
        nameRu: 'Феррари',
        country: 'Италия 🇮🇹',
        year: 1939,
        logo: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=300&auto=format&fit=crop&q=80',
        heroImage: '/images/ferrari.jpg',
        description: 'Ferrari — легендарный итальянский производитель суперкаров и символ мирового автоспорта. От гоночных болидов Формулы-1 до эксклюзивных дорожных шедевров в Маранелло.',
        keywords: ['ferrari', 'феррари', 'luce', 'maranello', 'маранелло', 'enzo', 'sf90', 'f8', '296 gtb']
    },
    {
        slug: 'porsche',
        name: 'Porsche',
        nameRu: 'Порше',
        country: 'Германия 🇩🇪',
        year: 1931,
        logo: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300&auto=format&fit=crop&q=80',
        heroImage: '/images/porsche-911.jpg',
        description: 'Porsche — эталон спортивного инжиниринга. Легендарное семейство 911, спорткары 718 Cayman/Boxster, премиум-кроссоверы Cayenne и Macan, а также электрокар Taycan.',
        keywords: ['porsche', 'порше', '911', 'carrera', 'каррера', 'cayenne', 'кайен', 'panamera', 'панамера', 'taycan', 'тайкан', 'gt3']
    },
    {
        slug: 'mercedes',
        name: 'Mercedes-Benz',
        nameRu: 'Мерседес-Бенц',
        country: 'Германия 🇩🇪',
        year: 1926,
        logo: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=300&auto=format&fit=crop&q=80',
        heroImage: '/images/art-38.jpg',
        description: 'Mercedes-Benz — «The Best or Nothing». Изобретатель первого в мире автомобиля, создатель представительского S-Class, спортивного подразделения AMG и легендарного G-Class.',
        keywords: ['mercedes', 'мерседес', 'mercedes-benz', 'amg', 'майбах', 'maybach', 'gelandewagen', 'гелик', 's-class', '300 sls', 'stirling moss']
    }
];

const TAGS = [
    {
        slug: 'kitayskie-avto',
        name: 'Китайские авто',
        hashtag: '#китайские_авто',
        icon: '🇨🇳',
        description: 'Все новости, тесты и обзоры китайских автомобилей в России: Haval, Geely, Chery, Changan, Zeekr, Li Auto, Tank и Exeed.',
        keywords: ['китай', 'китайские', 'haval', 'geely', 'chery', 'changan', 'zeekr', 'li auto', 'tank', 'exeed']
    },
    {
        slug: 'polnyy-privod',
        name: 'Полный привод',
        hashtag: '#полный_привод',
        icon: '🛞',
        description: 'Всё о системах полного привода: AWD, 4WD, Part-Time, Quattro и проходимости кроссоверов и внедорожников в зимних условиях.',
        keywords: ['полный привод', 'awd', '4wd', 'quattro', '4x4', 'бездорожье', 'клиренс', 'проходимость']
    },
    {
        slug: 'elektromobili',
        name: 'Электромобили',
        hashtag: '#электромобили',
        icon: '⚡',
        description: 'Электрокары 2026 года: новинки, запас хода, скорость зарядки 800V, батареи LFP и твердотельные аккумуляторы.',
        keywords: ['электромобиль', 'электрокар', 'электро', 'батаре', 'зарядк', 'tesla', 'zeekr', 'su7', 'ev3']
    },
    {
        slug: 'gibridy',
        name: 'Гибриды (PHEV / EREV)',
        hashtag: '#гибриды',
        icon: '🔋',
        description: 'Подключаемые и последовательные гибриды с запасом хода свыше 1000 км. Плюсы, минусы и экономия топлива.',
        keywords: ['гибрид', 'phev', 'erev', 'hev', 'lixiang', 'li auto', 'esteo', 'запас хода']
    },
    {
        slug: 'variator',
        name: 'Вариатор (CVT)',
        hashtag: '#вариатор',
        icon: '⚙️',
        description: 'Особенности эксплуатации, надёжность, замена масла и ресурс современных клиноцепных вариаторов (CVT).',
        keywords: ['вариатор', 'cvt', 'коробк']
    },
    {
        slug: 'akpp',
        name: 'Классический автомат (АКПП)',
        hashtag: '#акпп',
        icon: '🕹️',
        description: 'Гидромеханические автоматические коробки передач Aisin, ZF и Hyundai: сравнение с роботами и ресурс.',
        keywords: ['акпп', 'автомат', 'aisin', 'zf', 'гидроавтомат', 'коробк']
    },
    {
        slug: 'turbomotory',
        name: 'Турбомоторы',
        hashtag: '#турбомоторы',
        icon: '🌪️',
        description: 'Всё о турбированных двигателях: ресурс турбины, интервал замены масла, охлаждение и выбор бензина.',
        keywords: ['турбо', 'турбин', 'двигател', 'мотор', 'масло']
    },
    {
        slug: 'byudzhetnye-avto',
        name: 'Бюджетные авто',
        hashtag: '#бюджетные_авто',
        icon: '💰',
        description: 'Автомобили до 2 млн рублей в России: Lada Vesta, Granta, Москвич 3, скидки, льготы и программы господдержки.',
        keywords: ['бюджетн', 'до 2 млн', 'до 1.5 млн', 'недорог', 'дешев', 'эконом-класс', 'господдержк', 'льгот']
    },
    {
        slug: 'vnedorozhniki',
        name: 'Внедорожники',
        hashtag: '#внедорожники',
        icon: '🏔️',
        description: 'Рамные внедорожники, блокировки дифференциалов, внедорожный тюнинг и тест-драйвы в экстремальных условиях.',
        keywords: ['внедорожник', 'рамн', 'tank', 'уаз', 'patriot', 'блокировк', 'понижающ']
    },
    {
        slug: 'krossovery',
        name: 'Кроссоверы',
        hashtag: '#кроссоверы',
        icon: '🚙',
        description: 'Городские и семейные SUV: сравнение клиренса, объёма багажника, простора салона и управляемости.',
        keywords: ['кроссовер', 'suv', 'паркетник', 'семь', 'багажник', 'клиренс']
    }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BRANDS, TAGS };
}
