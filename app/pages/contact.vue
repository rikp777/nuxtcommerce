<script setup lang="ts">
import PageHero from "~/components/PageHero.vue";
import type { Company } from "~~/types/company";
import storesData from "~/data/stores.json";

const { t } = useI18n();
const appConfig = useAppConfig();
const company = appConfig.company as Company;

useSeoMeta({
  title: t('nav.contact'),
  description: t('company.about.cta.desc'),
});

const headquarters = computed(() => {
  return storesData.filter(store => store.type === 'headquarter');
});

const hqId = computed(() => headquarters.value[0]?.id || null);
const hqSchedule = computed(() => headquarters.value[0]?.weeklyHours || []);
</script>

<template>
  <div class="flex justify-center w-full min-h-screen pb-20">

    <div class="flex flex-col w-full max-w-[1800px] mx-3 lg:mx-5 mt-5">
      <PageHero
          :title="$t('company.contact.title')"
          :subtitle="$t('company.about.cta.desc')"
          :tagline="$t('store.faq.contact_us')"
          image-src="https://images.unsplash.com/photo-1665045622636-ee4ce6e362ac?q=80&w=1740&auto=format&fit=crop"
      />

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

        <div class="lg:col-span-5">
          <ContactInfo
              :company="company"
              :hq-schedule="hqSchedule"
              :stores="headquarters"
              :selected-store-id="hqId"
          />
        </div>

        <div class="lg:col-span-7">
          <ContactForm />
        </div>

      </div>
    </div>
  </div>
</template>