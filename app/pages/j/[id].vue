<script setup lang="ts">
import { contacts } from '~/data/site'
import { demoOrder } from '~/data/demo-order'

const route = useRoute()
const id = computed(() => String(route.params.id))
const { t } = useI18n()
const { l } = useContent()

useSeoMeta({ title: () => t('share.metaTitle') })

const details = computed(() => demoOrder.details.map(d => ({
  icon: d.icon,
  title: l(d.title),
  description: l(d.description)
})))
</script>

<template>
  <UContainer class="pb-16">
    <UPageHero
      :headline="t('share.headline')"
      :title="l(demoOrder.deceased.name)"
      :description="`${demoOrder.deceased.years}. ${t('share.invite')}`"
      :ui="{ container: 'py-16 sm:py-20 lg:py-24' }"
    />

    <UPageGrid class="lg:grid-cols-3">
      <UPageCard
        v-for="d in details"
        :key="d.title"
        v-bind="d"
        variant="subtle"
      />
    </UPageGrid>

    <UPageSection :ui="{ container: 'px-0 sm:px-0 lg:px-0' }">
      <UPageCTA
        :title="t('share.ctaTitle')"
        :description="t('share.ctaDescription')"
        variant="subtle"
        :links="[
          { label: t('share.watch'), icon: 'i-lucide-video', size: 'xl', disabled: true },
          { label: t('share.route'), to: 'https://2gis.tj/dushanbe', target: '_blank', icon: 'i-lucide-navigation', size: 'xl', color: 'neutral', variant: 'outline' }
        ]"
      />
    </UPageSection>

    <UAlert
      icon="i-lucide-lock"
      color="neutral"
      variant="subtle"
      :title="t('share.privateTitle', { id })"
      :description="t('share.privateText', { phone: contacts.shortPhone })"
    />
  </UContainer>
</template>
