<script setup lang="ts">
import { articles } from '~/data/knowledge'

const { t } = useI18n()
const localePath = useLocalePath()
const { l } = useContent()

useSeoMeta({ title: () => t('knowledge.metaTitle') })
</script>

<template>
  <UContainer class="pb-16">
    <UPageHeader
      :headline="t('knowledge.headline')"
      :title="t('knowledge.title')"
      :description="t('knowledge.description')"
    />

    <UPageGrid class="my-8 lg:grid-cols-2">
      <UPageCard
        v-for="a in articles"
        :key="a.slug"
        :title="l(a.title)"
        :description="l(a.description)"
        :icon="a.icon"
        :to="localePath(`/knowledge/${a.slug}`)"
        spotlight
      >
        <template #footer>
          <UBadge
            :label="l(a.readTime)"
            icon="i-lucide-book-open"
            color="neutral"
            variant="subtle"
          />
        </template>
      </UPageCard>
    </UPageGrid>
  </UContainer>
</template>
