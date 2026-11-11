<script setup lang="ts">
import { contacts } from '~/data/site'

const { t } = useI18n()

useSeoMeta({ title: () => t('khotira.metaTitle') })

const name = ref('')
const year = ref<number>()
const searched = ref(false)
</script>

<template>
  <UContainer class="max-w-3xl pb-28 lg:pb-16">
    <UPageHero
      :headline="t('khotira.headline')"
      :title="t('khotira.title')"
      :description="t('khotira.description')"
    />

    <UCard :ui="{ body: 'space-y-4' }">
      <UPageGrid class="sm:grid-cols-3 lg:grid-cols-3">
        <UFormField
          :label="t('khotira.name')"
          class="sm:col-span-2"
        >
          <UInput
            v-model="name"
            :placeholder="t('khotira.namePlaceholder')"
            icon="i-lucide-search"
            size="lg"
            class="w-full"
          />
        </UFormField>
        <UFormField :label="t('khotira.year')">
          <UInputNumber
            v-model="year"
            :min="1900"
            :max="2026"
            :format-options="{ useGrouping: false }"
            placeholder="2020"
            size="lg"
          />
        </UFormField>
      </UPageGrid>
      <UButton
        :label="t('khotira.search')"
        icon="i-lucide-search"
        size="lg"
        :disabled="!name"
        @click="searched = true"
      />
    </UCard>

    <UEmpty
      v-if="searched"
      icon="i-lucide-map"
      :title="t('khotira.emptyTitle')"
      :description="t('khotira.emptyText')"
      :actions="[{ label: t('common.callNumber', { phone: contacts.shortPhone }), to: contacts.phoneHref, icon: 'i-lucide-phone' }]"
      class="my-8"
    />
  </UContainer>
</template>
