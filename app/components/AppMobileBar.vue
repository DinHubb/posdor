<script setup lang="ts">
import { contacts } from '~/data/site'

const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <UCard
    class="fixed inset-x-0 bottom-0 z-50 rounded-none lg:hidden"
    :ui="{ body: 'p-3 sm:p-3 flex gap-2' }"
  >
    <UButton
      :to="contacts.phoneHref"
      icon="i-lucide-phone"
      :label="t('common.call')"
      size="xl"
      color="neutral"
      variant="outline"
      class="flex-1 justify-center"
    />
    <UButton
      :to="localePath('/order')"
      :label="t('common.organizeShort')"
      trailing-icon="i-lucide-arrow-right"
      size="xl"
      class="flex-1 justify-center"
    />
  </UCard>
</template>
