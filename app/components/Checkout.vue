<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useCart } from '~/composables/useCart';
import { useStripePayment } from '~/composables/useStripePayment';

const { stripe, paymentGateways, isLoading, error, processPayment } = useStripePayment();
const { cart, clearCart } = useCart();

const userDetails = ref({
  email: 'rikpeeters11@hotmail.com',
  firstName: 'Rik',
  lastName: 'Peeters',
  phone: '0613312009',
  address1: 'Irenestraat 4',
  city: 'Panningen',
  postcode: '5981XL',
  country: 'NL',
});

const selectedPaymentMethod = ref(null);
let elements = null;
let paymentElement = null;

const cartTotal = computed(() => {
  if (!cart.value || !cart.value.length) return '0.00';

  return cart.value.reduce((total, item) => {
    const priceString = item.variation.node.salePrice || item.variation.node.regularPrice;
    return total + parseFloat(priceString);
  }, 0).toFixed(2);
});


const initializeOrUpdateStripeElements = () => {
  if (!stripe.value || parseFloat(cartTotal.value) <= 0) {
    return;
  }

  if (paymentElement) {
    paymentElement.destroy();
  }

  const options = {
    mode: 'payment',
    amount: Math.round(parseFloat(cartTotal.value) * 100),
    currency: 'eur',
  };
  elements = stripe.value.elements(options);

  paymentElement = elements.create('payment');
  paymentElement.mount('#stripe-payment-element');
};

watch(cartTotal, () => {
  if (selectedPaymentMethod.value === 'stripe') {
    initializeOrUpdateStripeElements();
  }
});

watch(selectedPaymentMethod, (newMethod) => {
  if (newMethod === 'stripe') {
    initializeOrUpdateStripeElements();
  }
});

watch(paymentGateways, (gateways) => {
  if (gateways && gateways.length > 0 && !selectedPaymentMethod.value) {
    selectedPaymentMethod.value = gateways[0].id;
  }
}, { immediate: true });

onMounted(async () => {
  await stripe;
  if (selectedPaymentMethod.value === 'stripe') {
    initializeOrUpdateStripeElements();
  }
});

const handlePlaceOrder = async () => {
  if (selectedPaymentMethod.value === 'stripe') {
    if (!elements) {
      error.value = "Payment form is not ready. Please check your details.";
      return;
    }
    await processPayment(userDetails.value, elements);
  } else {
    isLoading.value = true;
    error.value = null;
    try {
      await $fetch('/api/checkout', {
        method: 'POST',
        body: { billing: userDetails.value, paymentMethod: 'cod' },
      });
      clearCart();
      navigateTo('/order-confirmation/cod');
    } catch (e) {
      error.value = 'Could not place order. Please try again.';
    } finally {
      isLoading.value = false;
    }
  }
};
</script>

<template>
  <div class="bg-black/5 dark:bg-white/10 my-3 mr-3 p-3 rounded-3xl flex flex-col m-3 p-3">
    <div class="text-xl font-bold px-2 mb-3">Checkout</div>
    <form @submit.prevent="handlePlaceOrder" class="flex flex-col items-center justify-center">
      <div class="flex-grow overflow-y-auto pr-2">
        <div class="grid grid-cols-2 gap-3 billing w-full">
          <div class="col-span-full">
            <input required v-model="userDetails.email" :placeholder="$t('checkout.form.email')" name="email" type="email" class="" />
          </div>
          <div class="col-span-1">
            <input required v-model="userDetails.firstName" :placeholder="$t('checkout.form.first_name')" name="first-name" type="text" />
          </div>
          <div class="col-span-1">
            <input required v-model="userDetails.lastName" :placeholder="$t('checkout.form.last_name')" name="last-name" type="text" />
          </div>
          <div class="col-span-1">
            <input required v-model="userDetails.phone" :placeholder="$t('checkout.form.phone')" name="phone" type="text" />
          </div>
          <div class="col-span-1">
            <input required v-model="userDetails.city" :placeholder="$t('checkout.form.city')" name="city" type="text" />
          </div>
          <div class="col-span-full">
            <textarea required v-model="userDetails.address1" :placeholder="$t('checkout.form.address')" name="address" rows="2"></textarea>
          </div>
        </div>

        <div class="w-full my-4">
          <div v-for="gateway in paymentGateways" :key="gateway.id" class="payment-method-label">
            <label>
              <input type="radio" :value="gateway.id" v-model="selectedPaymentMethod" name="payment_method" />
              <span>{{ gateway.title }}</span>
            </label>
          </div>
        </div>

        <div v-show="selectedPaymentMethod === 'stripe'" class="stripe-container w-full min-h-[100px]">
          <div id="stripe-payment-element"></div>
        </div>

        <div v-if="error" class="error-message">{{ error }}</div>
      </div>

      <div class="mt-auto pt-4">
        <div class="text-sm font-semibold p-4 text-neutral-600 dark:text-neutral-400">
          {{
            $t('checkout.pay.description', {
              total: cartTotal,
              items: cart.length,
            })
          }}
        </div>

        <button
            type="submit"
            :disabled="isLoading"
            class="pay-button-bezel w-full h-12 rounded-xl relative font-semibold text-white dark:text-black text-lg flex justify-center items-center">
          <Transition name="slide-up">
            <div v-if="!isLoading" class="absolute">
              {{
                $t('checkout.pay.btn', {
                  total: cartTotal,
                })
              }}
            </div>
            <UIcon v-else class="absolute" name="i-svg-spinners-90-ring-with-bg" size="22" />
          </Transition>
        </button>

        <div class="text-xs font-medium p-4 flex gap-1 items-end text-neutral-400 dark:text-neutral-600">
          <UIcon name="i-iconamoon-lock-fill" size="18" />
          <div>
            {{
              $t('checkout.pay.secure', {
                method: 'Stripe',
              })
            }}
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<style lang="postcss">
:root {
  --background: #fff;
  --border: #ccc;
}

.dark {
  --background: #000;
  --border: #999;
}

input:-webkit-autofill,
textarea:-webkit-autofill,
select:-webkit-autofill {
  -webkit-box-shadow: 0 0 0px 1000px var(--background, #fff) inset !important;
  box-shadow: 0 0 0px 1000px var(--background, #fff) inset !important;
  border-color: var(--border) !important;
}

.billing input,
.billing textarea {
  @apply block bg-white/80 dark:bg-black/20 dark:border-white/20 w-full shadow font-semibold border-2 border-transparent transition hover:border-black dark:hover:border-white rounded-2xl py-3 px-4 text-black dark:text-white placeholder:text-neutral-400 text-sm leading-6 focus-visible:outline-none focus-visible:border-black focus-visible:dark:border-white;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 250ms;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

textarea {
  resize: none;
}

.pay-button-bezel {
  box-shadow: 0 0 0 var(--button-outline, 0px) rgba(92, 222, 131, 0.3), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.25), inset 0 1px 0 0 rgba(255, 255, 255, 0.3),
    0 1px 1px 0 rgba(0, 0, 0, 0.3);
  @apply bg-[#23a26d] dark:bg-[#40d195] outline-none tracking-[-0.125px] transition scale-[var(--button-scale,1)] duration-200;

  &:hover {
    @apply brightness-110;
  }

  &:active {
    --button-outline: 4px;
    --button-scale: 0.975;
  }
}

.payment-method-label {
  @apply block bg-white/80 dark:bg-black/20 w-full shadow font-semibold border-2 border-transparent rounded-2xl py-3 px-4 mb-2;
}
.payment-method-label label {
  @apply flex items-center gap-3 cursor-pointer;
}
.stripe-container {
  @apply border-2 border-neutral-200 dark:border-white/20 p-4 rounded-2xl my-2;
}
.error-message {
  @apply text-red-500 font-semibold text-sm my-2 text-center;
}
</style>
