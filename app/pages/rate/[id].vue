<script setup lang="ts">
const route = useRoute()
const { t } = useI18n()
const localePath = useLocalePath()

useSeoMeta({ title: () => t('rate.metaTitle') })

const rating = ref(0)
const comment = ref('')
const sent = ref(false)
</script>

<template>
  <UContainer class="max-w-2xl pb-28 lg:pb-16">
    <UPageHeader
      :headline="t('rate.headline', { id: route.params.id })"
      :title="t('rate.title')"
      :description="t('rate.description')"
    />

    <UCard
      v-if="!sent"
      class="my-8"
      :ui="{ body: 'space-y-6' }"
    >
      <UFormField :label="t('rate.rating')">
        <UInputRating
          v-model="rating"
          size="xl"
        />
      </UFormField>
      <UFormField
        :label="t('rate.comment')"
        :description="t('rate.optional')"
      >
        <UTextarea
          v-model="comment"
          :rows="4"
          :placeholder="t('rate.commentPlaceholder')"
          class="w-full"
        />
      </UFormField>
      <UButton
        :label="t('common.send')"
        size="xl"
        :disabled="!rating"
        @click="sent = true"
      />
    </UCard>

    <UEmpty
      v-else
      icon="i-lucide-heart"
      :title="t('rate.thanks')"
      :description="t('rate.thanksText')"
      :actions="[{ label: t('common.toHome'), to: localePath('/'), color: 'neutral', variant: 'outline' }]"
      class="my-8"
    />
  </UContainer>
</template>
