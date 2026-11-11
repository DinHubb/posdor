<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <UUser
    :name="t('common.brand')"
    :description="t('common.tagline')"
    :avatar="{ icon: 'i-lucide-moon-star', ui: { root: 'bg-primary/10', icon: 'text-primary' } }"
    size="md"
  />
</template>
