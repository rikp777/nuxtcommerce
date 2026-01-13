<script setup lang="ts">
import PageHero from "~/components/PageHero.vue";

const { t } = useI18n();
const localePath = useLocalePath();
const appConfig = useAppConfig();

useSeoMeta({
  title: t('store.faq.title'),
  description: t('store.faq.subtitle'),
});

const faqKeys = [
  'range',
  'charging',
  'warranty',
  'test_drive',
  'maintenance',
  'delivery'
];

const openIndex = ref<number | null>(0);

const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index;
};
</script>

<template>
  <div class="flex justify-center w-full min-h-screen pb-20">

    <div class="flex flex-col w-full max-w-[1400px] mx-3 lg:mx-5 mt-5">
      <PageHero
          :title="$t('store.faq.title')"
          :subtitle="$t('store.faq.subtitle')"
          :tagline="$t('store.faq.tagline')"
          image-src="https://images.unsplash.com/photo-1665045622636-ee4ce6e362ac?q=80&w=1740&auto=format&fit=crop"
      />

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

        <div class="lg:col-span-8 flex flex-col gap-4">
          <div
              v-for="(key, index) in faqKeys"
              :key="key"
              class="group bg-white dark:bg-white/5 border border-gray-100 dark:border-neutral-800 rounded-2xl overflow-hidden transition-all duration-300"
              :class="openIndex === index ? 'shadow-lg ring-1 ring-black/5 dark:ring-white/10' : 'hover:border-gray-300 dark:hover:border-neutral-700 hover:shadow-sm'"
          >
            <button
                @click="toggle(index)"
                class="w-full flex items-center justify-between p-6 text-left focus:outline-none"
            >
              <div class="flex items-center gap-4">
                 <span class="hidden sm:flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors"
                       :class="openIndex === index ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-gray-100 dark:bg-neutral-800 text-gray-500'"
                 >
                  {{ index + 1 }}
                </span>
                <span class="text-lg font-bold text-black dark:text-white group-hover:text-alizarin-crimson-600 dark:group-hover:text-alizarin-crimson-400 transition-colors">
                  {{ $t(`store.faq.items.${key}.q`) }}
                </span>
              </div>

              <div
                  class="shrink-0 ml-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                  :class="openIndex === index ? 'bg-alizarin-crimson-600 text-white rotate-180' : 'bg-gray-100 dark:bg-neutral-800 text-black dark:text-white group-hover:bg-gray-200'"
              >
                <UIcon name="i-iconamoon-arrow-down-2" size="20" />
              </div>
            </button>

            <div
                class="grid transition-[grid-template-rows] duration-300 ease-out"
                :class="openIndex === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
            >
              <div class="overflow-hidden">
                <div class="px-6 mb-8 pt-0 pl-6 sm:pl-[4.5rem] text-neutral-600 dark:text-neutral-300 leading-relaxed text-base max-w-3xl">
                  {{ $t(`store.faq.items.${key}.a`) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-4 relative">
          <div class="sticky top-24">
            <div class="bg-neutral-100 dark:bg-white/5 border border-transparent dark:border-neutral-800 rounded-[32px] p-8 text-center">

              <div class="w-16 h-16 mx-auto bg-white dark:bg-neutral-800 rounded-full flex items-center justify-center shadow-sm mb-6 text-alizarin-crimson-600">
                <UIcon name="i-iconamoon-comment-dots-fill" size="32" />
              </div>

              <h3 class="text-2xl font-bold text-black dark:text-white mb-3">
                {{ $t('store.faq.still_questions') }}
              </h3>

              <p class="text-neutral-500 dark:text-neutral-400 mb-8 leading-relaxed">
                Can't find the answer you're looking for? Our team is here to help you get back on track.
              </p>

              <div class="space-y-3">
                <NuxtLink
                    :to="localePath('/contact')"
                    class="flex items-center justify-center gap-2 w-full font-bold bg-black text-white dark:bg-white dark:text-black py-4 rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
                >
                  {{ $t('store.faq.contact_us') }}
                  <UIcon name="i-iconamoon-arrow-right-2" />
                </NuxtLink>

                <a href="mailto:info@bbxtreme.nl" class="flex items-center justify-center gap-2 w-full font-bold text-neutral-600 dark:text-neutral-400 py-3 hover:text-black dark:hover:text-white transition-colors">
                  <UIcon name="i-iconamoon-email" />
                  info@bbxtreme.nl
                </a>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>