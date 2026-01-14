<script setup lang="ts">
import type {Company} from "~~/types/company";

const appConfig = useAppConfig();
const company = appConfig.company as Company;

const cleanPhone = (phone: string) => phone.replace(/\s/g, '');
</script>

<template>
  <div class="space-y-4">

    <div>
      <h2 v-if="company.legalName" class="font-bold text-lg text-black dark:text-white">
        {{ company.legalName }}
      </h2>

      <div v-if="company.address" class="mt-2">
        <component
            :is="company.address.mapsUrl ? 'a' : 'div'"
            :href="company.address.mapsUrl"
            :target="company.address.mapsUrl ? '_blank' : undefined"
            :rel="company.address.mapsUrl ? 'noopener noreferrer' : undefined"
            class="block text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed transition-colors"
            :class="{ 'hover:text-black dark:hover:text-white cursor-pointer': company.address.mapsUrl }"
            :title="company.address.mapsUrl ? $t('general.show_on_map') : undefined"
        >
          <span v-if="company.address.street" class="block">
            {{ company.address.street }}
          </span>

          <span v-if="company.address.postalCode || company.address.city" class="block">
            {{ company.address.postalCode }} {{ company.address.city }}
          </span>

          <span v-if="company.address.country" class="block">
            {{ company.address.country }}
          </span>
        </component>
      </div>
    </div>

    <div v-if="company.contact" class="flex flex-col gap-2 text-sm">
      <a
          v-if="company.contact.email"
          :href="`mailto:${company.contact.email}`"
          class="font-medium text-black dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors w-fit"
      >
        {{ company.contact.email }}
      </a>

      <a
          v-if="company.contact.phone"
          :href="`tel:${cleanPhone(company.contact.phone)}`"
          class="font-medium text-black dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors w-fit"
      >
        {{ company.contact.phone }}
      </a>
    </div>

    <div v-if="company.registration" class="flex flex-col gap-1">
      <div v-if="company.registration.kvk" class="text-xs text-neutral-400 uppercase tracking-wider">
        KvK {{ company.registration.kvk }}
      </div>
      <div v-if="company.registration.btw" class="text-xs text-neutral-400 uppercase tracking-wider">
        BTW {{ company.registration.btw }}
      </div>
    </div>

  </div>
</template>