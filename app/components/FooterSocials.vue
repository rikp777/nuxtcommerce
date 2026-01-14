<script setup lang="ts">
import type { Company } from "~~/types/company";

const appConfig = useAppConfig();
const config = useRuntimeConfig();
const company = appConfig.company as Company;

const socialLinks = computed(() => {
  const icons: Record<string, string> = {
    facebook: 'i-simple-icons-facebook',
    instagram: 'i-simple-icons-instagram',
    x: 'i-simple-icons-x',
    linkedin: 'i-simple-icons-linkedin'
  };

  return Object.entries(company.socials || {})
      .filter(([_, url]) => url)
      .map(([platform, url]) => ({
        name: platform,
        url,
        icon: icons[platform] || 'i-heroicons-link'
      }));
});

const shouldRender = computed(() => {
  return config.public.enable.socials && socialLinks.value.length > 0;
});
</script>

<template>
  <div v-if="shouldRender" class="flex flex-col gap-4">
    <h4 class="font-bold text-sm text-black dark:text-white">
      {{ $t('socials.follow_us') }}
    </h4>
    <div class="flex gap-3">
      <a
          v-for="social in socialLinks"
          :key="social.name"
          :href="social.url"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="social.name"
          class="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-200/50 hover:bg-neutral-200 hover:text-black active:scale-95 dark:bg-white/10 hover:dark:bg-white/20 hover:dark:text-neutral-100 transition-all duration-300 active:scale-95"
      >
        <UIcon :name="social.icon" size="20"/>
      </a>
    </div>
  </div>
</template>