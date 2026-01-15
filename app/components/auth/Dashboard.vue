<script setup lang="ts">
const props = defineProps<{
  user: any;
  orders: any[];
}>();

const emit = defineEmits(['change-tab', 'logout', 'view-order']);
const { t } = useI18n();
const localePath = useLocalePath();

const openOrdersCount = computed(() => {
  return props.orders.filter(o => !['COMPLETED', 'CANCELLED', 'FAILED', 'REFUNDED'].includes(o.status)).length;
});

const latestOrder = computed(() => props.orders.length > 0 ? props.orders[0] : null);

const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 6) return t('auth.dashboard.greetings.night');
  if (hour < 12) return t('auth.dashboard.greetings.morning');
  if (hour < 18) return t('auth.dashboard.greetings.afternoon');
  return t('auth.dashboard.greetings.evening');
});

const formatPrice = (priceString: string | null) => {
  if (!priceString) return '';
  return priceString.replace(/&nbsp;/g, ' ');
};
</script>

<template>
  <div class="space-y-6 animate-fade-in">

    <div class="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-[32px] p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div>
        <h2 class="text-2xl font-bold text-black dark:text-white mb-1">{{ greeting }}, {{ user.firstName }}!</h2>
        <p class="text-neutral-500 dark:text-neutral-400 text-sm">
          {{ t('auth.dashboard.logged_in_as', { email: user.email }) }}
        </p>
      </div>
      <div class="hidden md:block text-right">
        <p class="text-xs text-neutral-400 uppercase tracking-wider font-bold">{{ t('auth.dashboard.customer_number') }}</p>
        <p class="font-mono text-black dark:text-white">#{{ user.databaseId || user.id }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

      <div class="bg-brand text-white rounded-[32px] p-8 shadow-lg shadow-brand/20 relative overflow-hidden group h-full min-h-[240px] flex flex-col justify-between">
        <div class="relative z-10">
          <p class="text-brand-100 text-sm font-bold uppercase tracking-wider mb-1">{{ t('auth.dashboard.open_orders') }}</p>
          <h3 class="text-5xl font-bold tracking-tight">{{ openOrdersCount }}</h3>
        </div>

        <div class="relative z-10">
          <button @click="$emit('change-tab', 'orders')" class="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-3 rounded-xl text-sm font-bold transition-colors w-max flex items-center gap-2 group-hover:pl-6 duration-300">
            {{ t('auth.dashboard.view_orders') }} <UIcon name="i-iconamoon-arrow-right-2" />
          </button>
        </div>

        <UIcon name="i-iconamoon-delivery-fast-fill" class="absolute -bottom-6 -right-6 text-white/10 group-hover:scale-110 transition-transform duration-500 rotate-[-10deg]" size="180" />
      </div>

      <div class="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-[32px] p-8 shadow-sm flex flex-col h-full">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-bold text-lg flex items-center gap-2 text-black dark:text-white">
            <UIcon name="i-iconamoon-clock" class="text-neutral-400" />
            {{ t('auth.dashboard.recent_activity') }}
          </h3>
          <button @click="$emit('change-tab', 'orders')" class="text-xs font-bold text-brand hover:underline">{{ t('auth.dashboard.see_all') }}</button>
        </div>

        <div v-if="latestOrder" class="flex-1 flex flex-col justify-center">
          <div class="p-4 rounded-2xl bg-gray-50 dark:bg-neutral-800/50 border border-gray-100 dark:border-neutral-800 mb-4 transition hover:border-brand cursor-pointer" @click="$emit('view-order', latestOrder.id)">
            <div class="flex justify-between items-center mb-2">
              <span class="font-bold text-black dark:text-white">Order #{{ latestOrder.orderNumber }}</span>
              <span class="text-xs text-neutral-500">{{ latestOrder.formattedDate }}</span>
            </div>
            <div class="flex justify-between items-end">
              <span class="text-xs font-bold px-2 py-1 rounded bg-white dark:bg-black border border-gray-200 dark:border-neutral-700 uppercase tracking-wide">
                {{ t(`auth.orders.status.${latestOrder.status}`, latestOrder.status) }}
              </span>
              <span class="font-bold text-lg text-black dark:text-white">{{ formatPrice(latestOrder.total) }}</span>
            </div>
          </div>
          <p class="text-sm text-neutral-500 text-center">
            {{ t('auth.dashboard.last_order_info', { count: latestOrder.lineItems?.nodes?.length || 0 }) }}
          </p>
        </div>

        <div v-else class="flex-1 flex flex-col items-center justify-center text-neutral-400 py-6">
          <div class="w-16 h-16 rounded-full bg-gray-50 dark:bg-neutral-800 flex items-center justify-center mb-3">
            <UIcon name="i-iconamoon-shopping-bag" size="32" class="opacity-30" />
          </div>
          <p class="text-sm">{{ t('auth.dashboard.no_orders') }}</p>
          <NuxtLink :to="localePath('/')" class="text-brand text-sm font-bold mt-2 hover:underline">{{ t('auth.dashboard.go_shopping') }} &rarr;</NuxtLink>
        </div>
      </div>

    </div>

    <h3 class="font-bold text-lg text-black dark:text-white px-2">{{ t('auth.dashboard.quick_links.title') }}</h3>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <button @click="$emit('change-tab', 'addresses')" class="p-4 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl hover:border-black dark:hover:border-white transition group text-left shadow-sm">
        <div class="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
          <UIcon name="i-iconamoon-location" class="text-blue-600 dark:text-blue-400" size="24" />
        </div>
        <p class="font-bold text-sm text-black dark:text-white">{{ t('auth.dashboard.quick_links.addresses') }}</p>
        <p class="text-xs text-neutral-500 mt-1">{{ t('auth.dashboard.quick_links.addresses_desc') }}</p>
      </button>

      <button @click="$emit('change-tab', 'details')" class="p-4 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl hover:border-black dark:hover:border-white transition group text-left shadow-sm">
        <div class="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
          <UIcon name="i-iconamoon-profile" class="text-purple-600 dark:text-purple-400" size="24" />
        </div>
        <p class="font-bold text-sm text-black dark:text-white">{{ t('auth.dashboard.quick_links.details') }}</p>
        <p class="text-xs text-neutral-500 mt-1">{{ t('auth.dashboard.quick_links.details_desc') }}</p>
      </button>

      <NuxtLink :to="localePath('/contact')" class="p-4 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl hover:border-black dark:hover:border-white transition group text-left shadow-sm">
        <div class="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
          <UIcon name="i-iconamoon-comment" class="text-green-600 dark:text-green-400" size="24" />
        </div>
        <p class="font-bold text-sm text-black dark:text-white">{{ t('auth.dashboard.quick_links.support') }}</p>
        <p class="text-xs text-neutral-500 mt-1">{{ t('auth.dashboard.quick_links.support_desc') }}</p>
      </NuxtLink>

      <button @click="$emit('logout')" class="p-4 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl hover:border-red-500 dark:hover:border-red-500 transition group text-left shadow-sm">
        <div class="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
          <UIcon name="i-iconamoon-exit" class="text-red-600 dark:text-red-400" size="24" />
        </div>
        <p class="font-bold text-sm text-black dark:text-white">{{ t('auth.dashboard.quick_links.logout') }}</p>
        <p class="text-xs text-neutral-500 mt-1">{{ t('auth.dashboard.quick_links.logout_desc') }}</p>
      </button>
    </div>

  </div>
</template>
<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>