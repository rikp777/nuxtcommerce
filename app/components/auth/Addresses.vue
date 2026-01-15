<script setup lang="ts">
const props = defineProps<{
  user: any
}>();

const { t } = useI18n();

const { data: addresses, refresh: refreshAddresses } = await useFetch('/api/auth/addresses', {
  key: 'user-addresses'
});

const editingType = ref<null | 'billing' | 'shipping'>(null);
const savingAddress = ref(false);

const addressForm = reactive({
  company: '',
  firstName: '',
  lastName: '',
  address1: '',
  postcode: '',
  city: '',
  country: 'NL',
  email: '',
  phone: ''
});

function startEditAddress(type: 'billing' | 'shipping') {
  const data = addresses.value?.[type] || {};

  addressForm.company = data.company || '';
  addressForm.firstName = data.firstName || props.user?.firstName || '';
  addressForm.lastName = data.lastName || props.user?.lastName || '';
  addressForm.address1 = data.address1 || '';
  addressForm.postcode = data.postcode || '';
  addressForm.city = data.city || '';
  addressForm.country = data.country || 'NL';
  addressForm.email = data.email || props.user?.email || '';
  addressForm.phone = data.phone || '';

  editingType.value = type;
}

async function saveAddress() {
  if (savingAddress.value || !editingType.value) return;
  savingAddress.value = true;

  try {
    await $fetch('/api/auth/addresses', {
      method: 'POST',
      body: {
        type: editingType.value,
        data: addressForm
      }
    });

    push.success(t('auth.addresses.notifications.success'));
    editingType.value = null;
    await refreshAddresses();
  } catch (e) {
    push.error(t('auth.addresses.notifications.error'));
  } finally {
    savingAddress.value = false;
  }
}

const inputUi = {
  base: 'bg-gray-50 dark:bg-neutral-800 border-none rounded-xl text-black dark:text-white',
  placeholder: 'placeholder-gray-400 dark:placeholder-neutral-600',
};
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-6 text-black dark:text-white">{{ t('auth.addresses.title') }}</h2>

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">

      <div class="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-[32px] p-8 shadow-sm flex flex-col h-full relative overflow-hidden">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center">
              <UIcon name="i-iconamoon-file-document" class="text-black dark:text-white" />
            </div>
            <h3 class="font-bold text-lg text-black dark:text-white">{{ t('auth.addresses.billing_title') }}</h3>
          </div>
          <button v-if="editingType !== 'billing'" @click="startEditAddress('billing')" class="text-sm font-bold text-brand hover:underline">{{ t('auth.addresses.edit') }}</button>
        </div>

        <div v-if="editingType !== 'billing'" class="flex-1">
          <div v-if="addresses?.billing?.address1" class="space-y-1 text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
            <p v-if="addresses.billing.company" class="font-bold text-black dark:text-white uppercase tracking-wider text-xs mb-1">
              {{ addresses.billing.company }}
            </p>
            <p :class="{'font-bold text-black dark:text-white text-base': !addresses.billing.company}">
              {{ addresses.billing.firstName }} {{ addresses.billing.lastName }}
            </p>
            <p>{{ addresses.billing.address1 }}</p>
            <p>{{ addresses.billing.postcode }} {{ addresses.billing.city }}</p>
            <p>{{ addresses.billing.country }}</p>
            <p v-if="addresses.billing.email" class="pt-2 flex items-center gap-2"><UIcon name="i-iconamoon-email" /> {{ addresses.billing.email }}</p>
            <p v-if="addresses.billing.phone" class="flex items-center gap-2"><UIcon name="i-iconamoon-phone" /> {{ addresses.billing.phone }}</p>
          </div>
          <div v-else class="text-neutral-400 text-sm italic py-4">
            {{ t('auth.addresses.empty_billing') }}
          </div>
        </div>

        <form v-else @submit.prevent="saveAddress" class="space-y-4">
          <UFormGroup :label="t('auth.addresses.form.company')">
            <UInput v-model="addressForm.company" :ui="inputUi" :placeholder="t('auth.addresses.form.company_placeholder')" />
          </UFormGroup>

          <div class="grid grid-cols-2 gap-3">
            <UFormGroup :label="t('auth.addresses.form.first_name')"><UInput v-model="addressForm.firstName" :ui="inputUi" /></UFormGroup>
            <UFormGroup :label="t('auth.addresses.form.last_name')"><UInput v-model="addressForm.lastName" :ui="inputUi" /></UFormGroup>
          </div>
          <UFormGroup :label="t('addresses.form.address')"><UInput v-model="addressForm.address1" :ui="inputUi" /></UFormGroup>
          <div class="grid grid-cols-3 gap-3">
            <UFormGroup :label="t('auth.addresses.form.postcode')"><UInput v-model="addressForm.postcode" :ui="inputUi" /></UFormGroup>
            <UFormGroup :label="t('auth.addresses.form.city')" class="col-span-2"><UInput v-model="addressForm.city" :ui="inputUi" /></UFormGroup>
          </div>
          <UFormGroup :label="t('auth.addresses.form.phone')"><UInput v-model="addressForm.phone" :ui="inputUi" /></UFormGroup>
          <UFormGroup :label="t('auth.addresses.form.email')"><UInput v-model="addressForm.email" :ui="inputUi" /></UFormGroup>

          <div class="flex gap-3 pt-2">
            <UButton type="submit" color="black" :loading="savingAddress">{{ t('auth.addresses.save') }}</UButton>
            <UButton variant="ghost" color="gray" @click="editingType = null">{{ t('auth.addresses.cancel') }}</UButton>
          </div>
        </form>
      </div>

      <div class="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-[32px] p-8 shadow-sm flex flex-col h-full relative overflow-hidden">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center">
              <UIcon name="i-iconamoon-delivery" class="text-black dark:text-white" />
            </div>
            <h3 class="font-bold text-lg text-black dark:text-white">{{ t('auth.addresses.shipping_title') }}</h3>
          </div>
          <button v-if="editingType !== 'shipping'" @click="startEditAddress('shipping')" class="text-sm font-bold text-brand hover:underline">{{ t('auth.addresses.edit') }}</button>
        </div>

        <div v-if="editingType !== 'shipping'" class="flex-1">
          <div v-if="addresses?.shipping?.address1" class="space-y-1 text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
            <p v-if="addresses.shipping.company" class="font-bold text-black dark:text-white uppercase tracking-wider text-xs mb-1">
              {{ addresses.shipping.company }}
            </p>
            <p :class="{'font-bold text-black dark:text-white text-base': !addresses.shipping.company}">
              {{ addresses.shipping.firstName }} {{ addresses.shipping.lastName }}
            </p>
            <p>{{ addresses.shipping.address1 }}</p>
            <p>{{ addresses.shipping.postcode }} {{ addresses.shipping.city }}</p>
            <p>{{ addresses.shipping.country }}</p>
          </div>
          <div v-else class="text-neutral-400 text-sm italic py-4">
            {{ t('auth.addresses.empty_shipping') }}
          </div>
        </div>

        <form v-else @submit.prevent="saveAddress" class="space-y-4">
          <UFormGroup :label="t('auth.addresses.form.company')">
            <UInput v-model="addressForm.company" :ui="inputUi" :placeholder="t('auth.addresses.form.company_placeholder')" />
          </UFormGroup>

          <div class="grid grid-cols-2 gap-3">
            <UFormGroup :label="t('auth.addresses.form.first_name')"><UInput v-model="addressForm.firstName" :ui="inputUi" /></UFormGroup>
            <UFormGroup :label="t('auth.addresses.form.last_name')"><UInput v-model="addressForm.lastName" :ui="inputUi" /></UFormGroup>
          </div>
          <UFormGroup :label="t('auth.addresses.form.address')"><UInput v-model="addressForm.address1" :ui="inputUi" /></UFormGroup>
          <div class="grid grid-cols-3 gap-3">
            <UFormGroup :label="t('auth.addresses.form.postcode')"><UInput v-model="addressForm.postcode" :ui="inputUi" /></UFormGroup>
            <UFormGroup :label="t('auth.addresses.form.city')" class="col-span-2"><UInput v-model="addressForm.city" :ui="inputUi" /></UFormGroup>
          </div>

          <div class="flex gap-3 pt-2">
            <UButton type="submit" color="black" :loading="savingAddress">{{ t('auth.addresses.save') }}</UButton>
            <UButton variant="ghost" color="gray" @click="editingType = null">{{ t('auth.addresses.cancel') }}</UButton>
          </div>
        </form>
      </div>

    </div>
  </div>
</template>