<script setup lang="ts">
import { cemeteries, contacts, districts, extras, mosques, packages } from '~/data/site'
import type { JanazaSlot } from '~/composables/useOrder'

const { t } = useI18n()
const localePath = useLocalePath()
const { l, content, price, plusPrice } = useContent()

useSeoMeta({ title: () => t('order.metaTitle') })

const { form, slots, reserve, selectedPackage, selectedSlot, selectedMosque, selectedCemetery, paidExtras, total, submit } = useOrder()
const toast = useToast()

const stepTitles = content<string[]>('order.steps')
const stepIcons = ['i-lucide-user-round', 'i-lucide-clock', 'i-lucide-landmark', 'i-lucide-package', 'i-lucide-list-checks', 'i-lucide-message-square-heart', 'i-lucide-phone']
const steps = computed(() => stepTitles.value.map((title, i) => ({ title, icon: stepIcons[i] })))
const step = ref(0)
const isLast = computed(() => step.value === steps.value.length - 1)

const genderItems = computed(() => [
  { label: t('order.male'), value: 'male' },
  { label: t('order.female'), value: 'female' }
])
const ageItems = computed(() => [
  { label: t('order.adult'), value: 'adult' },
  { label: t('order.child'), value: 'child' }
])
const locationItems = computed(() => [
  { label: t('order.home'), value: 'home', icon: 'i-lucide-house' },
  { label: t('order.hospital'), value: 'hospital', icon: 'i-lucide-hospital' },
  { label: t('order.morgue'), value: 'morgue', icon: 'i-lucide-building-2' }
])
const dayItems = computed(() => [
  { label: t('common.today'), value: 'today' },
  { label: t('common.yesterday'), value: 'yesterday' }
])
const relationItems = content<string[]>('order.relations')
const districtItems = computed(() => districts.map(d => ({ value: d.value, label: l(d.label) })))

const reserveLabel = computed(() => t('order.reserve', { h: Math.floor(reserve.value / 60), m: reserve.value % 60 }))

function slotTitle(s: JanazaSlot, lower = false) {
  const day = t(`common.${s.day}`)
  const prayer = t(`common.${s.prayer}`)
  return t('order.slotLabel', {
    day: lower ? day.toLowerCase() : day,
    prayer: prayer.toLowerCase(),
    time: formatTime(s.janaza)
  })
}

const slotItems = computed(() => slots.value.map(s => ({
  value: s.id,
  label: slotTitle(s),
  description: s.available
    ? t('order.vidolashAt', { time: formatTime(s.vidolash) })
    : t('order.tooLate', { reserve: reserveLabel.value }),
  disabled: !s.available
})))

const firstAvailable = computed(() => slots.value.find(s => s.available))

watch(firstAvailable, (s) => {
  if (!selectedSlot.value?.available) form.value.slot = s?.id
}, { immediate: true })

const mosqueItems = computed(() => mosques
  .filter(m => m.district === form.value.district)
  .map(m => ({
    value: m.id,
    label: l(m.name),
    description: m.offset ? t('order.mosqueOffset', { m: m.offset }) : t('order.mosqueNoOffset')
  })))

watch(() => form.value.district, () => {
  if (!mosqueItems.value.some(m => m.value === form.value.mosque)) {
    form.value.mosque = mosqueItems.value[0]?.value
  }
}, { immediate: true })

const cemeteryItems = computed(() => cemeteries.map(c => ({
  value: c.id,
  label: `${l(c.name)} (${t('order.zone', { zone: c.zone })})`
})))

const packageItems = computed(() => packages.map(p => ({
  value: p.id,
  label: `${l(p.title)} · ${price(p.price)}`,
  description: l(p.tagline)
})))

const packageAccordion = computed(() => packages.map(p => ({
  label: t('order.whatsIncluded', { name: l(p.title) }),
  value: p.id,
  features: p.features.map(f => l(f))
})))
const openedPackage = ref<string | undefined>(form.value.packageId)

const extraItems = computed(() => extras.map((e) => {
  const included = e.includedIn?.includes(form.value.packageId)
  return {
    value: e.id,
    label: l(e.label),
    description: l(e.description),
    why: l(e.why),
    priceLabel: plusPrice(e.price),
    included,
    disabled: included
  }
}))

const recording = ref(false)
const voiceNote = ref<string | null>(null)
function toggleRecording() {
  if (recording.value) {
    recording.value = false
    voiceNote.value = '0:14'
  } else {
    recording.value = true
    voiceNote.value = null
  }
}

const canNext = computed(() => {
  if (step.value === 1) return !!selectedSlot.value?.available
  if (step.value === 2) return !!form.value.mosque && !!form.value.cemetery
  if (step.value === 6) return form.value.contactName.trim().length > 1 && form.value.contactPhone.trim().length >= 7
  return true
})

function next() {
  if (!canNext.value) return
  if (isLast.value) {
    const id = submit()
    toast.add({ title: t('order.sentTitle'), description: t('order.sentText', { id }), icon: 'i-lucide-check-circle', color: 'success' })
    navigateTo(localePath('/order/done'))
    return
  }
  step.value++
  if (import.meta.client) window.scrollTo({ top: 0, behavior: 'smooth' })
}

function back() {
  if (step.value > 0) step.value--
}
</script>

<template>
  <UContainer class="pb-16">
    <UPage :ui="{ center: 'lg:col-span-7', right: 'lg:col-span-3' }">
      <UPageHeader
        :headline="t('order.headline')"
        :title="t('order.title')"
        :description="t('order.description')"
      >
        <template #links>
          <UButton
            :to="contacts.phoneHref"
            icon="i-lucide-phone"
            :label="t('order.preferTalk', { phone: contacts.shortPhone })"
            color="neutral"
            variant="outline"
          />
        </template>
      </UPageHeader>

      <UPageBody>
        <UStepper
          v-model="step"
          :items="steps"
          size="sm"
          class="hidden md:flex"
        />
        <UProgress
          :model-value="step + 1"
          :max="steps.length"
          status
          class="md:hidden"
        >
          <template #status>
            {{ t('order.stepOf', { n: step + 1, total: steps.length, title: steps[step]?.title }) }}
          </template>
        </UProgress>

        <UCard :ui="{ body: 'space-y-6' }">
          <!-- 1. Покойный -->
          <template v-if="step === 0">
            <UFormField :label="t('order.gender')">
              <URadioGroup
                v-model="form.gender"
                :items="genderItems"
                orientation="horizontal"
                variant="card"
              />
            </UFormField>
            <UFormField :label="t('order.age')">
              <URadioGroup
                v-model="form.age"
                :items="ageItems"
                orientation="horizontal"
                variant="card"
              />
            </UFormField>
            <UFormField :label="t('order.location')">
              <URadioGroup
                v-model="form.location"
                :items="locationItems"
                orientation="horizontal"
                variant="card"
              />
            </UFormField>
            <UFormField
              :label="t('order.address')"
              :hint="t('order.addressHint')"
            >
              <UFieldGroup class="w-full">
                <UInput
                  v-model="form.address"
                  :placeholder="t('order.addressPlaceholder')"
                  icon="i-lucide-map-pin"
                  size="lg"
                  class="w-full"
                />
                <UButton
                  icon="i-lucide-map"
                  :label="t('order.map')"
                  color="neutral"
                  variant="subtle"
                  @click="toast.add({ title: t('order.mapToastTitle'), description: t('order.mapToastText') })"
                />
              </UFieldGroup>
            </UFormField>
            <UPageGrid class="sm:grid-cols-2 lg:grid-cols-2">
              <UFormField :label="t('order.floor')">
                <UInputNumber
                  v-model="form.floor"
                  :min="1"
                  :max="30"
                  size="lg"
                />
              </UFormField>
              <UFormField
                :label="t('order.lift')"
                :description="t('order.liftHint')"
              >
                <USwitch
                  v-model="form.lift"
                  :label="t('order.hasLift')"
                />
              </UFormField>
            </UPageGrid>
          </template>

          <!-- 2. Время -->
          <template v-else-if="step === 1">
            <UPageGrid class="sm:grid-cols-2 lg:grid-cols-2">
              <UFormField :label="t('order.deathDay')">
                <URadioGroup
                  v-model="form.deathDay"
                  :items="dayItems"
                  orientation="horizontal"
                  variant="card"
                />
              </UFormField>
              <UFormField :label="t('order.deathTime')">
                <UInput
                  v-model="form.deathTime"
                  type="time"
                  icon="i-lucide-clock"
                  size="lg"
                />
              </UFormField>
            </UPageGrid>

            <UFormField
              :label="t('order.slot')"
              :description="t('order.slotHint', { reserve: reserveLabel })"
            >
              <URadioGroup
                v-model="form.slot"
                :items="slotItems"
                variant="card"
              />
            </UFormField>

            <UAlert
              v-if="firstAvailable && firstAvailable.day === 'tomorrow'"
              icon="i-lucide-info"
              color="neutral"
              variant="subtle"
              :title="t('order.tomorrowTitle')"
              :description="t('order.tomorrowText', { prayer: t(`common.${firstAvailable.prayer}`).toLowerCase(), time: formatTime(firstAvailable.janaza) })"
            />
          </template>

          <!-- 3. Мечеть и кладбище -->
          <template v-else-if="step === 2">
            <UFormField :label="t('order.district')">
              <USelect
                v-model="form.district"
                :items="districtItems"
                size="lg"
                class="w-full"
              />
            </UFormField>
            <UFormField :label="t('order.mosque')">
              <URadioGroup
                v-model="form.mosque"
                :items="mosqueItems"
                variant="card"
              />
            </UFormField>
            <UFormField :label="t('order.cemetery')">
              <USelect
                v-model="form.cemetery"
                :items="cemeteryItems"
                :placeholder="t('order.cemeteryPlaceholder')"
                size="lg"
                class="w-full"
              />
            </UFormField>
            <UCheckbox
              v-model="form.hasPlot"
              :label="t('order.hasPlot')"
              :description="t('order.hasPlotHint')"
              variant="card"
            />
          </template>

          <!-- 4. Пакет -->
          <template v-else-if="step === 3">
            <URadioGroup
              v-model="form.packageId"
              :items="packageItems"
              variant="card"
              @update:model-value="(v) => openedPackage = v as string"
            />
            <UAccordion
              v-model="openedPackage"
              :items="packageAccordion"
            >
              <template #body="{ item }">
                <UPageList>
                  <UPageFeature
                    v-for="f in item.features"
                    :key="f"
                    :title="f"
                    icon="i-lucide-check"
                    orientation="horizontal"
                  />
                </UPageList>
              </template>
            </UAccordion>
          </template>

          <!-- 5. Доп. услуги -->
          <template v-else-if="step === 4">
            <UCheckboxGroup
              v-model="form.extras"
              :items="extraItems"
              variant="card"
            >
              <template #label="{ item }">
                {{ item.label }}
                <UBadge
                  v-if="item.included"
                  :label="t('order.inPackage')"
                  variant="subtle"
                  size="sm"
                />
                <UBadge
                  v-else
                  :label="item.priceLabel"
                  color="neutral"
                  variant="outline"
                  size="sm"
                />
              </template>
              <template #description="{ item }">
                {{ item.description }}
                <UAlert
                  v-if="item.why"
                  :description="item.why"
                  icon="i-lucide-info"
                  color="neutral"
                  variant="soft"
                  class="mt-2"
                />
              </template>
            </UCheckboxGroup>
          </template>

          <!-- 6. Пожелания -->
          <template v-else-if="step === 5">
            <UFormField
              :label="t('order.wishes')"
              :description="t('order.wishesHint')"
            >
              <UTextarea
                v-model="form.wishes"
                :rows="5"
                autoresize
                :placeholder="t('order.wishesPlaceholder')"
                size="lg"
                class="w-full"
              />
            </UFormField>
            <UFieldGroup>
              <UButton
                :icon="recording ? 'i-lucide-square' : 'i-lucide-mic'"
                :label="recording ? t('order.stopVoice') : t('order.recordVoice')"
                :color="recording ? 'error' : 'neutral'"
                variant="subtle"
                size="lg"
                @click="toggleRecording"
              />
            </UFieldGroup>
            <UBadge
              v-if="voiceNote"
              :label="t('order.voiceNote', { d: voiceNote })"
              icon="i-lucide-audio-lines"
              variant="subtle"
              size="lg"
            />
          </template>

          <!-- 7. Контакт -->
          <template v-else-if="step === 6">
            <UFormField
              :label="t('order.name')"
              required
            >
              <UInput
                v-model="form.contactName"
                :placeholder="t('order.namePlaceholder')"
                size="lg"
                class="w-full"
              />
            </UFormField>
            <UFormField
              :label="t('order.phone')"
              required
              :description="t('order.phoneHint')"
            >
              <UInput
                v-model="form.contactPhone"
                type="tel"
                placeholder="+992 ..."
                icon="i-lucide-phone"
                size="lg"
                class="w-full"
              />
            </UFormField>
            <UFormField :label="t('order.relation')">
              <USelect
                v-model="form.contactRelation"
                :items="relationItems"
                :placeholder="t('order.relationPlaceholder')"
                size="lg"
                class="w-full"
              />
            </UFormField>
            <UAlert
              icon="i-lucide-shield-check"
              color="neutral"
              variant="subtle"
              :title="t('order.privacyTitle')"
              :description="t('order.privacyText')"
            />
          </template>

          <template #footer>
            <UFieldGroup class="w-full justify-between gap-3">
              <UButton
                v-if="step > 0"
                :label="t('common.back')"
                icon="i-lucide-arrow-left"
                color="neutral"
                variant="ghost"
                size="xl"
                @click="back"
              />
              <UButton
                :label="isLast ? t('order.submit') : t('common.next')"
                :trailing-icon="isLast ? 'i-lucide-send' : 'i-lucide-arrow-right'"
                :disabled="!canNext"
                size="xl"
                class="ms-auto"
                @click="next"
              />
            </UFieldGroup>
          </template>
        </UCard>
      </UPageBody>

      <template #right>
        <UPageAside :ui="{ root: 'lg:pe-0 overflow-visible' }">
          <UCard :ui="{ body: 'space-y-4' }">
            <template #header>
              <UUser
                :name="t('order.summary')"
                :description="t('order.packageName', { name: l(selectedPackage.title) })"
                :avatar="{ icon: 'i-lucide-clipboard-list' }"
              />
            </template>

            <UPageList>
              <UPageFeature
                v-if="selectedSlot"
                icon="i-lucide-clock"
                :title="slotTitle(selectedSlot)"
                :description="t('order.vidolashAt', { time: formatTime(selectedSlot.vidolash) })"
                orientation="horizontal"
              />
              <UPageFeature
                v-if="selectedMosque"
                icon="i-lucide-landmark"
                :title="l(selectedMosque.name)"
                :description="l(selectedCemetery?.name)"
                orientation="horizontal"
              />
            </UPageList>

            <USeparator />

            <UPageList>
              <UPageFeature
                :title="`«${l(selectedPackage.title)}»`"
                :description="price(selectedPackage.price)"
                icon="i-lucide-package"
                orientation="horizontal"
              />
              <UPageFeature
                v-for="e in paidExtras"
                :key="e.id"
                :title="l(e.label)"
                :description="plusPrice(e.price)"
                icon="i-lucide-plus"
                orientation="horizontal"
              />
            </UPageList>

            <template #footer>
              <UPageFeature
                :title="t('order.total')"
                :description="price(total)"
                icon="i-lucide-receipt"
                orientation="horizontal"
                :ui="{ description: 'text-xl font-semibold text-highlighted' }"
              />
            </template>
          </UCard>
        </UPageAside>
      </template>
    </UPage>
  </UContainer>
</template>
