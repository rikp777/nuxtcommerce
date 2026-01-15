<script setup>
import storesData from '~/data/stores.json';
import StoreOpeningHours from '~/components/StoreOpeningHours.vue';

const config = useRuntimeConfig();

if (!config.public.enable.storeLocator) {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found' });
}

const searchQuery = ref('');
const selectedStoreId = ref(null);

const filteredStores = computed(() => {
  if (!searchQuery.value) return storesData;

  const lowerQuery = searchQuery.value.toLowerCase();
  return storesData.filter(store =>
      store.name.toLowerCase().includes(lowerQuery) ||
      store.address.toLowerCase().includes(lowerQuery)
  );
});

const selectStore = (store) => {
  selectedStoreId.value = store.id;
};
</script>

<template>
  <div class="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden">

    <div class="w-full lg:w-1/3 flex flex-col bg-white dark:bg-black border-r border-gray-200 dark:border-neutral-800 h-1/2 lg:h-full z-10 shadow-xl lg:shadow-none">

      <div class="p-5 border-b border-gray-200 dark:border-neutral-800 shrink-0">
        <h1 class="text-2xl font-bold mb-4">{{ $t('stores.find_store') }}</h1>
        <div class="relative">
          <UIcon name="i-iconamoon-search" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size="20" />
          <input
              v-model="searchQuery"
              type="text"
              :placeholder="$t('stores.search_placeholder')"
              class="w-full bg-gray-100 dark:bg-neutral-900 border-none rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
          >
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-2">
        <div v-if="filteredStores.length === 0" class="p-8 text-center text-gray-400">
          {{ $t('stores.no_stores_found') }}
        </div>

        <div
            v-for="store in filteredStores"
            :key="store.id"
            @click="selectStore(store)"
            class="p-4 mb-2 rounded-xl cursor-pointer border-2 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-neutral-900"
            :class="selectedStoreId === store.id ? 'border-black dark:border-white bg-gray-50 dark:bg-neutral-900' : 'border-transparent'"
        >
          <div class="mb-3">
            <div class="flex justify-between items-start gap-2">
              <h3 class="font-bold text-lg leading-tight">{{ store.name }}</h3>

              <span
                  v-if="store.type"
                  class="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md shrink-0"
                  :class="store.type === 'headquarter'
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'bg-gray-200 text-gray-600 dark:bg-neutral-800 dark:text-gray-400'"
              >
                {{ $t(`stores.types.${store.type}`) }}
              </span>
            </div>

            <p class="text-neutral-500 text-sm mt-1">{{ store.address }}</p>
          </div>

          <div class="mb-4">
            <StoreOpeningHours :schedule="store.weeklyHours" />
          </div>

          <div class="flex gap-2">
            <a
                :href="`tel:${store.phone}`"
                class="flex-1 flex items-center justify-center gap-2 text-sm font-semibold border border-gray-200 dark:border-neutral-700 rounded-lg py-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
            >
              <UIcon name="i-iconamoon-phone" size="16" />

              <span class="lg:hidden">{{ $t('stores.call') }}</span>
              <span class="hidden lg:inline">{{ store.phone }}</span>
            </a>

            <a :href="`https://www.google.com/maps/search/?api=1&query=${store.lat},${store.lng}`" target="_blank" class="flex-1 text-center text-sm font-semibold bg-black text-white dark:bg-white dark:text-black rounded-lg py-2">
              {{ $t('stores.navigate') }}
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="w-full lg:w-2/3 h-[45%] lg:h-full relative p-4">

      <div class="w-full h-full rounded-2xl overflow-hidden shadow-md border border-gray-200 dark:border-neutral-700 relative">
        <ClientOnly>
          <StoreMap
              :stores="filteredStores"
              :selected-store-id="selectedStoreId"
              @reset="selectedStoreId = null"
          />
          <template #fallback>
            <div class="flex items-center justify-center h-full bg-gray-100 dark:bg-neutral-900 text-neutral-400">
              <UIcon name="i-svg-spinners-90-ring-with-bg" size="40" />
            </div>
          </template>
        </ClientOnly>
      </div>

    </div>
  </div>
</template>