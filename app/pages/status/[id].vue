<script setup lang="ts">
import { contacts, statusIcons } from '~/data/site'
import { demoOrder } from '~/data/demo-order'

const route = useRoute()
const id = computed(() => String(route.params.id))
const { t } = useI18n()
const localePath = useLocalePath()
const { l, content } = useContent()

useSeoMeta({ title: () => t('status.metaTitle', { id: id.value }) })

const current = ref(2)
const statusTexts = content<{ title: string, description: string }[]>('statuses')

const items = computed(() => statusTexts.value.map((s, i) => ({
  ...s,
  icon: statusIcons[i],
  value: i,
  date: i <= current.value
    ? t('status.doneAt', { time: demoOrder.statusTimes[i] })
    : t('status.expectedAt', { time: demoOrder.statusTimes[i] })
})))

const toast = useToast()
async function copyLink() {
  const url = `${window.location.origin}${localePath(`/j/${id.value}`)}`
  await navigator.clipboard?.writeText(url)
  toast.add({ title: t('status.copiedTitle'), description: t('status.copiedText'), icon: 'i-lucide-link' })
}
</script>

<template>
  <UContainer class="pb-16">
    <UPage :ui="{ center: 'lg:col-span-7', right: 'lg:col-span-3' }">
      <UPageHeader
        :headline="t('status.headline', { id })"
        :title="t('status.title')"
        :description="t('status.description')"
      >
        <template #links>
          <UButton
            :label="t('status.share')"
            icon="i-lucide-share-2"
            color="neutral"
            variant="outline"
            @click="copyLink"
          />
        </template>
      </UPageHeader>

      <UPageBody>
        <UCard>
          <UTimeline
            v-model="current"
            :items="items"
            size="lg"
          />
        </UCard>

        <UAlert
          icon="i-lucide-info"
          color="neutral"
          variant="subtle"
          :title="t('common.demo')"
          :description="t('status.demoText')"
        />
      </UPageBody>

      <template #right>
        <UPageAside :ui="{ root: 'lg:pe-0 overflow-visible' }">
          <UPageCard
            :title="t('status.rahnamo')"
            variant="subtle"
          >
            <UUser
              :name="l(demoOrder.rahnamo.name)"
              :description="t('status.rahnamoRole')"
              :avatar="{ alt: l(demoOrder.rahnamo.name) }"
              size="xl"
            />
            <UFieldGroup class="w-full">
              <UButton
                :to="demoOrder.rahnamo.phoneHref"
                icon="i-lucide-phone"
                :label="t('common.call')"
                block
              />
              <UButton
                :to="contacts.telegram"
                target="_blank"
                icon="i-simple-icons-telegram"
                aria-label="Telegram"
                color="neutral"
                variant="subtle"
              />
            </UFieldGroup>
          </UPageCard>

          <UPageCard
            :title="t('status.janaza')"
            :description="l(demoOrder.janaza)"
            icon="i-lucide-landmark"
            :to="localePath(`/j/${id}`)"
            class="mt-4"
          />
          <UPageCard
            :title="t('status.bill')"
            :description="l(demoOrder.bill)"
            icon="i-lucide-receipt"
            class="mt-4"
          />
        </UPageAside>
      </template>
    </UPage>
  </UContainer>
</template>
