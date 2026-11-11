<script setup lang="ts">
const props = defineProps<{
  title: string
  description?: string
  label?: string
}>()

const { t } = useI18n()
const open = ref(false)
const name = ref('')
const phone = ref('')
const toast = useToast()

function send() {
  open.value = false
  toast.add({
    title: t('callback.sentTitle'),
    description: t('callback.sentText', { phone: phone.value }),
    icon: 'i-lucide-check-circle',
    color: 'success'
  })
  name.value = ''
  phone.value = ''
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="props.title"
    :description="props.description"
  >
    <UButton
      :label="props.label ?? t('callback.default')"
      trailing-icon="i-lucide-arrow-right"
    />

    <template #body>
      <UForm
        :state="{ name, phone }"
        class="space-y-4"
        @submit="send"
      >
        <UFormField
          :label="t('callback.name')"
          name="name"
        >
          <UInput
            v-model="name"
            :placeholder="t('callback.namePlaceholder')"
            size="xl"
            class="w-full"
          />
        </UFormField>
        <UFormField
          :label="t('callback.phone')"
          name="phone"
          required
        >
          <UInput
            v-model="phone"
            type="tel"
            placeholder="+992 ..."
            icon="i-lucide-phone"
            size="xl"
            class="w-full"
            required
          />
        </UFormField>
        <UButton
          type="submit"
          :label="t('callback.submit')"
          size="xl"
          block
        />
      </UForm>
    </template>
  </UModal>
</template>
