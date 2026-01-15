<script setup lang="ts">
defineProps<{
  orders: any[]
}>();

defineEmits(['view-order']);

const expandedOrderId = ref<string | null>(null);

function toggleOrder(id: string) {
  expandedOrderId.value = expandedOrderId.value === id ? null : id;
}

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

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    COMPLETED: 'Voltooid',
    PROCESSING: 'In behandeling',
    ON_HOLD: 'In de wacht',
    PENDING: 'Wachtend op betaling',
    CANCELLED: 'Geannuleerd',
    REFUNDED: 'Terugbetaald',
    FAILED: 'Mislukt'
  };
  return map[status] || status;
};
</script>

<template>
  <div class="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-[32px] p-8 shadow-sm">
    <h2 class="text-2xl font-bold mb-6 text-black dark:text-white">Mijn Bestellingen</h2>

    <div v-if="orders.length === 0" class="text-center py-10 text-neutral-500">
      <UIcon name="i-iconamoon-shopping-bag" class="mx-auto mb-2 opacity-50" size="40"/>
      <p>Je hebt nog geen bestellingen geplaatst.</p>
      <NuxtLink to="/" class="text-brand font-bold mt-2 inline-block hover:underline">Ga winkelen</NuxtLink>
    </div>

    <div v-else class="space-y-4">
      <div
          v-for="order in orders"
          :key="order.id"
          @click="toggleOrder(order.id)"
          class="rounded-2xl bg-gray-50 dark:bg-neutral-800/50 border border-gray-100 dark:border-neutral-800 hover:border-brand dark:hover:border-brand transition-all cursor-pointer group overflow-hidden"
      >
        <div class="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-white dark:bg-neutral-800 flex items-center justify-center shadow-sm transition-colors group-hover:bg-brand group-hover:text-white">
              <UIcon :name="expandedOrderId === order.id ? 'i-iconamoon-arrow-up-2' : 'i-iconamoon-shopping-bag'"
                     :class="expandedOrderId === order.id ? 'text-black dark:text-white group-hover:text-white' : 'text-neutral-400 group-hover:text-white'"/>
            </div>
            <div>
              <p class="font-bold text-black dark:text-white">Order #{{ order.orderNumber }}</p>
              <p class="text-xs text-neutral-500">{{ order.formattedDate }}</p>
            </div>
          </div>

          <div class="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
            <span class="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider" :class="getStatusColor(order.status)">
              {{ getStatusLabel(order.status) }}
            </span>
            <span class="font-bold text-black dark:text-white min-w-[80px] text-right">{{ order.total }}</span>
          </div>
        </div>

        <div v-if="expandedOrderId === order.id" class="bg-white dark:bg-neutral-900 border-t border-gray-100 dark:border-neutral-800 p-6 animate-fade-in">
          <h4 class="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">Artikelen</h4>
          <ul class="space-y-3">
            <li v-for="item in order.lineItems?.nodes" :key="item.product?.node?.name" class="flex justify-between text-sm">
              <span class="text-black dark:text-white">
                <span class="font-bold text-neutral-400 mr-2">x{{ item.quantity || 1 }}</span>
                {{ item.product?.node?.name || 'Onbekend product' }}
              </span>
            </li>
          </ul>

          <div class="mt-6 pt-4 border-t border-gray-100 dark:border-neutral-800 flex justify-end">
            <button
                @click.stop="$emit('view-order', order.id)"
                class="text-xs font-bold text-black dark:text-white hover:underline flex items-center gap-1"
            >
              Bekijk volledige details <UIcon name="i-iconamoon-arrow-right-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in { animation: fadeIn 0.2s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
</style>