<script setup lang="ts">
import { carePlans, marakaItems, sadaqaItems } from '~/data/services'
import type { ServiceItem } from '~/data/services'

const { t } = useI18n()
const localePath = useLocalePath()
const { l, price } = useContent()

useSeoMeta({ title: () => t('services.metaTitle') })

const plans = computed(() => carePlans.map(p => ({
  title: l(p.title),
  description: l(p.description),
  badge: l(p.badge),
  price: price(p.price),
  billingCycle: p.perMonth ? t('services.perMonth') : undefined,
  features: p.features.map(f => l(f)),
  highlight: p.highlight,
  scale: p.highlight
})))

const toFeatures = (items: ServiceItem[]) => items.map(i => ({ icon: i.icon, title: l(i.title), description: l(i.description) }))
const maraka = computed(() => toFeatures(marakaItems))
const sadaqa = computed(() => toFeatures(sadaqaItems))
</script>

<template>
  <div class="pb-24 lg:pb-0">
    <UPageHero
      :headline="t('services.headline')"
      :title="t('services.title')"
      :description="t('services.description')"
    />

    <UPageSection
      id="care"
      :title="t('services.careTitle')"
      :description="t('services.careDescription')"
      :ui="{ container: 'pt-0 sm:pt-0 lg:pt-0' }"
    >
      <UPricingPlans>
        <UPricingPlan
          v-for="p in plans"
          :key="p.title"
          v-bind="p"
          :button="{ label: t('services.subscribe') }"
        />
      </UPricingPlans>
    </UPageSection>

    <UPageSection
      id="maraka"
      :title="t('services.marakaTitle')"
      :description="t('services.marakaDescription')"
      :features="maraka"
      class="bg-elevated/40"
    >
      <template #links>
        <CallbackModal
          :title="t('services.marakaTitle')"
          :description="t('services.marakaModal')"
          :label="t('services.marakaButton')"
        />
      </template>
    </UPageSection>

    <UPageSection
      id="sadaqa"
      :title="t('services.sadaqaTitle')"
      :description="t('services.sadaqaDescription')"
      :features="sadaqa"
    >
      <template #links>
        <CallbackModal
          :title="t('services.sadaqaTitle')"
          :description="t('services.sadaqaModal')"
          :label="t('services.sadaqaButton')"
        />
      </template>
    </UPageSection>

    <UPageSection>
      <UPageCTA
        :title="t('services.khotiraTitle')"
        :description="t('services.khotiraDescription')"
        variant="subtle"
        :links="[{ label: t('services.khotiraButton'), to: localePath('/khotira'), trailingIcon: 'i-lucide-arrow-right', color: 'neutral', variant: 'outline' }]"
      />
    </UPageSection>
  </div>
</template>
