<script setup lang="ts">
import type { Company } from "~~/types/company";
import StoreOpeningHours from "~/components/StoreOpeningHours.vue";

const props = defineProps<{
  company: Company;
  hqSchedule: any[];
  stores: any[];
  selectedStoreId: number | null;
}>();

const localePath = useLocalePath();
</script>

<template>
  <div class="flex flex-col gap-6">

    <div class="bg-white dark:bg-black border border-gray-200 dark:border-neutral-800 rounded-[32px] p-8 shadow-sm h-full flex flex-col">

      <div class="flex justify-between items-start gap-2 mb-2">
        <h3 class="text-2xl font-bold text-black dark:text-white leading-tight">
          {{ company.legalName }}
        </h3>
        <span class="bg-black text-white dark:bg-white dark:text-black text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md shrink-0">
          {{ $t('stores.types.headquarter') }}
        </span>
      </div>

      <a :href="company.address.mapsUrl" target="_blank"
         class="text-secondary-text dark:text-secondary-text-d hover:text-black dark:hover:text-white transition-colors text-sm mb-6 block">
        {{ company.address.street }}<br>
        {{ company.address.postalCode }} {{ company.address.city }}<br>
        {{ company.address.country }}
      </a>

      <div class="mb-6">
        <StoreOpeningHours v-if="hqSchedule.length" :schedule="hqSchedule" :default-open="true"/>
      </div>

      <div class="mt-auto space-y-3">

        <a :href="`mailto:${company.contact.email}`"
           class="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors group">
          <div class="w-8 h-8 rounded-full bg-white dark:bg-black flex items-center justify-center text-black dark:text-white shadow-sm group-hover:scale-110 transition-transform">
            <UIcon name="i-iconamoon-email"/>
          </div>
          <span class="text-sm font-medium text-black dark:text-white">
            {{ company.contact.email }}
          </span>
        </a>

        <a :href="`tel:${company.contact.phone.replace(/\s/g, '')}`"
           class="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors group">
          <div class="w-8 h-8 rounded-full bg-white dark:bg-black flex items-center justify-center text-black dark:text-white shadow-sm group-hover:scale-110 transition-transform">
            <UIcon name="i-iconamoon-phone"/>
          </div>
          <span class="text-sm font-medium text-black dark:text-white">
             {{ company.contact.phone }}
          </span>
        </a>

        <div class="flex gap-3">
          <NuxtLink :to="localePath('/faq')"
                    class="flex-1 flex items-center justify-center gap-2 text-sm font-bold bg-black text-white dark:bg-white dark:text-black rounded-xl py-3 hover:opacity-90 transition-opacity">
            <UIcon name="i-iconamoon-question-mark-circle-fill" size="18"/>
            {{ $t('store.faq.title') }}
          </NuxtLink>
          <a :href="company.address.mapsUrl" target="_blank"
             class="flex-1 flex items-center justify-center gap-2 text-sm font-bold bg-black text-white dark:bg-white dark:text-black rounded-xl py-3 hover:opacity-90 transition-opacity">
            <UIcon name="i-iconamoon-location-pin-fill" size="18"/>
            {{ $t('stores.navigate') }}
          </a>
        </div>

      </div>
    </div>

    <div class="bg-neutral-100 dark:bg-white/5 border border-gray-200 dark:border-neutral-800 rounded-[32px] h-64 w-full overflow-hidden relative shadow-sm">
      <ClientOnly>
        <StoreMap v-if="stores.length" :stores="stores" :selected-store-id="selectedStoreId" />
        <template #fallback>
          <div class="flex items-center justify-center h-full bg-gray-50 dark:bg-neutral-900">
            <UIcon name="i-svg-spinners-90-ring-with-bg" class="text-brand" size="32"/>
          </div>
        </template>
      </ClientOnly>
    </div>

  </div>
</template>