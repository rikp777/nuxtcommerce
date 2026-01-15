<script setup lang="ts">
const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const localePath = useLocalePath();

const { data: user, status, error } = await useFetch('/api/auth/user', {
  key: 'user-profile',
  retry: 0
});
const { data: rawOrders } = await useFetch('/api/auth/orders', { key: 'user-orders' });
const { data: addresses, refresh: refreshAddresses } = await useFetch('/api/auth/addresses', { key: 'user-addresses' });

const initOrderId = route.query.orderId as string | undefined;
const selectedOrderId = ref<string | null>(initOrderId || null);
const activeTab = ref(initOrderId ? 'orders' : 'dashboard');

const orders = computed(() => {
  if (!rawOrders.value) return [];
  return rawOrders.value.map((order: any) => ({
    ...order,
    formattedDate: new Date(order.date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' }),
  }));
});

function openOrder(id: string) {
  selectedOrderId.value = id;
  router.push({ query: { ...route.query, orderId: id } });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeOrder() {
  selectedOrderId.value = null;
  const query = { ...route.query };
  delete query.orderId;
  router.push({ query });
}

async function handleLogout() {
  await $fetch('/api/auth/logout', { method: 'POST' });
  push.success(t('account.logout_success'));
  window.location.href = localePath('/');
}

watch(activeTab, (newTab) => {
  if (newTab !== 'orders' && selectedOrderId.value) {
    closeOrder();
  }
});

watch(() => route.query.orderId, (newId) => {
  if (newId) {
    selectedOrderId.value = newId as string;
    activeTab.value = 'orders';
  } else {
    selectedOrderId.value = null;
  }
});

watchEffect(() => {
  if (error.value || (!user.value && status.value === 'success')) {
    router.push(localePath('/account/login'));
  }
});

const tabs = computed(() => [
  { id: 'dashboard', label: t('auth.account.tabs.dashboard'), icon: 'i-iconamoon-home' },
  { id: 'orders', label: t('auth.account.tabs.orders'), icon: 'i-iconamoon-delivery' },
  { id: 'addresses', label: t('auth.account.tabs.addresses'), icon: 'i-iconamoon-location' },
  { id: 'details', label: t('auth.account.tabs.details'), icon: 'i-iconamoon-profile' },
]);
</script>

<template>
  <div v-if="user" class="min-h-screen bg-gray-50 dark:bg-black pt-20 pb-10 px-4">
    <div class="max-w-[1600px] mx-auto">

      <div class="flex flex-col lg:flex-row gap-8 mt-6">

        <div class="w-full lg:w-80 shrink-0">
          <div class="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-[32px] p-6 sticky top-24 shadow-sm">
            <div class="flex items-center gap-4 mb-8 p-2">
              <div class="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center text-brand font-bold text-xl uppercase">
                {{ user.firstName[0] }}{{ user.lastName[0] }}
              </div>
              <div class="overflow-hidden">
                <p class="font-bold truncate text-black dark:text-white">{{ user.firstName }} {{ user.lastName }}</p>
                <p class="text-xs text-neutral-500 truncate">{{ user.email }}</p>
              </div>
            </div>

            <nav class="space-y-2">
              <button
                  v-for="tab in tabs"
                  :key="tab.id"
                  @click="activeTab = tab.id"
                  class="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm"
                  :class="activeTab === tab.id
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-md'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800'"
              >
                <UIcon :name="tab.icon" size="20" />
                {{ tab.label }}
              </button>
              <hr class="border-gray-100 dark:border-neutral-800 my-4" />
              <button @click="handleLogout" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10">
                <UIcon name="i-iconamoon-exit" size="20" />
                {{ t('auth.account.logout') }}
              </button>
            </nav>
          </div>
        </div>

        <div class="flex-1">
          <Transition name="fade" mode="out-in">

            <AuthDashboard
                v-if="activeTab === 'dashboard'"
                :user="user"
                :orders="orders"
                @change-tab="(tab) => activeTab = tab"
                @view-order="openOrder"
                @logout="handleLogout"
            />

            <div v-else-if="activeTab === 'orders'">
              <AuthOrderDetails
                  v-if="selectedOrderId"
                  :order-id="selectedOrderId"
                  @back="closeOrder"
              />
              <AuthOrders
                  v-else
                  :orders="orders"
                  @view-order="openOrder"
              />
            </div>

            <AuthAddresses
                v-else-if="activeTab === 'addresses'"
                :user="user"
                :addresses="addresses"
                @refresh="refreshAddresses"
            />

            <AuthDetails v-else-if="activeTab === 'details'" :user="user" />

          </Transition>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
    <UIcon name="i-svg-spinners-90-ring-with-bg" size="40" class="text-brand" />
  </div>
</template>