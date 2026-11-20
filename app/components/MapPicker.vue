<script setup lang="ts">
import { DUSHANBE, getCurrentPosition } from '~/composables/use2gis'
import type { GeoAddress, GeoErrorCode, GeoPoint, Mapgl, MapglMap, MapglMarker } from '~/composables/use2gis'

const props = defineProps<{
  label: string
}>()

const emit = defineEmits<{
  pick: [value: { address: GeoAddress | null, point: GeoPoint }]
}>()

const point = defineModel<GeoPoint | undefined>('point')

const { t } = useI18n()
const toast = useToast()
const { key, enabled, loadMapgl, reverseGeocode } = use2gis()

const open = ref(false)
const container = ref<HTMLElement | null>(null)
const picked = ref<GeoPoint | undefined>(point.value)
const address = ref<GeoAddress | null>(null)
const resolving = ref(false)
const failed = ref(false)
const locating = ref(false)

let mapgl: Mapgl | null = null
let map: MapglMap | null = null
let marker: MapglMarker | null = null

function zoomBy(delta: number) {
  if (map) map.setZoom(map.getZoom() + delta, { duration: 300 })
}

function onButton() {
  if (!enabled) {
    toast.add({ title: t('order.mapToastTitle'), description: t('order.mapToastText') })
    return
  }
  open.value = true
}

async function setPoint(p: GeoPoint) {
  picked.value = p
  const coords: [number, number] = [p.lon, p.lat]
  if (marker) {
    marker.setCoordinates(coords)
  } else if (mapgl && map) {
    marker = new mapgl.Marker(map, { coordinates: coords })
  }
  resolving.value = true
  address.value = await reverseGeocode(p)
  resolving.value = false
}

async function initMap() {
  failed.value = false
  try {
    mapgl = await loadMapgl()
    await nextTick()
    if (!container.value) return
    const start = picked.value ?? DUSHANBE
    map = new mapgl.Map(container.value, {
      key,
      center: [start.lon, start.lat],
      zoom: picked.value ? 16 : 12,
      zoomControl: false
    })
    map.on('click', (e) => {
      const [lon, lat] = e.lngLat
      setPoint({ lat, lon })
    })
    if (picked.value) setPoint(picked.value)
  } catch {
    failed.value = true
  }
}

function destroyMap() {
  marker?.destroy()
  map?.destroy()
  marker = null
  map = null
}

async function locate(): Promise<GeoPoint | null> {
  locating.value = true
  try {
    return await getCurrentPosition()
  } catch (e) {
    const code = (typeof e === 'string' ? e : 'unavailable') as GeoErrorCode
    toast.add({
      title: t('order.geoErrorTitle'),
      description: t(`order.geoError.${code}`),
      icon: 'i-lucide-locate-off',
      color: 'warning'
    })
    return null
  } finally {
    locating.value = false
  }
}

// Кнопка в модалке: центрирует карту и ставит точку
async function locateOnMap() {
  const p = await locate()
  if (!p) return
  map?.setCenter([p.lon, p.lat])
  map?.setZoom(17)
  setPoint(p)
}

// Кнопка у поля адреса: сразу сохраняет точку без открытия карты
async function locateDirect() {
  const p = await locate()
  if (!p) return
  point.value = p
  picked.value = p
  resolving.value = true
  const found = enabled ? await reverseGeocode(p) : null
  resolving.value = false
  address.value = found
  emit('pick', { address: found, point: p })
  toast.add({
    title: t('order.geoSuccessTitle'),
    description: found?.text ?? t('order.geoSuccessText'),
    icon: 'i-lucide-locate-fixed',
    color: 'success'
  })
}

function confirm() {
  if (!picked.value) return
  point.value = picked.value
  emit('pick', { address: address.value, point: picked.value })
  open.value = false
}

watch(open, (v) => {
  if (v) initMap()
  else destroyMap()
})

onBeforeUnmount(destroyMap)
</script>

<template>
  <UButton
    icon="i-lucide-locate-fixed"
    color="neutral"
    variant="subtle"
    :loading="locating || resolving"
    :aria-label="t('order.mapLocate')"
    :title="t('order.mapLocate')"
    @click="locateDirect"
  />
  <UButton
    icon="i-lucide-map"
    :label="props.label"
    color="neutral"
    variant="subtle"
    @click="onButton"
  />

  <UModal
    v-model:open="open"
    :title="t('order.mapTitle')"
    :description="t('order.mapDescription')"
    :ui="{ content: 'sm:max-w-2xl' }"
  >
    <template #body>
      <div class="relative h-[60vh] max-h-[480px] overflow-hidden rounded-lg bg-elevated">
        <div
          ref="container"
          class="size-full"
        />
        <div
          v-if="failed"
          class="absolute inset-0 flex items-center justify-center p-6 text-center text-muted"
        >
          {{ t('order.mapError') }}
        </div>
        <div
          v-if="!failed"
          class="absolute top-1/2 right-3 flex -translate-y-1/2 flex-col gap-2"
        >
          <div class="flex flex-col divide-y divide-[#ececec] overflow-hidden rounded-lg bg-white shadow-[0_1px_3px_#26262680]">
            <button
              type="button"
              class="grid size-10 cursor-pointer place-items-center text-[#262626] hover:bg-[#f5f5f5] disabled:cursor-default"
              :aria-label="t('order.mapZoomIn')"
              @click="zoomBy(1)"
            >
              <UIcon
                name="i-lucide-plus"
                class="size-5"
              />
            </button>
            <button
              type="button"
              class="grid size-10 cursor-pointer place-items-center text-[#262626] hover:bg-[#f5f5f5] disabled:cursor-default"
              :aria-label="t('order.mapZoomOut')"
              @click="zoomBy(-1)"
            >
              <UIcon
                name="i-lucide-minus"
                class="size-5"
              />
            </button>
          </div>
          <div class="flex flex-col divide-y divide-[#ececec] overflow-hidden rounded-lg bg-white shadow-[0_1px_3px_#26262680]">
            <button
              type="button"
              class="grid size-10 cursor-pointer place-items-center text-[#262626] hover:bg-[#f5f5f5] disabled:cursor-default"
              :disabled="locating"
              :title="t('order.mapLocate')"
              :aria-label="t('order.mapLocate')"
              @click="locateOnMap"
            >
              <UIcon
                :name="locating ? 'i-lucide-loader-circle' : 'i-lucide-locate-fixed'"
                :class="['size-5', locating && 'animate-spin text-[#028eff]']"
              />
            </button>
          </div>
        </div>
      </div>
      <p class="mt-3 flex min-h-6 items-center gap-2 text-sm">
        <UIcon
          :name="resolving ? 'i-lucide-loader-circle' : 'i-lucide-map-pin'"
          :class="['size-4 shrink-0 text-primary', resolving && 'animate-spin']"
        />
        <span v-if="picked && address">{{ address.text }}</span>
        <span
          v-else-if="picked && !resolving"
          class="text-muted"
        >{{ t('order.mapNoAddress') }}</span>
        <span
          v-else-if="!picked"
          class="text-muted"
        >{{ t('order.mapHint') }}</span>
      </p>
    </template>

    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton
          :label="t('order.mapCancel')"
          color="neutral"
          variant="ghost"
          @click="open = false"
        />
        <UButton
          :label="t('order.mapConfirm')"
          icon="i-lucide-check"
          :disabled="!picked || resolving"
          @click="confirm"
        />
      </div>
    </template>
  </UModal>
</template>
