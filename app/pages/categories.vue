<script setup>
const { name } = useAppConfig().site;
const url = useRequestURL();
const localePath = useLocalePath();

const categoriesData = ref([]);
const canonical = url.origin + url.pathname;
const isLoading = ref(true);

useSeoMeta({
  title: 'Categories',
  ogTitle: 'Categories',
  description: `Browse product categories on ${name}.`,
  ogDescription: `Browse product categories on ${name}.`,
  ogUrl: canonical,
  canonical,
  keywords: `categories, ${name}`,
  twitterTitle: 'Categories',
  twitterDescription: `Browse product categories on ${name}.`,
  ogImage: 'https://commerce.nuxt.dev/social-card.jpg',
  twitterImage: 'https://commerce.nuxt.dev/social-card.jpg',
});

onMounted(() => {
  $fetch('/api/categories')
      .then(response => {
        categoriesData.value = response.productCategories.nodes.filter(category =>
            category.products.nodes.length && category.children.nodes.length
        );
      })
      .finally(() => {
        isLoading.value = false;
      });
});

const categories = computed(() => categoriesData.value);
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

      <div class="absolute inset-0
        bg-gradient-to-t from-black/90 via-black/50 to-black/30
        dark:from-black dark:via-black/80 dark:to-black/60
      "></div>
    </div>
    <div class="relative z-10 container mx-auto px-4 py-24 min-h-screen flex flex-col justify-center items-center">

      <h1 class="text-4xl lg:text-5xl font-bold text-white mb-12 text-center tracking-tight drop-shadow-lg">
        {{ $t('nav.categories') || 'Categories' }}
      </h1>

      <div class="flex flex-wrap justify-center gap-8 w-full max-w-7xl">

        <template v-if="isLoading">
          <div v-for="i in 3" :key="i" class="w-full sm:w-[calc(50%-16px)] lg:w-[calc(33.33%-22px)] max-w-[400px]">
            <div class="bg-white/10 backdrop-blur-md border border-white/10 rounded-[32px] p-4 h-[450px] animate-pulse"></div>
          </div>
        </template>

        <template v-else>
          <NuxtLink
              v-for="category in categories"
              :key="category.id"
              :to="localePath(`/products/?category=${encodeURIComponent(category.name)}`)"
              class="
                w-full sm:w-[calc(50%-16px)] lg:w-[calc(33.33%-22px)] max-w-[400px] group
                bg-white/80 dark:bg-white/5 backdrop-blur-md
                border border-white/20 dark:border-white/10
                rounded-[32px] p-4 flex flex-col
                transition-transform duration-300 shadow-2xl cursor-pointer
              "
          >
            <div class="relative pb-[133%] rounded-2xl overflow-hidden bg-black/10 dark:bg-black/20 mb-4 shadow-inner">
              <NuxtImg
                  v-if="category.image"
                  :src="category.image.sourceUrl"
                  :alt="category.name"
                  :title="category.name"
                  loading="lazy"
                  class="absolute h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div v-else class="absolute h-full w-full bg-gradient-to-br from-white/10 to-white/5"></div>
            </div>

            <div class="px-1.5 pb-2 flex flex-col grow">

              <div class="flex justify-between items-end gap-2">
                <div>
                  <h3 class="font-bold text-lg text-black dark:text-white leading-tight group-hover:text-brand transition-colors">
                    {{ category.name }}
                  </h3>
                  <p class="text-sm text-neutral-600 dark:text-neutral-400 mt-1 font-medium">
                    {{ category.count || category.products?.nodes?.length || 0 }} products
                  </p>
                </div>

                <button class="w-8 h-8 rounded-full bg-black/10 dark:bg-white/10 text-black dark:text-white flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-colors">
                  <UIcon name="i-iconamoon-arrow-top-right" size="18" />
                </button>
              </div>

            </div>
          </NuxtLink>
        </template>

      </div>
    </div>

  </div>
</template>