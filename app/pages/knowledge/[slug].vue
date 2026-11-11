<script setup lang="ts">
import { articles } from '~/data/knowledge'

const route = useRoute()
const { t } = useI18n()
const localePath = useLocalePath()
const { l } = useContent()

const article = computed(() => articles.find(a => a.slug === route.params.slug))

if (!article.value) {
  throw createError({ statusCode: 404, message: t('knowledge.notFound'), fatal: true })
}

useSeoMeta({
  title: () => l(article.value?.title),
  description: () => l(article.value?.description)
})

const others = computed(() => articles
  .filter(a => a.slug !== route.params.slug)
  .map(a => ({ label: l(a.title), to: localePath(`/knowledge/${a.slug}`), icon: a.icon })))
</script>

<template>
  <UContainer
    v-if="article"
    class="pb-28 lg:pb-16"
  >
    <UPage>
      <UPageHeader
        :title="l(article.title)"
        :description="l(article.description)"
        :headline="`${t('knowledge.headline')} · ${l(article.readTime)}`"
      >
        <template #links>
          <UButton
            :to="localePath('/knowledge')"
            :label="t('common.allArticles')"
            icon="i-lucide-arrow-left"
            color="neutral"
            variant="ghost"
          />
        </template>
      </UPageHeader>

      <UPageBody>
        <template
          v-for="(s, i) in article.sections"
          :key="i"
        >
          <ProseH2 :id="`section-${i}`">
            {{ l(s.title) }}
          </ProseH2>
          <ProseP
            v-for="(p, j) in s.paragraphs"
            :key="j"
          >
            {{ l(p) }}
          </ProseP>
          <ProseUl v-if="s.list">
            <ProseLi
              v-for="(li, j) in s.list"
              :key="j"
            >
              {{ l(li) }}
            </ProseLi>
          </ProseUl>
        </template>

        <UPageCTA
          :title="t('knowledge.helpTitle')"
          :description="t('knowledge.helpText')"
          variant="subtle"
          orientation="horizontal"
          :links="[{ label: t('common.organize'), to: localePath('/order'), trailingIcon: 'i-lucide-arrow-right' }]"
          class="mt-12"
        />
      </UPageBody>

      <template #right>
        <UPageAside>
          <UPageLinks
            :title="t('knowledge.more')"
            :links="others"
          />
        </UPageAside>
      </template>
    </UPage>
  </UContainer>
</template>
