<script setup lang="ts">
const props = defineProps<{
  orderId: string
}>();

const emit = defineEmits(['back']);
const { t } = useI18n();

const { data: order, pending, error } = await useFetch(() => `/api/auth/orders/${encodeURIComponent(props.orderId)}`);

const getStatusColor = (status: string) => {
  switch (status) {
    case 'COMPLETED': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    case 'PROCESSING': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    case 'ON_HOLD': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
    case 'CANCELLED':
    case 'FAILED':
    case 'REFUNDED': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('nl-NL', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
};

const formatPrice = (priceString: string) => {
  if (!priceString) return '';
  return priceString.replace(/&nbsp;/g, ' ');
};
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <button
        @click="$emit('back')"
        class="inline-flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
    >
      <UIcon name="i-iconamoon-arrow-left-2" />
      {{ t('auth.orders.details.back') }}
    </button>

    <div v-if="pending" class="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-[32px] p-8 shadow-sm space-y-8">
      <div class="flex flex-col md:flex-row justify-between gap-4 pb-8 border-b border-gray-100 dark:border-neutral-800">
        <div class="space-y-2">
          <div class="h-8 w-48 bg-gray-100 dark:bg-neutral-800 animate-pulse rounded-lg"></div>
          <div class="h-4 w-32 bg-gray-50 dark:bg-neutral-800/50 animate-pulse rounded-md"></div>
        </div>
        <div class="md:text-right space-y-2">
          <div class="h-4 w-20 bg-gray-50 dark:bg-neutral-800/50 animate-pulse rounded-md ml-auto"></div>
          <div class="h-8 w-32 bg-gray-100 dark:bg-neutral-800 animate-pulse rounded-lg ml-auto"></div>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="space-y-3">
          <div class="h-4 w-24 bg-gray-100 dark:bg-neutral-800 animate-pulse rounded"></div>
          <div class="h-20 w-full bg-gray-50 dark:bg-neutral-800/50 animate-pulse rounded-xl"></div>
        </div>
        <div class="space-y-3">
          <div class="h-4 w-24 bg-gray-100 dark:bg-neutral-800 animate-pulse rounded"></div>
          <div class="h-20 w-full bg-gray-50 dark:bg-neutral-800/50 animate-pulse rounded-xl"></div>
        </div>
      </div>
    </div>

    <div v-else-if="error || !order" class="p-8 bg-red-50 dark:bg-red-900/10 text-red-600 rounded-[32px] border border-red-100 dark:border-red-900/30">
      <h3 class="font-bold mb-2">{{ t('auth.orders.details.not_found') }}</h3>
      <p class="text-sm">{{ t('auth.orders.details.error_message') }}</p>
      <p class="text-xs mt-2 font-mono opacity-70">{{ error?.message }}</p>
    </div>

    <div v-else class="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-[32px] p-8 shadow-sm">

      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-gray-100 dark:border-neutral-800">
        <div>
          <h1 class="text-2xl font-bold text-black dark:text-white flex items-center gap-3">
            Order #{{ order.orderNumber }}
            <span class="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider" :class="getStatusColor(order.status)">
              {{ t(`auth.orders.status.${order.status}`, order.status) }}
            </span>
          </h1>
          <p class="text-neutral-500 text-sm mt-1">{{ formatDate(order.date) }}</p>
        </div>
        <div class="text-right">
          <p class="text-sm text-neutral-500">{{ t('auth.orders.details.total_amount') }}</p>
          <p class="text-2xl font-bold text-black dark:text-white">{{ formatPrice(order.total) }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-b border-gray-100 dark:border-neutral-800">
        <div>
          <h3 class="font-bold text-black dark:text-white mb-3 uppercase text-xs tracking-wider">{{ t('auth.orders.details.billing_address') }}</h3>
          <address class="not-italic text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed" v-if="order.billing">
            {{ order.billing.firstName }} {{ order.billing.lastName }}<br>
            {{ order.billing.address1 }}<br>
            {{ order.billing.postcode }} {{ order.billing.city }}<br>
            {{ order.billing.country }}<br>
            <span class="block mt-2 text-xs">{{ order.billing.email }}</span>
            <span class="block text-xs">{{ order.billing.phone }}</span>
          </address>
        </div>
        <div>
          <h3 class="font-bold text-black dark:text-white mb-3 uppercase text-xs tracking-wider">{{ t('auth.orders.details.shipping_address') }}</h3>
          <address class="not-italic text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed" v-if="order.shipping">
            {{ order.shipping.firstName }} {{ order.shipping.lastName }}<br>
            {{ order.shipping.address1 }}<br>
            {{ order.shipping.postcode }} {{ order.shipping.city }}<br>
            {{ order.shipping.country }}
          </address>
          <p v-else class="text-sm text-neutral-400 italic">{{ t('auth.orders.details.no_shipping') }}</p>
        </div>
      </div>

      <div class="py-8">
        <h3 class="font-bold text-black dark:text-white mb-4 uppercase text-xs tracking-wider">{{ t('auth.orders.details.items') }}</h3>
        <ul class="divide-y divide-gray-100 dark:divide-neutral-800">
          <li v-for="(item, i) in order.lineItems?.nodes" :key="i" class="py-4 flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-gray-50 dark:bg-neutral-800 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                <img v-if="item.product?.node?.image?.sourceUrl" :src="item.product.node.image.sourceUrl" class="w-full h-full object-cover" />
                <UIcon v-else name="i-iconamoon-shopping-bag" class="text-neutral-400" />
              </div>
              <div>
                <p class="font-bold text-black dark:text-white text-sm">{{ item.product?.node?.name || t('auth.orders.details.product_unavailable') }}</p>
                <p class="text-xs text-neutral-500">{{ t('auth.orders.details.quantity') }}: {{ item.quantity }}</p>
              </div>
            </div>
            <span class="font-bold text-black dark:text-white text-sm">{{ formatPrice(item.total) }}</span>
          </li>
        </ul>
      </div>

      <div class="bg-gray-50 dark:bg-neutral-800/50 rounded-2xl p-6 space-y-2">
        <div class="flex justify-between text-sm text-neutral-600 dark:text-neutral-400">
          <span>{{ t('auth.orders.details.subtotal') }}</span>
          <span>{{ formatPrice(order.subtotal) }}</span>
        </div>
        <div class="flex justify-between text-sm text-neutral-600 dark:text-neutral-400">
          <span>{{ t('auth.orders.details.shipping') }}</span>
          <span>{{ formatPrice(order.shippingTotal) }}</span>
        </div>
        <div class="flex justify-between text-sm text-neutral-600 dark:text-neutral-400">
          <span>{{ t('auth.orders.details.tax') }}</span>
          <span>{{ formatPrice(order.totalTax) }}</span>
        </div>
        <div class="flex justify-between font-bold text-black dark:text-white pt-2 border-t border-gray-200 dark:border-neutral-700 mt-2">
          <span>{{ t('auth.orders.details.total') }}</span>
          <span>{{ formatPrice(order.total) }}</span>
        </div>
        <div class="pt-2 text-xs text-neutral-400 text-right">
          {{ t('auth.orders.details.paid_with', { method: order.paymentMethodTitle }) }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>