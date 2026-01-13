<script setup lang="ts">
const config = useRuntimeConfig();
const appConfig = useAppConfig();
</script>

<template>
  <div class="text-center md:text-left">
    <span class="transition-all hover:text-black hover:dark:text-neutral-100">
      {{ appConfig.site.name }} v{{ config.public.version }}
    </span>
    —
    {{ $t('footer.developed_by_author') }}
    <a class="transition-all hover:text-black hover:dark:text-neutral-100 underline decoration-dotted underline-offset-4"
       :href="appConfig.developer.social.linkedin"
       target="_blank">
      {{ appConfig.developer.name }}
    </a>

    <span class="mx-2 opacity-50">|</span>
    <span class="opacity-75 text-xs">
      {{ $t('footer.based_on') }}
      <a href="https://github.com/zackha/nuxtcommerce" target="_blank" class="hover:underline">
        NuxtCommerce
      </a>
    </span>
  </div>
</template>