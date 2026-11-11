import type { Localized } from './site'

export interface CarePlan {
  price: number
  perMonth?: boolean
  highlight?: boolean
  title: Localized
  description: Localized
  badge?: Localized
  features: Localized[]
}

export const carePlans: CarePlan[] = [
  {
    price: 150,
    perMonth: true,
    title: { ru: 'Ежемесячно', tg: 'Ҳар моҳ' },
    description: { ru: 'Уборка и полив раз в месяц.', tg: 'Тозакунӣ ва обёрӣ моҳе як бор.' },
    features: [
      { ru: 'Уборка и полив', tg: 'Тозакунӣ ва обёрӣ' },
      { ru: 'Фотоотчёт в Telegram', tg: 'Ҳисоботи аксӣ дар Telegram' },
      { ru: 'Сообщение о повреждениях', tg: 'Хабар дар бораи осебҳо' }
    ]
  },
  {
    price: 450,
    perMonth: true,
    highlight: true,
    title: { ru: 'Еженедельно', tg: 'Ҳар ҳафта' },
    description: { ru: 'Для тех, кто далеко и хочет быть спокоен.', tg: 'Барои онҳое, ки дуранд ва мехоҳанд ором бошанд.' },
    badge: { ru: 'Для диаспоры', tg: 'Барои муҳоҷирон' },
    features: [
      { ru: 'Уборка каждую неделю', tg: 'Тозакунӣ ҳар ҳафта' },
      { ru: 'Фото- и видеоотчёт', tg: 'Ҳисоботи аксӣ ва видеоӣ' },
      { ru: 'Цветы на 3, 7, 40 дней и годовщину', tg: 'Гул дар рӯзҳои 3, 7, 40 ва солгард' },
      { ru: 'Чтение дуа по просьбе семьи', tg: 'Хондани дуо бо хоҳиши оила' }
    ]
  },
  {
    price: 250,
    title: { ru: 'Разово', tg: 'Як бор' },
    description: { ru: 'К памятной дате или перед приездом.', tg: 'Ба санаи ёдбуд ё пеш аз омадан.' },
    features: [
      { ru: 'Уборка и полив', tg: 'Тозакунӣ ва обёрӣ' },
      { ru: 'Фотоотчёт', tg: 'Ҳисоботи аксӣ' },
      { ru: 'Выезд в удобный день', tg: 'Рафтан дар рӯзи қулай' }
    ]
  }
]

export interface ServiceItem {
  icon: string
  title: Localized
  description: Localized
}

export const marakaItems: ServiceItem[] = [
  { icon: 'i-lucide-tent', title: { ru: 'Шатёр', tg: 'Хайма' }, description: { ru: 'На 50 или 100 человек, сборка и разборка.', tg: 'Барои 50 ё 100 нафар, васл ва ҷудо кардан.' } },
  { icon: 'i-lucide-armchair', title: { ru: 'Столы и стулья', tg: 'Мизу курсиҳо' }, description: { ru: 'Комплекты на 20–150 гостей.', tg: 'Маҷмӯаҳо барои 20–150 меҳмон.' } },
  { icon: 'i-lucide-cooking-pot', title: { ru: 'Посуда и казан', tg: 'Зарфҳо ва дег' }, description: { ru: 'Для оши назр, мойка включена.', tg: 'Барои оши назр, шустан дохил аст.' } },
  { icon: 'i-lucide-truck', title: { ru: 'Доставка', tg: 'Расонидан' }, description: { ru: 'Привезём к нужному часу в день маърака.', tg: 'Дар рӯзи маърака ба соати лозимӣ меорем.' } }
]

export const sadaqaItems: ServiceItem[] = [
  { icon: 'i-lucide-utensils', title: { ru: 'Еда нуждающимся', tg: 'Хӯрок ба ниёзмандон' }, description: { ru: 'Горячие обеды семьям с низким доходом.', tg: 'Хӯроки гарм ба оилаҳои камбизоат.' } },
  { icon: 'i-lucide-droplet', title: { ru: 'Вода и колодцы', tg: 'Об ва чоҳҳо' }, description: { ru: 'Садака ҷория — помощь, которая продолжается.', tg: 'Садақаи ҷория — кӯмаке, ки идома дорад.' } },
  { icon: 'i-lucide-book-open', title: { ru: 'Коран в мечети', tg: 'Қуръон ба масҷид' }, description: { ru: 'Экземпляры Корана для мечетей махалли.', tg: 'Нусхаҳои Қуръон барои масҷидҳои маҳалла.' } }
]
