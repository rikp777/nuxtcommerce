<!--app/components/ProductCard.vue-->
<script setup>
const localePath = useLocalePath();

defineProps({
  product: Object,
  showPrice: Boolean,
});
</script>

<template>
  <NuxtLink v-if="product" :to="localePath(`/products/${product.slug}-${product.sku.split('-')[0]}`)" class="group select-none">
    <div class="cursor-pointer transition ease-[ease] duration-300 bg-white/30 dark:bg-neutral-900/30 rounded-2xl">
      <div class="relative pb-[133%] dark:shadow-[0_8px_24px_rgba(0,0,0,.5)] rounded-2xl overflow-hidden">
        <NuxtImg
          :alt="product.name"
          loading="lazy"
          :title="product.name"
          :src="product.galleryImages.nodes[0].sourceUrl"
          class="absolute h-full w-full dark:bg-neutral-800 bg-neutral-200 object-cover" />
        <NuxtImg
          :alt="product.name"
          loading="lazy"
          :title="product.name"
          :src="product.image.sourceUrl"
          class="absolute h-full w-full dark:bg-neutral-800 bg-neutral-200 object-cover transition-opacity duration-300 group-hover:opacity-0" />
      </div>
      <div class="grid gap-0.5 pt-3 pb-4 px-5 text-sm font-semibold">
        <ProductPrice v-if="showPrice" :sale-price="product.salePrice" :regular-price="product.regularPrice" variant="card" />
        <div>{{ product.name }}</div>
        <div class="font-normal text-[#5f5f5f] dark:text-[#a3a3a3]">
          {{ product.allPaStyle.nodes[0].name }}
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
