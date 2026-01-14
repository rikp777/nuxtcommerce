<script setup lang="ts">
import AppMeta from "~/components/AppMeta.vue";
import FooterButtons from "~/components/FooterButtons.vue";
import SubscribeBox from "~/components/SubscribeBox.vue";
import FooterCompanyDetails from "~/components/FooterCompanyDetails.vue";
import FooterSocials from "~/components/FooterSocials.vue";

const {t} = useI18n();
const localePath = useLocalePath();
const config = useRuntimeConfig();

const footerLinks = computed(() => {
  const companyLinks = [
    ...(config.public.enable.storeLocator ? [{label: t('stores.find_store'), to: '/stores'}] : []),
    ...(config.public.enable.about ? [{label: t('company.about.title'), to: '/about'}] : []),
  ];

  const supportLinks = [
    {label: t('product.shipping_returns'), to: '/shipping'},
    {label: t('store.faq.title'), to: '/faq'},
    {label: t('company.contact.title'), to: '/contact'},
    ...(config.public.enable.legal ? [{label: t('store.legal.title'), to: '/legal'}] : []),
  ];

  const groups = [
    { title: t('company.title'), links: companyLinks },
    { title: t('company.support'), links: supportLinks }
  ];

  return groups.filter(group => group.links.length > 0);
});
</script>

<template>
  <footer class="
    mt-auto m-4 p-8
    bg-white/80 dark:bg-black/60
    backdrop-blur-md
    border border-white/40 dark:border-white/10
    rounded-2xl
    relative z-20
  ">
    <div class="container mx-auto max-w-7xl">

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

        <FooterCompanyDetails />

        <div v-for="(group, idx) in footerLinks" :key="idx">
          <h3 class="font-bold text-black dark:text-white mb-4">{{ group.title }}</h3>
          <ul class="space-y-3 text-sm">
            <li v-for="(link, lIdx) in group.links" :key="lIdx">
              <NuxtLink
                  :to="localePath(link.to)"
                  class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div class="lg:col-start-4 lg:pl-4 flex flex-col gap-8">
          <SubscribeBox />
          <FooterSocials />
        </div>

      </div>

      <hr class="border-neutral-300 dark:border-white/10 mb-8"/>

      <div class="flex flex-col-reverse md:flex-row items-center justify-between gap-6 text-sm text-neutral-500 dark:text-neutral-400">
        <AppMeta />
        <FooterButtons />
      </div>

    </div>
  </footer>
</template>