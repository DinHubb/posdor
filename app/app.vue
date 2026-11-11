<script setup lang="ts">
import type { NavigationMenuItem, DropdownMenuItem } from '@nuxt/ui'
import * as uiLocales from '@nuxt/ui/locale'
import { contacts } from '~/data/site'
import { articles } from '~/data/knowledge'

const route = useRoute()
const { t, locale, locales } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const i18nHead = useLocaleHead()
const baseURL = useRuntimeConfig().app.baseURL
const { l } = useContent()

useHead(() => ({
  htmlAttrs: { lang: i18nHead.value.htmlAttrs?.lang },
  link: [{ rel: 'icon', href: `${baseURL}favicon.ico` }, ...(i18nHead.value.link ?? [])],
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }, ...(i18nHead.value.meta ?? [])]
}))

useSeoMeta({
  titleTemplate: title => title ? `${title} · ${t('common.brand')}` : t('meta.title'),
  description: () => t('meta.description')
})

const uiLocale = computed(() => locale.value === 'tg' ? uiLocales.tg : uiLocales.ru)

const isActive = (path: string) => route.path.startsWith(localePath(path))

const nav = computed<NavigationMenuItem[]>(() => [
  { label: t('nav.packages'), to: localePath({ path: '/', hash: '#packages' }), active: false },
  { label: t('nav.services'), to: localePath('/services'), active: isActive('/services') },
  { label: t('nav.knowledge'), to: localePath('/knowledge'), active: isActive('/knowledge') },
  { label: t('nav.status'), to: localePath('/status/A-1024'), active: isActive('/status') },
  { label: t('nav.khotira'), to: localePath('/khotira'), badge: t('common.soon') }
])

const langItems = computed<DropdownMenuItem[]>(() => locales.value.map(l => ({
  label: l.name,
  type: 'checkbox' as const,
  checked: l.code === locale.value,
  onSelect: () => navigateTo(switchLocalePath(l.code))
})))

const footerColumns = computed(() => [
  {
    label: t('footer.families'),
    children: [
      { label: t('common.organize'), to: localePath('/order') },
      { label: t('footer.packagesPrices'), to: localePath({ path: '/', hash: '#packages' }) },
      { label: t('nav.status'), to: localePath('/status/A-1024') }
    ]
  },
  {
    label: t('footer.afterFuneral'),
    children: [
      { label: t('services.careTitle'), to: localePath({ path: '/services', hash: '#care' }) },
      { label: t('services.marakaTitle'), to: localePath({ path: '/services', hash: '#maraka' }) },
      { label: t('services.sadaqaTitle'), to: localePath({ path: '/services', hash: '#sadaqa' }) }
    ]
  },
  {
    label: t('footer.knowledge'),
    children: articles.slice(0, 3).map(a => ({
      label: l(a.title),
      to: localePath(`/knowledge/${a.slug}`)
    }))
  }
])

const showMobileBar = computed(() => !isActive('/order'))
</script>

<template>
  <UApp :locale="uiLocale">
    <UHeader :to="localePath('/')">
      <template #title>
        <AppLogo />
      </template>

      <UNavigationMenu :items="nav" />

      <template #right>
        <UDropdownMenu
          :items="langItems"
          :content="{ align: 'end' }"
        >
          <UButton
            :label="locale === 'tg' ? 'TJ' : 'RU'"
            icon="i-lucide-languages"
            color="neutral"
            variant="ghost"
            :aria-label="t('nav.language')"
          />
        </UDropdownMenu>

        <UColorModeButton class="hidden sm:inline-flex" />

        <UButton
          :to="contacts.phoneHref"
          icon="i-lucide-phone"
          :label="contacts.shortPhone"
          color="neutral"
          variant="outline"
          class="hidden sm:inline-flex"
        />

        <UButton
          :to="localePath('/order')"
          :label="t('common.organize')"
          class="hidden lg:inline-flex"
        />
      </template>

      <template #body>
        <UNavigationMenu
          :items="nav"
          orientation="vertical"
          class="-mx-2.5"
        />

        <USeparator class="my-6" />

        <UButton
          :to="localePath('/order')"
          :label="t('common.organize')"
          size="xl"
          block
          class="mb-3"
        />
        <UButton
          :to="contacts.phoneHref"
          icon="i-lucide-phone"
          :label="t('common.callNumber', { phone: contacts.shortPhone })"
          size="xl"
          color="neutral"
          variant="outline"
          block
        />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <USeparator />

    <UFooter :class="showMobileBar ? 'pb-24 lg:pb-0' : ''">
      <template #top>
        <UContainer>
          <UFooterColumns :columns="footerColumns">
            <template #right>
              <UPageCard
                :title="t('footer.contactsTitle')"
                :description="t('footer.contactsText', { short: contacts.shortPhone, phone: contacts.phone })"
                icon="i-lucide-phone-call"
                variant="subtle"
              >
                <UFieldGroup>
                  <UButton
                    :to="contacts.phoneHref"
                    icon="i-lucide-phone"
                    :label="t('common.call')"
                  />
                  <UButton
                    :to="contacts.telegram"
                    target="_blank"
                    icon="i-simple-icons-telegram"
                    label="Telegram"
                    color="neutral"
                    variant="subtle"
                  />
                  <UButton
                    :to="contacts.whatsapp"
                    target="_blank"
                    icon="i-simple-icons-whatsapp"
                    aria-label="WhatsApp"
                    color="neutral"
                    variant="subtle"
                  />
                </UFieldGroup>
              </UPageCard>
            </template>
          </UFooterColumns>
        </UContainer>
      </template>

      <template #left>
        <p class="text-sm text-muted">
          {{ t('footer.copyright', { year: new Date().getFullYear() }) }}
        </p>
      </template>

      <template #right>
        <UColorModeButton />
      </template>
    </UFooter>

    <AppMobileBar v-if="showMobileBar" />
  </UApp>
</template>
