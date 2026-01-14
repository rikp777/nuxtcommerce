<script setup lang="ts">
const { tm, rt } = useI18n();
const { company } = useAppConfig()
const config = useRuntimeConfig()

if (!config.public.enable.legal) {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found' });
}

interface LegalSection {
  title: string;
  desc: string;
}

const hasAnalytics = computed(() => {
  const id = config.public.gtag?.id
  return id && id !== 'G-XXXXXXXXXX'
})

const legalItems = computed(() => {
  const sections = tm('store.legal.sections') as LegalSection[];
  return sections.map(section => ({
    title: rt(section.title),
    desc: rt(section.desc)
  }));
});
</script>

<template>
  <div class="min-h-screen pt-[72px] lg:pt-20">
    <div class="container mx-auto px-4 py-10 lg:py-20 max-w-screen-xl">

      <div class="mb-12 lg:mb-20 max-w-3xl">
        <h1 class="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
          {{ $t('store.legal.title') }}
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
          {{ $t('store.legal.description') }}
        </p>
      </div>

      <div class="flex flex-col gap-12 lg:gap-16">
        <div
            v-for="(item, index) in legalItems"
            :key="index"
            class="group grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 md:gap-12 lg:gap-20 border-b border-gray-200 dark:border-gray-800 pb-12 last:border-0 last:pb-0"
        >

          <div class="md:sticky md:top-24 h-fit">
            <h2 class="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
              {{ item.title }}
            </h2>
            <div v-if="item.title.includes('GDPR')" class="mt-8 flex flex-col gap-3">

              <div class="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                <UIcon name="i-heroicons-user-circle" class="w-6 h-6 shrink-0 text-gray-700 dark:text-gray-300" />
                <div>
                  <h4 class="font-bold text-gray-900 dark:text-white text-xs uppercase tracking-wide mb-1">
                    {{ $t('store.legal.gdpr.access_title') }}
                  </h4>
                  <p class="text-xs text-gray-500 dark:text-gray-400 leading-snug">
                    {{ $t('store.legal.gdpr.access_desc') }}
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                <UIcon name="i-heroicons-trash" class="w-6 h-6 shrink-0 text-gray-700 dark:text-gray-300" />
                <div>
                  <h4 class="font-bold text-gray-900 dark:text-white text-xs uppercase tracking-wide mb-1">
                    {{ $t('store.legal.gdpr.delete_title') }}
                  </h4>
                  <p class="text-xs text-gray-500 dark:text-gray-400 leading-snug">
                    {{ $t('store.legal.gdpr.delete_desc') }}
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                <UIcon name="i-heroicons-envelope" class="w-6 h-6 shrink-0 text-gray-700 dark:text-gray-300" />
                <div>
                  <h4 class="font-bold text-gray-900 dark:text-white text-xs uppercase tracking-wide mb-1">
                    {{ $t('store.legal.gdpr.contact_title') }}
                  </h4>
                  <a :href="`mailto:${company.contact.email}`" class="text-xs text-primary-600 dark:text-primary-400 hover:underline leading-snug">
                    {{ $t('store.legal.gdpr.contact_desc') }}
                  </a>
                </div>
              </div>

            </div>
            <div v-if="item.title.toLowerCase().includes('cookie')" class="mt-8 grid grid-cols-1 sm:grid-cols-1 gap-4">
              <div class="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                <UIcon name="i-logos-woocommerce-icon" class="w-8 h-8 shrink-0" />
                <div>
                  <h4 class="font-bold text-gray-900 dark:text-white text-sm">WooCommerce</h4>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {{ $t('store.legal.cookies.functional') }}
                  </p>
                </div>
              </div>
              <div v-if="hasAnalytics" class="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                <UIcon name="i-logos-google-analytics" class="w-8 h-8 shrink-0" />
                <div>
                  <h4 class="font-bold text-gray-900 dark:text-white text-sm">Google Analytics</h4>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {{ $t('store.legal.cookies.analytical') }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="text-base lg:text-lg leading-relaxed text-gray-600 dark:text-gray-400">
            <div class="whitespace-pre-line prose dark:prose-invert max-w-none">
              {{ item.desc }}
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>