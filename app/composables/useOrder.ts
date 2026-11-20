import { cemeteries, extras, mosques, packages, prayerTimes, reserveMinutes } from '~/data/site'
import type { PackageId } from '~/data/site'

export interface OrderForm {
  gender: 'male' | 'female'
  age: 'adult' | 'child'
  location: 'home' | 'hospital' | 'morgue'
  address: string
  point?: { lat: number, lon: number }
  floor: number
  lift: boolean
  deathDay: 'today' | 'yesterday'
  deathTime: string
  slot?: string
  district: string
  mosque?: string
  cemetery?: string
  hasPlot: boolean
  packageId: PackageId
  extras: string[]
  wishes: string
  contactName: string
  contactPhone: string
  contactRelation: string
}

export interface JanazaSlot {
  id: string
  day: 'today' | 'tomorrow'
  prayer: 'zuhr' | 'asr'
  janaza: Date
  vidolash: Date
  available: boolean
}

function atTime(base: Date, hhmm: string, addDays = 0, offsetMin = 0) {
  const [h = 0, m = 0] = hhmm.split(':').map(Number)
  const d = new Date(base)
  d.setDate(d.getDate() + addDays)
  d.setHours(h, m + offsetMin, 0, 0)
  return d
}

export function useOrder() {
  const form = useState<OrderForm>('order-form', () => ({
    gender: 'male',
    age: 'adult',
    location: 'home',
    address: '',
    point: undefined,
    floor: 1,
    lift: true,
    deathDay: 'today',
    deathTime: '',
    slot: undefined,
    district: 'sino',
    mosque: undefined,
    cemetery: undefined,
    hasPlot: false,
    packageId: 'komil',
    extras: [],
    wishes: '',
    contactName: '',
    contactPhone: '',
    contactRelation: ''
  }))

  const orderId = useState<string | null>('order-id', () => null)

  const selectedPackage = computed(() => packages.find(p => p.id === form.value.packageId)!)
  const selectedMosque = computed(() => mosques.find(m => m.id === form.value.mosque))
  const selectedCemetery = computed(() => cemeteries.find(c => c.id === form.value.cemetery))

  const paidExtras = computed(() => extras.filter(e =>
    form.value.extras.includes(e.id) && !e.includedIn?.includes(form.value.packageId)
  ))

  const total = computed(() => selectedPackage.value.price + paidExtras.value.reduce((sum, e) => sum + e.price, 0))

  // Движок слотов (упрощённо): запас 4ч30 + 30 мин для зоны В или высотного выноса без лифта
  const reserve = computed(() => {
    const highNoLift = form.value.floor >= 5 && !form.value.lift
    const zoneC = selectedCemetery.value?.zone === 'В'
    return reserveMinutes.base + (highNoLift || zoneC ? reserveMinutes.extra : 0)
  })

  const slots = computed<JanazaSlot[]>(() => {
    const now = new Date()
    const offset = selectedMosque.value?.offset ?? 0
    const list: [JanazaSlot['day'], JanazaSlot['prayer'], string, number][] = [
      ['today', 'zuhr', prayerTimes.zuhr, 0],
      ['today', 'asr', prayerTimes.asr, 0],
      ['tomorrow', 'zuhr', prayerTimes.zuhr, 1],
      ['tomorrow', 'asr', prayerTimes.asr, 1]
    ]
    return list.map(([day, prayer, time, add]) => {
      const janaza = atTime(now, time, add, offset)
      return {
        id: `${add}-${prayer}`,
        day,
        prayer,
        janaza,
        vidolash: new Date(janaza.getTime() - 60 * 60 * 1000),
        available: (janaza.getTime() - now.getTime()) / 60000 >= reserve.value
      }
    })
  })

  const selectedSlot = computed(() => slots.value.find(s => s.id === form.value.slot))

  function submit() {
    orderId.value = `A-${Math.floor(1000 + Math.random() * 9000)}`
    return orderId.value
  }

  return {
    form,
    orderId,
    selectedPackage,
    selectedMosque,
    selectedCemetery,
    selectedSlot,
    paidExtras,
    total,
    reserve,
    slots,
    submit
  }
}
