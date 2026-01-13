<script setup lang="ts">
const props = defineProps<{
  title: string;
  subtitle?: string;
  tagline?: string;
  imageSrc: string;
}>();
</script>

<template>
  <div class="relative w-full h-[300px] lg:h-[400px] rounded-[32px] overflow-hidden mb-12 shadow-sm group">
    <NuxtImg
        :src="imageSrc"
        :alt="title"
        class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
    />
    <div class="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent"></div>

    <div class="absolute bottom-0 left-0 p-8 lg:p-12 max-w-2xl z-10">
      <span class="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-white uppercase bg-alizarin-crimson-600 rounded-full">
        {{ tagline }}
      </span>
      <h1 class="text-4xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
        {{ title }}
      </h1>
      <p class="text-lg text-white/80 leading-relaxed font-medium" v-if="subtitle">
        {{ subtitle }}
      </p>
    </div>
  </div>
</template>

<style scoped lang="postcss">

</style>