<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();
const appConfig = useAppConfig();

useSeoMeta({
  title: t('nav.terms') || 'Terms and Conditions',
  description: `Terms and conditions for ${appConfig.site.name}.`,
});

const sections = [
  {
    title: 'Terms and Conditions',
    content: `These terms and conditions apply to all services and products offered by ${appConfig.site.name}. By using our website or services, you agree to these terms and conditions.`
  },
  {
    title: 'Orders',
    content: `Orders will be processed after receipt of payment. ${appConfig.site.name} reserves the right to refuse or cancel orders without giving any reason.`
  },
  {
    title: 'Delivery',
    content: 'We aim to deliver your order within 2-5 working days. Delivery times are indicative and do not entitle you to compensation.'
  },
  {
    title: 'Return Policy',
    content: 'You have the right to return your order within 30 days. Products must be returned in their original condition and packaging. Return shipping costs are the responsibility of the customer.'
  },
  {
    title: 'Changes',
    content: 'We reserve the right to change these terms and conditions at any time. The amended terms and conditions will take effect upon publication on our website.'
  }
];
</script>

<template>
  <div class="flex justify-center w-full min-h-screen pb-10">

    <div class="flex flex-col w-full max-w-[1000px] mx-3 lg:mx-5 mt-5">

      <div class="bg-white dark:bg-black border border-gray-200 dark:border-neutral-800 rounded-[32px] p-8 lg:p-12 shadow-sm mb-6">
        <h1 class="text-3xl lg:text-4xl font-bold mb-4 text-black dark:text-white">Terms and Conditions</h1>
        <p class="text-neutral-500 dark:text-neutral-400">
          Last updated: {{ new Date().getFullYear() }}
        </p>
      </div>

      <div class="bg-white dark:bg-black border border-gray-200 dark:border-neutral-800 rounded-[32px] p-8 lg:p-12 shadow-sm space-y-10">

        <div v-for="(section, index) in sections" :key="index">
          <h2 class="text-xl font-bold text-black dark:text-white mb-3">
            {{ index + 1 }}. {{ section.title }}
          </h2>
          <p class="text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {{ section.content }}
          </p>
        </div>

        <div class="pt-6 border-t border-gray-100 dark:border-neutral-800">
          <h2 class="text-xl font-bold text-black dark:text-white mb-3">
            {{ sections.length + 1 }}. Contact
          </h2>
          <p class="text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Do you have any questions about these terms and conditions? Please contact us via our
            <NuxtLink
                :to="localePath('/contact')"
                class="text-black dark:text-white font-semibold underline underline-offset-4 decoration-alizarin-crimson-500 hover:text-alizarin-crimson-600 transition-colors"
            >
              contact page
            </NuxtLink>.
          </p>
        </div>

      </div>

    </div>
  </div>
</template>