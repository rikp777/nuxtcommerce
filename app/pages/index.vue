<script setup lang="ts">
const highlightedProducts = [
  { slug: '79bike-falcon-pro-geel-zwart', sku: '792001' },
  { slug: '79bike-falcon-pro', sku: '792001' },
  { slug: 'bbx-20-3', sku: '222000' },
  { slug: 'bbx-20-3', sku: '222000' }
];

const products = ref([]);
const isLoading = ref(true);

const fetchHighlightedProducts = async () => {
  try {
    const results = await Promise.all(
        highlightedProducts.map(item =>
            $fetch('/api/product', { query: { slug: item.slug, sku: item.sku } })
                .then(data => data.product)
                .catch(() => null)
        )
    );
    // Filter nulls eruit (voor het geval een product niet gevonden wordt)
    products.value = results.filter(p => p !== null);
  } catch (error) {
    console.error('Error fetching highlighted products', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchHighlightedProducts();
});
</script>

<template>
  <div class="relative w-full min-h-screen flex flex-col">

    <div class="fixed inset-0 w-full h-full overflow-hidden z-0">
      <video
          autoplay
          loop
          muted
          playsinline
          class="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/intro.mp4" type="video/mp4" />
      </video>
      <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30"></div>
    </div>

    <div class="relative z-10 md:container mx-auto px-4 py-20 lg:py-32 flex flex-col justify-end min-h-screen">

      <div class="mb-12 max-w-2xl">
        <span class="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-white uppercase bg-brand rounded-lg shadow-lg shadow-brand/20">
          New Collection
        </span>
        <h1 class="text-5xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
          Experience the <br/> future of riding.
        </h1>
        <p class="text-lg text-neutral-200 max-w-lg leading-relaxed">
          Discover our latest models designed for performance, comfort, and style.
          Your journey starts here.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <template v-if="isLoading">
          <div
              v-for="i in 4"
              :key="i"
              class="bg-white/50 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-[32px] p-4 h-[800px] animate-pulse"
          ></div>
        </template>

        <template v-else>
          <ProductCard
              v-for="product in products"
              :key="product.databaseId"
              :product="product"
              class="
                bg-white/80 dark:bg-black/40
                backdrop-blur-md
                border border-white/40 dark:border-white/10
                rounded-[32px] p-6 h-full
              "
          />
        </template>

      </div>

    </div>
  </div>
</template>