<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
  imageSrc: string;
  imageAlt?: string;
}>();
</script>

<template>
  <div class="hidden lg:flex w-1/2 relative bg-gray-100 dark:bg-neutral-900 group cursor-default  rounded-2xl overflow-hidden">
    <NuxtImg
        :src="imageSrc"
        :alt="imageAlt || title"
        class="absolute inset-0 w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-in-out transform group-hover:scale-105"
    />
    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

    <div class="absolute bottom-0 left-0 p-12 text-white z-10 pointer-events-none">
      <h2 class="text-4xl font-bold mb-4">{{ title }}</h2>
      <p class="text-lg text-white/80 max-w-md leading-relaxed">
        {{ description }}
      </p>
    </div>
  </div>
</template>