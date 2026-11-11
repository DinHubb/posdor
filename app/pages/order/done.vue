<script setup lang="ts">
import { contacts, firstSteps } from '~/data/site'

const { t } = useI18n()
const localePath = useLocalePath()
const { l, content, price } = useContent()

useSeoMeta({ title: () => t('done.metaTitle') })

const { orderId, form, selectedPackage, selectedSlot, selectedMosque, total } = useOrder()
const id = computed(() => orderId.value ?? 'A-1024')
const done = ref<string[]>([])

const checklist = computed(() => firstSteps.map((s, i) => ({ label: l(s), value: String(i) })))

const paymentIcons = ['i-lucide-credit-card', 'i-lucide-wallet', 'i-lucide-banknote', 'i-lucide-globe']
const paymentTexts = content<{ title: string, description: string }[]>('done.payments')
const payments = computed(() => paymentTexts.value.map((p, i) => ({ ...p, icon: paymentIcons[i] })))
</script>

<template>
  <UContainer class="pb-28 lg:pb-16">
    <UPageHero
      :headline="t('done.headline', { id })"
      :title="t('done.title')"
      :description="t('done.description', { phone: form.contactPhone || t('done.fromOrder') })"
      :links="[
        { label: t('done.status'), to: localePath(`/status/${id}`), size: 'xl', icon: 'i-lucide-list-checks' },
        { label: t('common.callNumber', { phone: contacts.shortPhone }), to: contacts.phoneHref, size: 'xl', icon: 'i-lucide-phone', color: 'neutral', variant: 'outline' }
      ]"
    />

    <UPageGrid class="lg:grid-cols-2">
      <UPageCard
        :title="t('done.nowTitle')"
        icon="i-lucide-list-todo"
        variant="subtle"
      >
        <UCheckboxGroup
          v-model="done"
          :items="checklist"
        />
      </UPageCard>

      <UPageCard
        :title="t('done.yourOrder')"
        icon="i-lucide-clipboard-list"
        variant="subtle"
      >
        <UPageList>
          <UPageFeature
            :title="t('order.packageName', { name: l(selectedPackage.title) })"
            :description="t('done.totalAfter', { total: price(total) })"
            icon="i-lucide-package"
            orientation="horizontal"
          />
          <UPageFeature
            v-if="selectedSlot"
            :title="t('done.janaza', { day: t(`common.${selectedSlot.day}`).toLowerCase(), prayer: t(`common.${selectedSlot.prayer}`).toLowerCase(), time: formatTime(selectedSlot.janaza) })"
            :description="l(selectedMosque?.name)"
            icon="i-lucide-clock"
            orientation="horizontal"
          />
        </UPageList>
        <UButton
          :to="localePath(`/j/${id}`)"
          :label="t('done.shareLink')"
          icon="i-lucide-share-2"
          color="neutral"
          variant="outline"
        />
      </UPageCard>
    </UPageGrid>

    <UPageSection
      :title="t('done.paymentTitle')"
      :description="t('done.paymentDescription')"
      :features="payments"
      :ui="{ container: 'px-0 sm:px-0 lg:px-0' }"
    />
  </UContainer>
</template>
