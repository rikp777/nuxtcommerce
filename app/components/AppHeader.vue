<script setup lang="ts">
const router = useRouter();
const route = useRoute();
const localePath = useLocalePath();
const { cart } = useCart();

const { data: user } = await useFetch('/api/auth/user', {
  key: 'user-profile',
  retry: 0
});

const searchQuery = ref((route.query.q || '').toString());
const searchResults = ref([]);
const isLoading = ref(false);
const suggestionMenu = ref(false);
const cartModal = ref(false);

const searchContainer = ref(null);
const cartContainer = ref(null);

const totalQuantity = computed(() => cart.value.reduce((acc, item) => acc + (item.quantity || 0), 0));
const hasResults = computed(() => searchResults.value.length > 0);

const navigateToSearch = () => {
  suggestionMenu.value = false;
  router.push({
    path: localePath('/products/'),
    query: { ...route.query, q: searchQuery.value || undefined }
  });
};

const clearSearch = () => {
  suggestionMenu.value = false;
  searchQuery.value = '';
  router.push({ query: { ...route.query, q: undefined } });
};

const performSearch = async () => {
  if (!searchQuery.value) return;

  isLoading.value = true;
  try {
    const response = await $fetch('/api/search', { query: { search: searchQuery.value } });
    searchResults.value = response.products.nodes || [];
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
};

const debouncedSearch = useDebounceFn(performSearch, 300);

watch(() => searchQuery.value, () => {
  if (searchQuery.value) {
    isLoading.value = true;
    debouncedSearch();
  }
});

onMounted(() => {
  if (searchQuery.value) performSearch();
});

onClickOutside(searchContainer, () => (suggestionMenu.value = false));
onClickOutside(cartContainer, () => (cartModal.value = false));
</script>

<template>
  <div class="fixed z-40 flex h-[72px] w-full flex-row items-center bg-white/85 px-3 backdrop-blur-sm lg:h-20 lg:px-5 dark:bg-black/85 dark:backdrop-blur-lg">
    <div class="flex w-full flex-row flex-nowrap items-center gap-2">

      <NuxtLink
          aria-label="Home"
          :to="localePath('/')"
          class="group flex min-h-12 min-w-12 items-center justify-center rounded-2xl transition active:scale-95 hover:bg-black/5 dark:hover:bg-white/15 max-lg:rounded-full lg:min-h-[52px] lg:min-w-[52px]"
      >
        <img
            class="h-12 w-12 p-1 transition-transform duration-500 ease-in-out group-hover:rotate-[240deg] group-hover:scale-110"
            src="/logo.svg"
            alt="Logo"
            loading="lazy"
        />
      </NuxtLink>

      <NuxtLink
          v-for="link in ['categories', 'favorites']"
          :key="link"
          :to="localePath(`/${link}`)"
          aria-label="Navigation"
          exactActiveClass="bg-black dark:bg-white text-white dark:text-black"
          class="hidden h-12 cursor-pointer items-center justify-center rounded-full px-4 font-semibold transition active:scale-95 hover:bg-black hover:text-white lg:flex dark:hover:bg-white dark:hover:text-black"
      >
        {{ $t(`nav.${link}`) }}
      </NuxtLink>

      <NuxtLink
          v-for="(icon, link) in { categories: 'i-iconamoon-category-fill', favorites: 'i-iconamoon-heart-fill' }"
          :key="link"
          :to="localePath(`/${link}`)"
          exactActiveClass="!bg-black/10 dark:!bg-white/30"
          class="flex min-h-12 min-w-12 items-center justify-center rounded-full bg-black/5 transition active:scale-95 hover:bg-black/10 lg:hidden dark:bg-white/15 dark:hover:bg-white/20"
      >
        <UIcon :name="icon" size="26" class="text-[#5f5f5f] dark:text-[#b7b7b7]" />
      </NuxtLink>

      <div class="flex flex-grow flex-col text-sm font-semibold text-[#111] dark:text-[#eee]">
        <div
            :class="[
            'flex h-12 flex-grow rounded-full pl-4 pr-3 transition-all hover:bg-black/10 dark:hover:bg-white/20',
            suggestionMenu ? 'bg-black/10 dark:bg-white/20' : 'bg-black/5 dark:bg-white/15'
          ]"
        >
          <div @click="suggestionMenu = true" class="flex w-full items-center gap-4">
            <div v-if="!suggestionMenu" class="flex text-neutral-500 dark:text-neutral-400">
              <UIcon name="i-iconamoon-search-bold" size="20" />
            </div>
            <div class="flex w-full">
              <input
                  v-model="searchQuery"
                  @keyup.enter="navigateToSearch"
                  type="text"
                  class="w-full bg-transparent py-2 outline-none placeholder:text-[#757575] dark:placeholder:text-neutral-400"
                  :placeholder="route.query.category ? $t('search.placeholder_in_category', { category: route.query.category }) : $t('search.placeholder')"
              />
              <div v-if="searchQuery || suggestionMenu" @click.stop="clearSearch" class="flex cursor-pointer items-center justify-center">
                <UIcon :name="isLoading ? 'i-svg-spinners-bars-rotate-fade' : 'i-iconamoon-close-circle-1-fill'" :size="isLoading ? 20 : 24" class="text-black dark:text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <NuxtLink
          :to="localePath(user ? '/account' : '/account/login')"
          class="flex min-h-12 min-w-12 items-center justify-center rounded-full hover:bg-black/5 hover:dark:bg-white/15 transition-colors"
          :aria-label="user ? 'My Account' : 'Login'"
      >
        <div v-if="user" class="h-8 w-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-xs ring-2 ring-white dark:ring-black">
          {{ user.firstName?.[0] }}{{ user.lastName?.[0] }}
        </div>

        <UIcon v-else name="i-iconamoon-profile-circle-fill" size="26" class="text-[#5f5f5f] dark:text-[#b7b7b7]" />
      </NuxtLink>

      <button
          @mouseup="cartModal = !cartModal"
          class="relative flex min-h-12 min-w-12 cursor-pointer items-center justify-center rounded-full hover:bg-black/5 hover:dark:bg-white/15"
      >
        <UIcon name="i-iconamoon-shopping-bag-fill" size="26" class="text-[#5f5f5f] dark:text-[#b7b7b7]" />
        <span v-if="totalQuantity" class="absolute right-1 top-1 flex h-[18px] w-[18px]">
          <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-alizarin-crimson-400 opacity-75"></span>
          <span class="relative inline-flex h-[18px] w-[18px] items-center justify-center rounded-full bg-alizarin-crimson-700 text-[10px] font-semibold text-white shadow">
            {{ totalQuantity }}
          </span>
        </span>
      </button>
    </div>
  </div>

  <div
      v-if="suggestionMenu"
      ref="searchContainer"
      class="fixed left-0 right-0 top-[72px] z-50 w-full bg-white/85 backdrop-blur-sm lg:top-20 lg:rounded-b-3xl dark:bg-black/85 dark:backdrop-blur-lg"
  >
    <div class="max-h-[calc(100vh-72px)] overflow-auto lg:max-h-[calc(100vh-80px)]">

      <div v-if="isLoading" class="flex h-80 items-center justify-center">
        <div class="skeleton flex h-12 w-12 items-center justify-center rounded-full bg-black/10 dark:bg-white/20">
          <UIcon name="i-svg-spinners-8-dots-rotate" size="26" class="text-white dark:text-black" />
        </div>
      </div>

      <div v-else-if="!hasResults" class="flex w-full flex-col items-center justify-center p-8 text-center">
        <div class="flex h-28 w-28 items-center justify-center rounded-full bg-black/10 dark:bg-white/20">
          <UIcon name="i-iconamoon-search-bold" class="h-16 w-16 dark:text-white" />
        </div>
        <div class="my-6 text-3xl font-semibold">
          {{ $t('search.no_results_for_query') }} <strong>{{ searchQuery }}</strong>
        </div>
        <div class="mb-5 max-w-md text-center text-sm">
          {{ $t('search.no_results_suggestion') }}
        </div>
      </div>

      <div v-else class="mx-auto max-w-screen-2xl p-3 lg:p-4">
        <h2 v-if="!searchQuery" class="text-2xl font-bold tracking-tight">{{ $t('search.new_products') }}</h2>
        <div class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:mt-5 lg:grid-cols-5 lg:gap-5 xl:grid-cols-6 xs:grid-cols-2">
          <NuxtLink
              v-for="(product, i) in searchResults"
              :key="i"
              @click="suggestionMenu = false"
              :to="localePath(`/products/${product.slug}-${product.sku.split('-')[0]}`)"
              class="group cursor-pointer select-none"
          >
            <div class="relative overflow-hidden rounded-2xl pb-[133%] dark:shadow-[0_8px_24px_rgba(0,0,0,.5)]">
              <NuxtImg
                  :src="product.galleryImages?.nodes[0]?.sourceUrl"
                  :alt="product.name"
                  loading="lazy"
                  class="absolute h-full w-full bg-neutral-200 object-cover dark:bg-neutral-800"
              />
              <NuxtImg
                  :src="product.image?.sourceUrl"
                  :alt="product.name"
                  loading="lazy"
                  class="absolute h-full w-full bg-neutral-200 object-cover opacity-100 transition-opacity duration-300 group-hover:opacity-0 dark:bg-neutral-800"
              />
            </div>
            <div class="grid gap-0.5 px-1.5 pb-4 pt-3 text-sm font-semibold">
              <ProductPrice :sale-price="product.salePrice" :regular-price="product.regularPrice" variant="card" />
              <div>{{ product.name }}</div>
              <div class="font-normal text-[#5f5f5f] dark:text-[#a3a3a3]">
                {{ product.allPaStyle?.nodes[0]?.name }}
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>

      <div v-if="searchQuery && !isLoading && hasResults" class="flex items-center justify-center border-t border-black/10 p-4 dark:border-white/20">
        <button @click="navigateToSearch" class="rounded-full bg-black/15 px-4 py-2 text-sm tracking-wide transition hover:bg-black/10 active:scale-95 dark:bg-white/15 hover:dark:bg-white/20">
          {{ $t('search.view_all_results') }}
        </button>
      </div>
    </div>
  </div>

  <div v-if="suggestionMenu || cartModal" :class="['fixed inset-0 bg-black/30 backdrop-blur-lg', cartModal ? 'z-40' : 'z-30']"></div>

  <button
      v-if="cartModal"
      @click="cartModal = false"
      class="cart-button-bezel fixed right-0 z-50 mx-3 mt-3 flex min-h-12 min-w-12 items-center justify-center rounded-[2rem] bg-white/85 shadow-2xl backdrop-blur-lg transition hover:bg-white/65 lg:mx-5 lg:mt-4 dark:border dark:border-white/10 dark:bg-black/30 dark:hover:bg-white/10"
  >
    <UIcon name="i-iconamoon-close" size="26" class="text-[#5f5f5f] dark:text-[#b7b7b7]" />
  </button>

  <Transition name="dropdown">
    <Cart v-if="cartModal" ref="cartContainer" />
  </Transition>
</template>

<style lang="postcss">
::-webkit-scrollbar { @apply h-0 w-0 bg-transparent; }
::-webkit-scrollbar-track { @apply bg-transparent; }
::-webkit-scrollbar-thumb {
  @apply rounded-full border-[5px] border-solid border-white bg-black/15 dark:border-black dark:bg-white/15;
}
</style>