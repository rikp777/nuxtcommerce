// Note: I am aware that the other composables are in JavaScript.
// I'm using TypeScript for this composable to take advantage of type safety.
// I will migrate the other JavaScript composables to TypeScript as time allows.

import { ref, onMounted } from 'vue';
import { loadStripe } from '@stripe/stripe-js';
import type { Stripe, StripeElements } from '@stripe/stripe-js';

interface BillingDetails {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    city: string;
    address1: string;
    postcode: string;
    country: string;
}

interface PaymentGateway {
    id: string;
    title: string;
    description: string;
}

interface GetPaymentGatewaysResponse {
    paymentGateways: {
        nodes: PaymentGateway[];
    };
}

interface CheckoutResponse {
    checkout: {
        result: string;
        redirect?: string;
        order?: {
            orderKey: string;
            orderId: number;
        };
    };
}

export const useStripePayment = () => {
    const { stripePk } = useRuntimeConfig().public;

    const stripe = ref<Stripe | null>(null); // Stripe instance
    const paymentGateways = ref<PaymentGateway[]>([]); // Available payment gateways
    const isLoading = ref<boolean>(false);
    const error = ref<string | null>(null);

    /**
     * Initializes the Stripe.js instance on the client.
     */
    const initializeStripe = async () => {
        if (!stripePk) {
            console.error('Stripe publishable key is not configured.');
            error.value =  'Stripe is not configured.';
            return;
        }

        try {
            stripe.value = await loadStripe(stripePk);
        } catch (e) {
            console.error('Failed to load Stripe:', e);
            error.value = 'Could not initialize payment gateway.';
        }
    }

    /**
     * Fetches available payment methods from our Nuxt server endpoint.
     */
    const fetchPaymentGateways = async () => {
        isLoading.value = true;
        error.value = null;
        try {
            const data = await $fetch<GetPaymentGatewaysResponse>('/api/payment-gateways');
            paymentGateways.value = data?.paymentGateways?.nodes || [];
        } catch (e: any) {
            error.value = 'Could not fetch payment methods.';
            console.error(e);
        } finally {
            isLoading.value = false;
        }
    };

    /**
     * Processes the checkout via our Nuxt server and confirms payment with Stripe.
     */
    const processPayment = async (checkoutData: BillingDetails, elements: StripeElements) => {
        if (!stripe.value || !elements) {
            error.value = 'Stripe is not initialized correctly.';
            return null;
        }

        isLoading.value = true;
        error.value = null;

        try {
            // Step 1: Create the order
            const { checkout } = await $fetch<CheckoutResponse>('/api/checkout', {
                method: 'POST',
                body: { billing: checkoutData, paymentMethod: 'stripe' },
            });

            if (checkout?.result !== 'success' || !checkout.redirect) {
                throw new Error('Failed to create order. Please check your details.');
            }

            // Step 2: Extract the client_secret
            const redirectUrl = new URL(checkout.redirect);
            const clientSecret = redirectUrl.searchParams.get('payment_intent_client_secret');

            if (!clientSecret) {
                throw new Error('Payment processing error: Could not retrieve payment secret.');
            }

            // Step 3: Confirm the payment
            const confirmationResult = await stripe.value.confirmPayment({
                elements,
                clientSecret,
                confirmParams: {
                    return_url: `${window.location.origin}/order-confirmation/${checkout.order?.orderKey}`,
                },
            });

            if (confirmationResult.error) {
                throw new Error(confirmationResult.error.message || 'Payment failed.');
            }

            return checkout.order?.orderKey;

        } catch (e: any) {
            error.value = e.message || 'An unknown error occurred.';
            console.error('Payment processing failed:', e);
            return null;
        } finally {
            isLoading.value = false;
        }
    };

    // Parallel dont depend on each other
    onMounted(async () => {
        await Promise.all([
            initializeStripe(),
            fetchPaymentGateways()
        ]);
    });

    return {
        stripe,
        paymentGateways,
        isLoading,
        error,
        processPayment,
    };
};