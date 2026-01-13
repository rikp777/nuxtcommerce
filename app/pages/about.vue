<script setup lang="ts">
import PageHero from "~/components/PageHero.vue";

const { t } = useI18n();
const localePath = useLocalePath();
const appConfig = useAppConfig();
const siteName = appConfig.site.name;

useSeoMeta({
  title: t('nav.about'),
  description: t('company.about.subtitle'),
});

const values = computed(() => [
  {
    title: t('company.about.values.teamwork.title'),
    icon: 'i-iconamoon-profile-circle-fill',
    text: t('company.about.values.teamwork.desc')
  },
  {
    title: t('company.about.values.innovation.title'),
    icon: 'i-iconamoon-lightning-1-fill',
    text: t('company.about.values.innovation.desc')
  },
  {
    title: t('company.about.values.safety.title'),
    icon: 'i-iconamoon-shield-yes-fill',
    text: t('company.about.values.safety.desc')
  }
]);

const teamMembers = [
  { name: 'Rik Peeters', role: 'Software Engineer', image: '/images/team-1.jpg' },
  { name: 'Sefa Bulak', role: 'Head of Design', image: '/images/team-2.jpg' },
  { name: 'Team Member', role: 'Adventure Specialist', image: '/images/team-3.jpg' },
];
</script>

<template>
  <div class="flex justify-center w-full min-h-screen pb-10">

    <div class="flex flex-col w-full max-w-[1400px] mx-3 lg:mx-5 mt-5">

      <PageHero
          :title="$t('company.about.title', { name: siteName })"
          :subtitle="$t('company.about.subtitle')"
          :tagline="$t('store.about.tagline')"
          image-src="https://images.unsplash.com/photo-1665045622636-ee4ce6e362ac?q=80&w=1740&auto=format&fit=crop"
      />

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">

        <div class="lg:col-span-8 flex flex-col gap-8">

          <div class="bg-white dark:bg-black border border-gray-100 dark:border-neutral-800 rounded-[32px] p-8 lg:p-10 shadow-sm">
            <h2 class="text-2xl font-bold mb-6 text-black dark:text-white">{{ $t('company.about.passion.title') }}</h2>
            <div class="text-neutral-600 dark:text-neutral-400 leading-relaxed space-y-4 text-lg">
              <p>
                <i18n-t keypath="company.about.passion.desc_1" tag="span">
                  <template #name>
                    <span class="font-bold text-black dark:text-white">{{ siteName }}</span>
                  </template>
                </i18n-t>
              </p>
              <p>
                {{ $t('company.about.passion.desc_2') }}
              </p>
            </div>
          </div>

          <div class="bg-neutral-100 dark:bg-white/5 rounded-[32px] p-8 lg:p-10">
            <h3 class="text-xl font-bold mb-6 text-black dark:text-white">{{ $t('company.about.team.title') }}</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div v-for="(member, idx) in teamMembers" :key="idx" class="group">
                <div class="aspect-square rounded-2xl overflow-hidden bg-gray-200 dark:bg-neutral-800 mb-4 relative">
                  <div class="absolute inset-0 flex items-center justify-center text-neutral-400">
                    <UIcon name="i-iconamoon-profile-circle-fill" size="64" />
                  </div>
                  <NuxtImg
                      :src="member.image"
                      class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-0"
                      @load="$event.target.classList.remove('opacity-0')"
                  />
                </div>
                <h4 class="font-bold text-lg text-black dark:text-white">{{ member.name }}</h4>
                <p class="text-sm text-alizarin-crimson-600 dark:text-alizarin-crimson-400 font-medium">{{ member.role }}</p>
              </div>
            </div>
          </div>

        </div>

        <div class="lg:col-span-4 flex flex-col gap-6">

          <div class="bg-white dark:bg-black border border-gray-100 dark:border-neutral-800 rounded-[32px] p-8 shadow-sm h-full">
            <h3 class="text-xl font-bold mb-6 text-black dark:text-white">{{ $t('company.about.values.title') }}</h3>

            <div class="flex flex-col gap-8">
              <div v-for="(val, idx) in values" :key="idx" class="flex gap-4">
                <div class="shrink-0 w-12 h-12 rounded-full bg-alizarin-crimson-50 dark:bg-alizarin-crimson-900/30 flex items-center justify-center text-alizarin-crimson-600 dark:text-alizarin-crimson-400">
                  <UIcon :name="val.icon" size="24" />
                </div>
                <div>
                  <h4 class="font-bold text-black dark:text-white mb-1">{{ val.title }}</h4>
                  <p class="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    {{ val.text }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-black dark:bg-white rounded-[32px] p-8 text-white dark:text-black relative overflow-hidden group">
            <div class="relative z-10">
              <h3 class="text-2xl font-bold mb-2">{{ $t('company.about.cta.title') }}</h3>
              <p class="text-white/70 dark:text-black/70 mb-6 text-sm">
                {{ $t('company.about.cta.desc') }}
              </p>
              <NuxtLink
                  :to="localePath('/contact')"
                  class="inline-flex items-center gap-2 font-bold bg-white text-black dark:bg-black dark:text-white px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
              >
                {{ t('nav.contact') }}
                <UIcon name="i-iconamoon-arrow-right-2" />
              </NuxtLink>
            </div>

            <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-gray-800 dark:bg-gray-200 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-700 ease-in-out"></div>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>