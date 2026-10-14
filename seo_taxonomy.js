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
        keywords: ['mercedes', 'мерседес', 'mercedes-benz', 'daimler', 'amg', 'майбах', 'maybach', 'gelandewagen', 'гелик', 's-class', 'e-class', '300 sls', 'stirling moss']
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
        keywords: ['porsche', 'порше', '911', 'carrera', 'каррера', 'cayenne', 'кайен', 'macan', 'макан', 'panamera', 'панамера', 'taycan', 'тайкан', 'gt3']
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
        slug: 'ford',
        name: 'Ford',
        nameRu: 'Форд',
        country: 'США 🇺🇸',
        year: 1903,
        logo: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=300&auto=format&fit=crop&q=80',
        heroImage: '/images/auto/art-91.jpg',
        description: 'Ford — легендарный американский автоконцерн, создатель культового спорткара Mustang, пикапов F-Series и внедорожников Bronco.',
        keywords: ['ford', 'форд', 'ranger', 'мустанг', 'mustang', 'ecosport', 'fathom', 'f-150', 'f-series', 'bronco']
    },
    {
        slug: 'hyundai',
        name: 'Hyundai',
        nameRu: 'Хёндэ',
        country: 'Южная Корея 🇰🇷',
        year: 1967,
        logo: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=300&auto=format&fit=crop&q=80',
        heroImage: '/images/auto/art-98.jpg',
        description: 'Hyundai — южнокорейский автогигант, мировой лидер инноваций. Популярные кроссоверы Tucson, флагманский Palisade, Santa Fe и электрокары Ioniq.',
        keywords: ['hyundai', 'хёндэ', 'хендай', 'tucson', 'туссан', 'palisade', 'палисад', 'santa fe', 'солярис', 'solaris', 'creta', 'крета', 'ioniq']
    },
    {
        slug: 'genesis',
        name: 'Genesis',
        nameRu: 'Дженезис',
        country: 'Южная Корея 🇰🇷',
        year: 2015,
        logo: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=300&auto=format&fit=crop&q=80',
        heroImage: '/images/auto/art-93.jpg',
        description: 'Genesis — премиальное подразделение Hyundai Motor Group. Спортивные седаны G70, люксовые седаны G80/G90, кроссоверы GV70/GV80 и спорт-концепты Magma.',
        keywords: ['genesis', 'дженезис', 'g70', 'g80', 'g90', 'gv70', 'gv80', 'magma']
    },
    {
        slug: 'chevrolet',
        name: 'Chevrolet',
        nameRu: 'Шевроле',
        country: 'США 🇺🇸',
        year: 1911,
        logo: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=300&auto=format&fit=crop&q=80',
        heroImage: '/images/auto/art-92.jpg',
        description: 'Chevrolet — флагман корпорации General Motors. Культовые спорткары Corvette и Camaro, рамные пикапы Silverado и полноразмерные внедорожники Tahoe.',
        keywords: ['chevrolet', 'шевроле', 'шеви', 'corvette', 'корвет', 'silverado', 'сильверадо', 'tahoe', 'тахо', 'trax', 'trailblazer', 'turbomax', 'camaro']
    },
    {
        slug: 'jeep',
        name: 'Jeep',
        nameRu: 'Джип',
        country: 'США 🇺🇸',
        year: 1941,
        logo: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=300&auto=format&fit=crop&q=80',
        heroImage: '/images/auto/art-84.jpg',
        description: 'Jeep — имя нарицательное для внедорожников. Легендарные рамные Wrangler, комфортные Grand Cherokee и Cherokee с непревзойденной проходимостью Trail Rated.',
        keywords: ['jeep', 'джип', 'cherokee', 'чероки', 'grand cherokee', 'wrangler', 'вранглер', 'willys', 'виллис', 'gladiator']
    },
    {
        slug: 'subaru',
        name: 'Subaru',
        nameRu: 'Субару',
        country: 'Япония 🇯🇵',
        year: 1953,
        logo: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=300&auto=format&fit=crop&q=80',
        heroImage: '/images/auto/art-113.jpg',
        description: 'Subaru — японский бренд с раллийным ДНК. Фирменный симметричный полный привод Symmetrical AWD, оппозитные моторы Boxer и безопасность EyeSight.',
        keywords: ['subaru', 'субару', 'impreza', 'импреза', 'wrx', 'outback', 'аутбек', 'forester', 'форестер']
    },
    {
        slug: 'nissan',
        name: 'Nissan',
        nameRu: 'Ниссан',
        country: 'Япония 🇯🇵',
        year: 1933,
        logo: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=300&auto=format&fit=crop&q=80',
        heroImage: '/images/auto/art-108.jpg',
        description: 'Nissan — инновации, которые восхищают. Популярные кроссоверы Qashqai, X-Trail, Rogue Hybrid, легендарные спорткары GT-R и гоночное ателье Nismo.',
        keywords: ['nissan', 'ниссан', 'rogue', 'роуг', 'qashqai', 'кашкай', 'x-trail', 'икстрейл', 'patrol', 'патрол', 'skyline', 'gt-r', 'nismo']
    },
    {
        slug: 'mitsubishi',
        name: 'Mitsubishi',
        nameRu: 'Митсубиси',
        country: 'Япония 🇯🇵',
        year: 1870,
        logo: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=300&auto=format&fit=crop&q=80',
        heroImage: '/images/auto/art-104.jpg',
        description: 'Mitsubishi Motors — проверенная годами японская надежность. Легендарный внедорожник Pajero, кроссовер Outlander и раллийное наследие Ralliart.',
        keywords: ['mitsubishi', 'митсубиси', 'митсубиши', 'pajero', 'паджеро', 'outlander', 'аутлендер', 'l200', 'ralliart']
    },
    {
        slug: 'lamborghini',
        name: 'Lamborghini',
        nameRu: 'Ламборгини',
        country: 'Италия 🇮🇹',
        year: 1963,
        logo: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=300&auto=format&fit=crop&q=80',
        heroImage: '/images/auto/art-89.jpg',
        description: 'Automobili Lamborghini — экстремальные итальянские суперкары из Сант-Агата-Болоньезе. Флагман Revuelto, супер-кроссовер Urus и новый битурбо-V8 гибрид Temerario.',
        keywords: ['lamborghini', 'ламборгини', 'ламборджини', 'temerario', 'темерарио', 'sterrato', 'стеррато', 'revuelto', 'урус', 'urus', 'huracan']
    },
    {
        slug: 'bentley',
        name: 'Bentley',
        nameRu: 'Бентли',
        country: 'Великобритания 🇬🇧',
        year: 1919,
        logo: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=300&auto=format&fit=crop&q=80',
        heroImage: '/images/auto/art-119.jpg',
        description: 'Bentley Motors — британская роскошь ручной сборки из Крю. Легендарные гран-туреры Continental GT, седаны Flying Spur и роскошный внедорожник Bentayga.',
        keywords: ['bentley', 'бентли', 'continental', 'континенталь', 'flying spur', 'bentayga', 'бентайга', 'torcal']
    },
    {
        slug: 'aston-martin',
        name: 'Aston Martin',
        nameRu: 'Астон Мартин',
        country: 'Великобритания 🇬🇧',
        year: 1913,
        logo: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=300&auto=format&fit=crop&q=80',
        heroImage: '/images/auto/art-111.jpg',
        description: 'Aston Martin — квинтэссенция британской мощи, красоты и автоспорта. Спорткары Vantage, DB12, кроссовер DBX707 и гиперкар Valkyrie.',
        keywords: ['aston martin', 'астон мартин', 'vantage', 'валанс', 'db12', 'valkyrie']
    },
    {
        slug: 'cadillac',
        name: 'Cadillac',
        nameRu: 'Кадиллак',
        country: 'США 🇺🇸',
        year: 1902,
        logo: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=300&auto=format&fit=crop&q=80',
        heroImage: '/images/auto/art-135.jpg',
        description: 'Cadillac — высший класс американского автомобилестроения. Монументальный внедорожник Escalade, спортивные седаны CT5-V Blackwing и электрокроссовер Lyriq.',
        keywords: ['cadillac', 'кадиллак', 'escalade', 'эскалейд', 'lyriq', 'ct5']
    },
    {
        slug: 'land-rover',
        name: 'Land Rover',
        nameRu: 'Ленд Ровер',
        country: 'Великобритания 🇬🇧',
        year: 1948,
        logo: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=300&auto=format&fit=crop&q=80',
        heroImage: '/images/auto/art-99.jpg',
        description: 'Land Rover — покоритель любых направлений. Флагманский Range Rover, динамичный Range Rover Sport и бескомпромиссный экспедиционный Defender.',
        keywords: ['land rover', 'ленд ровер', 'defender', 'дефендер', 'range rover', 'рейндж ровер', 'discovery', 'дискавери']
    },
    {
        slug: 'ram',
        name: 'Ram Trucks',
        nameRu: 'Рам',
        country: 'США 🇺🇸',
        year: 2009,
        logo: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=300&auto=format&fit=crop&q=80',
        heroImage: '/images/auto/art-110.jpg',
        description: 'Ram Trucks — мощные американские полноразмерные пикапы концерна Stellantis. Бестселлеры Ram 1500, тяжеловозы 2500 Heavy Duty и электрический Ram REV.',
        keywords: ['ram', 'рам', 'ram 1500', '1500', '2500', 'trx', 'rev']
    },
    {
        slug: 'alfa-romeo',
        name: 'Alfa Romeo',
        nameRu: 'Альфа Ромео',
        country: 'Италия 🇮🇹',
        year: 1910,
        logo: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=300&auto=format&fit=crop&q=80',
        heroImage: '/images/auto/art-186.jpg',
        description: 'Alfa Romeo — итальянская страсть и гоночная эстетика Cuore Sportivo. Спортивный седан Giulia, кроссовер Stelvio, Tonale и новый концепт Cuorerosso GT.',
        keywords: ['alfa romeo', 'альфа ромео', 'giulia', 'джулия', 'stelvio', 'стельвио', 'cuorerosso', 'tonale']
    },
    {
        slug: 'maserati',
        name: 'Maserati',
        nameRu: 'Мазерати',
        country: 'Италия 🇮🇹',
        year: 1914,
        logo: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=300&auto=format&fit=crop&q=80',
        heroImage: '/images/auto/art-105.jpg',
        description: 'Maserati — итальянский трезубец роскоши и автоспорта из Модены. Суперкар MC20 с битурбо V6 Nettuno, кроссовер Grecale и гран-турер GranTurismo.',
        keywords: ['maserati', 'мазерати', 'mc20', 'grecale', 'ghibli', 'levante', 'granturismo']
    },
    {
        slug: 'lexus',
        name: 'Lexus',
        nameRu: 'Лексус',
        country: 'Япония 🇯🇵',
        year: 1989,
        logo: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=300&auto=format&fit=crop&q=80',
        heroImage: '/images/auto/art-152.jpg',
        description: 'Lexus — премиальное подразделение Toyota Motor. Флагманский внедорожник LX 600 / LX 700h, кроссовер RX, седаны ES и легендарная надёжность.',
        keywords: ['lexus', 'лексус', 'lx 600', 'lx 700h', 'lx', 'rx', 'gx', 'nx', 'es']
    },
    {
        slug: 'volvo',
        name: 'Volvo',
        nameRu: 'Вольво',
        country: 'Швеция 🇸🇪',
        year: 1927,
        logo: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=300&auto=format&fit=crop&q=80',
        heroImage: '/images/auto/art-97.jpg',
        description: 'Volvo Cars — мировой эталон безопасности, скандинавского дизайна и гибридных технологий PHEV. Кроссоверы XC90, XC60 и электрокары Polestar.',
        keywords: ['volvo', 'вольво', 'xc90', 'xc60', 'ex90', 'polestar', 'полестар']
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
    },
    {
        slug: 'avtotekhnologii',
        name: 'Автотехнологии и софт',
        hashtag: '#автотехнологии',
        icon: '🤖',
        description: 'Автопилоты, мультимедиа с ИИ, безопасность, камеры, OTA-обновления и будущее автомобильного софта.',
        keywords: ['технолог', 'камер', 'автопилот', 'беспилот', 'ota', 'софт', 'инноваци', 'патент', 'шин', 'экран', 'грок', 'grok']
    },
    {
        slug: 'avtorynok',
        name: 'Авторынок и цены',
        hashtag: '#авторынок',
        icon: '📈',
        description: 'Статистика продаж, динамика цен, утильсбор, пошлины, страхование, аукционы и мировые тренды авторынка.',
        keywords: ['рынок', 'рынк', 'продаж', 'цен', 'доллар', 'дилер', 'статистик', 'закон', 'сбор', 'пошлин', 'аукцион', 'страховк', 'угон', 'спрос']
    }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BRANDS, TAGS };
}
