<script setup lang="ts">
defineProps<{
  title: string;
  subtitle?: string;
  footerLabel: string;
  footerLinkText: string;
  footerLinkTo: string;
}>();
</script>

<template>
  <div class="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-12">
    <div class="w-full max-w-md bg-white/80 dark:bg-neutral-900/60 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-[24px] p-8 shadow-sm">

      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2 text-black dark:text-white tracking-tight">{{ title }}</h1>
        <p v-if="subtitle" class="text-neutral-500 dark:text-neutral-400 text-sm">
          {{ subtitle }}
        </p>
      </div>

      <slot />

      <div class="mt-8 text-center border-t border-gray-200 dark:border-neutral-800 pt-6">
        <p class="text-sm text-neutral-500">
          {{ footerLabel }}
          <NuxtLink :to="footerLinkTo" class="font-bold text-black dark:text-white hover:underline ml-1 transition-colors">
            {{ footerLinkText }}
          </NuxtLink>
        </p>
      </div>

    </div>
  </div>
</template>