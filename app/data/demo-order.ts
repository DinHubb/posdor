import type { Localized } from './site'

// Демо-заказ для страниц статуса и ссылки для родных
export const demoOrder = {
  rahnamo: {
    name: { ru: 'Фаридун Назаров', tg: 'Фаридун Назаров' } as Localized,
    phoneHref: 'tel:+992900000000'
  },
  janaza: {
    ru: 'Сегодня, пешин — 12:30 · Мечеть Мавлоно Яъқуби Чархӣ',
    tg: 'Имрӯз, пешин — 12:30 · Масҷиди Мавлоно Яъқуби Чархӣ'
  } as Localized,
  bill: {
    ru: 'Пакет «Комил» · 6 900 сомони · оплачено',
    tg: 'Бастаи «Комил» · 6 900 сомонӣ · пардохт шуд'
  } as Localized,
  statusTimes: ['08:40', '09:15', '10:30', '11:45', '12:20', '13:10'],
  deceased: {
    name: { ru: 'Абдулло Раҳимов', tg: 'Абдулло Раҳимов' } as Localized,
    years: '1948 – 2026'
  },
  details: [
    {
      icon: 'i-lucide-heart-handshake',
      title: { ru: 'Видолаш (прощание)', tg: 'Видолаш' },
      description: { ru: 'Сегодня, 11:30 · ул. Айни 45, кв. 12', tg: 'Имрӯз, 11:30 · кӯчаи Айнӣ 45, ҳуҷраи 12' }
    },
    {
      icon: 'i-lucide-landmark',
      title: { ru: 'Джаназа-намаз', tg: 'Намози ҷаноза' },
      description: { ru: 'Сегодня, пешин — 12:30 · Мечеть Мавлоно Яъқуби Чархӣ', tg: 'Имрӯз, пешин — 12:30 · Масҷиди Мавлоно Яъқуби Чархӣ' }
    },
    {
      icon: 'i-lucide-map-pin',
      title: { ru: 'Погребение', tg: 'Дафн' },
      description: { ru: 'Кладбище Лучоб, сектор 4', tg: 'Қабристони Лучоб, қитъаи 4' }
    }
  ] as { icon: string, title: Localized, description: Localized }[]
}
