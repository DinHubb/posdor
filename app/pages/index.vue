<script setup lang="ts">
import { contacts, packages } from '~/data/site'
import type { PackageId } from '~/data/site'
import { articles } from '~/data/knowledge'

const { t } = useI18n()
const localePath = useLocalePath()
const { l, content, price } = useContent()
const { form } = useOrder()

useSeoMeta({ title: '' })

type Item = { title: string, description: string }

const tileTexts = content<Item[]>('home.tiles')
const stepTexts = content<Item[]>('home.steps')
const promiseTexts = content<Item[]>('home.promises')
const faq = content<{ label: string, content: string }[]>('home.faq')

const tileMeta = [
  { icon: 'i-lucide-hand-heart', to: '/order', highlight: true },
  { icon: 'i-lucide-sprout', to: { path: '/services', hash: '#care' } },
  { icon: 'i-lucide-tent', to: { path: '/services', hash: '#maraka' } },
  { icon: 'i-lucide-hand-coins', to: { path: '/services', hash: '#sadaqa' } }
]
const tiles = computed(() => tileTexts.value.map((text, i) => ({
  ...text,
  icon: tileMeta[i]!.icon,
  to: localePath(tileMeta[i]!.to),
  highlight: !!tileMeta[i]!.highlight
})))

const stepIcons = ['i-lucide-phone', 'i-lucide-user-round-check', 'i-lucide-route', 'i-lucide-radio']
const promiseIcons = ['i-lucide-clock-check', 'i-lucide-receipt', 'i-lucide-shield-check', 'i-lucide-users', 'i-lucide-globe', 'i-lucide-phone-call']
const promises = computed(() => promiseTexts.value.map((p, i) => ({ ...p, icon: promiseIcons[i] })))

function choosePackage(id: PackageId) {
  form.value.packageId = id
  navigateTo(localePath('/order'))
}
</script>

<template>
  <div>
    <UPageHero
      :headline="t('home.headline')"
      :title="t('home.title')"
      :description="t('home.description')"
      :links="[
        { label: t('common.organize'), to: localePath('/order'), size: 'xl', trailingIcon: 'i-lucide-arrow-right' },
        { label: t('common.callNumber', { phone: contacts.shortPhone }), to: contacts.phoneHref, size: 'xl', icon: 'i-lucide-phone', color: 'neutral', variant: 'outline' }
      ]"
    />

    <UPageSection
      id="services"
      :title="t('home.servicesTitle')"
      :ui="{ container: 'pt-0 sm:pt-0 lg:pt-0' }"
    >
      <UPageGrid class="lg:grid-cols-4">
        <UPageCard
          v-for="tile in tiles"
          :key="tile.title"
          :title="tile.title"
          :description="tile.description"
          :icon="tile.icon"
          :to="tile.to"
          :highlight="tile.highlight"
          spotlight
          :variant="tile.highlight ? 'soft' : 'outline'"
          :ui="{ leadingIcon: 'size-8' }"
        />
      </UPageGrid>
    </UPageSection>

    <UPageSection
      :title="t('home.howTitle')"
      :description="t('home.howDescription')"
      class="bg-elevated/40"
    >
      <UPageGrid class="lg:grid-cols-4">
        <UPageFeature
          v-for="(s, i) in stepTexts"
          :key="s.title"
          :title="`${i + 1}. ${s.title}`"
          :description="s.description"
          :icon="stepIcons[i]"
        />
      </UPageGrid>
    </UPageSection>

    <UPageSection
      id="packages"
      :title="t('home.packagesTitle')"
      :description="t('home.packagesDescription')"
    >
      <UPricingPlans>
        <UPricingPlan
          v-for="p in packages"
          :key="p.id"
          :title="l(p.title)"
          :description="l(p.description)"
          :tagline="l(p.tagline)"
          :price="price(p.price)"
          :features="p.features.map(f => l(f))"
          :highlight="p.highlight"
          :scale="p.highlight"
          :badge="p.highlight ? t('home.popular') : undefined"
          :button="{ label: t('common.choose'), onClick: () => choosePackage(p.id) }"
          :terms="t('home.terms')"
        />
      </UPricingPlans>
    </UPageSection>

    <UPageSection
      :title="t('home.promisesTitle')"
      :features="promises"
      class="bg-elevated/40"
    />

    <UPageSection
      :title="t('home.knowledgeTitle')"
      :description="t('home.knowledgeDescription')"
      :links="[{ label: t('common.allArticles'), to: localePath('/knowledge'), trailingIcon: 'i-lucide-arrow-right', color: 'neutral', variant: 'link' }]"
    >
      <UPageGrid class="lg:grid-cols-4">
        <UPageCard
          v-for="a in articles"
          :key="a.slug"
          :title="l(a.title)"
          :description="l(a.description)"
          :icon="a.icon"
          :to="localePath(`/knowledge/${a.slug}`)"
        />
      </UPageGrid>
    </UPageSection>

    <UPageSection
      :title="t('home.faqTitle')"
      :ui="{ container: 'max-w-3xl' }"
    >
      <UAccordion
        :items="faq"
        type="multiple"
      />
    </UPageSection>

    <UPageSection>
      <UPageCTA
        :title="t('home.ctaTitle')"
        :description="t('home.ctaDescription')"
        variant="subtle"
        :links="[
          { label: t('common.organize'), to: localePath('/order'), size: 'xl', trailingIcon: 'i-lucide-arrow-right' },
          { label: contacts.phone, to: contacts.phoneHref, size: 'xl', icon: 'i-lucide-phone', color: 'neutral', variant: 'outline' }
        ]"
      />
    </UPageSection>
  </div>
</template>
