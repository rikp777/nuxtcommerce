<script setup lang="ts">
const appConfig = useAppConfig();
const { company } = appConfig;
</script>

<template>
  <div class="space-y-4">
    <div>
      <h2 class="font-bold text-lg text-black dark:text-white">{{ company.legalName }}</h2>

      <a
          :href="company.address.mapsUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="block text-neutral-500 dark:text-neutral-400 text-sm mt-2 leading-relaxed hover:text-black dark:hover:text-white transition-colors"
          :title="$t('general.show_on_map')"
      >
        {{ company.address.street }}<br>
        {{ company.address.postalCode }} {{ company.address.city }}<br>
        {{ company.address.country }}
      </a>
    </div>

    <div class="flex flex-col gap-2 text-sm">
      <a :href="`mailto:${company.contact.email}`" class="font-medium text-black dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
        {{ company.contact.email }}
      </a>
      <a :href="`tel:${company.contact.phone.replace(/\s/g, '')}`" class="font-medium text-black dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
        {{ company.contact.phone }}
      </a>
    </div>

    <div v-if="company.registration.kvk" class="text-xs text-neutral-400 uppercase tracking-wider">
      KvK {{ company.registration.kvk }}
    </div>
  </div>
</template>