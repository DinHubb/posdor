// Загрузка 2ГИС MapGL JS API и обратное геокодирование через Places API.
// Ключ задаётся переменной окружения NUXT_PUBLIC_DGIS_KEY.

export interface GeoPoint {
  lat: number
  lon: number
}

// Центр Душанбе
export const DUSHANBE: GeoPoint = { lat: 38.5598, lon: 68.787 }

// Минимальные типы MapGL — только то, что используем
type LngLat = [number, number]
export interface MapglMap {
  on(event: 'click', cb: (e: { lngLat: LngLat }) => void): void
  setCenter(c: LngLat): void
  getZoom(): number
  setZoom(z: number, opts?: { duration?: number }): void
  destroy(): void
}
export interface MapglMarker {
  setCoordinates(c: LngLat): void
  destroy(): void
}
export interface Mapgl {
  Map: new (el: HTMLElement, opts: { key: string, center: LngLat, zoom: number, zoomControl?: boolean }) => MapglMap
  Marker: new (map: MapglMap, opts: { coordinates: LngLat }) => MapglMarker
}
type MapglWindow = Window & { mapgl?: Mapgl }

interface GeocodeResponse {
  result?: { items?: { type?: string, address_name?: string, full_name?: string, name?: string }[] }
}

const MAPGL_SRC = 'https://mapgl.2gis.com/api/js/v1'

let loading: Promise<Mapgl> | null = null

function loadMapgl(): Promise<Mapgl> {
  const w = window as MapglWindow
  if (w.mapgl) return Promise.resolve(w.mapgl)
  if (loading) return loading
  loading = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = MAPGL_SRC
    script.async = true
    script.onload = () => w.mapgl ? resolve(w.mapgl) : reject(new Error('2GIS MapGL missing'))
    script.onerror = () => {
      loading = null
      reject(new Error('2GIS MapGL failed to load'))
    }
    document.head.appendChild(script)
  })
  return loading
}

export type GeoErrorCode = 'unsupported' | 'denied' | 'unavailable'

// Текущее местоположение браузера; отклоняется с GeoErrorCode
export function getCurrentPosition(): Promise<GeoPoint> {
  return new Promise((resolve, reject) => {
    if (!import.meta.client || !navigator.geolocation) {
      reject('unsupported' satisfies GeoErrorCode)
      return
    }
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      err => reject((err.code === err.PERMISSION_DENIED ? 'denied' : 'unavailable') satisfies GeoErrorCode),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    )
  })
}

export interface GeoAddress {
  text: string
  // true — найден дом или улица; false — только район/город
  precise: boolean
}

export function use2gis() {
  const key = useRuntimeConfig().public.dgisKey as string

  async function reverseGeocode(p: GeoPoint): Promise<GeoAddress | null> {
    const params = new URLSearchParams({
      lat: String(p.lat),
      lon: String(p.lon),
      fields: 'items.address_name,items.full_name',
      key
    })
    try {
      const res = await $fetch<GeocodeResponse>(`https://catalog.api.2gis.com/3.0/items/geocode?${params}`)
      const item = res?.result?.items?.[0]
      const text = item?.address_name || item?.full_name || item?.name
      if (!text) return null
      return { text, precise: !!item?.address_name || item?.type === 'street' }
    } catch {
      return null
    }
  }

  return {
    key,
    enabled: !!key,
    loadMapgl,
    reverseGeocode
  }
}
