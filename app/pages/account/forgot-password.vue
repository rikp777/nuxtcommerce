<script setup lang="ts">
const email = ref('');
const loading = ref(false);
const emailSent = ref(false);

async function handleReset() {
  if (loading.value) return;
  loading.value = true;

  try {
    await $fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: { email: email.value }
    });

    emailSent.value = true;
  } catch (error) {
    push.error('Er ging iets mis. Controleer je e-mailadres.');
  } finally {
    loading.value = false;
  }
}

const inputUi = {
  base: 'bg-gray-50 dark:bg-neutral-900 border-none rounded-xl text-black dark:text-white',
  placeholder: 'placeholder-gray-400 dark:placeholder-neutral-600',
  color: {
    white: {
      outline: 'shadow-none ring-0 focus:ring-2 focus:ring-black dark:focus:ring-white transition-all'
    }
  }
};
</script>

<template>
  <div class="flex flex-col lg:flex-row m-4 bg-white/80 dark:bg-black/60 overflow-hidden relative z-10 min-h-[calc(100vh-180px)] shadow-sm">

    <AuthVisual
        title="Don't worry."
        description="Het gebeurt de besten. Vul je e-mailadres in en we sturen je een link om weer toegang te krijgen."
        image-src="https://images.unsplash.com/photo-1516937941344-00b4e0337589?q=80&w=2070&auto=format&fit=crop"
    />

    <AuthForm
        title="Wachtwoord vergeten?"
        subtitle="Vul je e-mailadres in om een reset-link te ontvangen."
        footer-label="Toch weer herinnerd?"
        footer-link-text="Log in"
        footer-link-to="/account/login"
    >
      <div v-if="emailSent" class="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl text-center border border-green-100 dark:border-green-900">
        <UIcon name="i-iconamoon-check-circle-1-fill" class="text-green-500 mb-3" size="48" />
        <h3 class="font-bold text-lg mb-2 text-black dark:text-white">Check je mail!</h3>
        <p class="text-neutral-600 dark:text-neutral-400 text-sm mb-6">
          Als er een account bestaat voor <strong>{{ email }}</strong>, hebben we een link gestuurd om je wachtwoord te herstellen.
        </p>
        <UButton to="/account/login" block color="gray" variant="solid">Terug naar inloggen</UButton>
      </div>

      <form v-else @submit.prevent="handleReset" class="space-y-5">
        <UFormGroup label="E-mailadres" :ui="{ label: { base: 'text-neutral-600 dark:text-neutral-400 font-bold mb-1.5 ml-1 text-xs uppercase tracking-wide' } }">
          <UInput v-model="email" type="email" required placeholder="henk@voorbeeld.nl" icon="i-heroicons-envelope" size="lg" :ui="inputUi" />
        </UFormGroup>

        <div class="pt-2">
          <button type="submit" :disabled="loading" class="w-full flex justify-center py-3.5 px-4 rounded-xl font-bold text-white bg-black hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-all disabled:opacity-50 shadow-lg hover:shadow-xl active:scale-[0.98]">
            <UIcon v-if="loading" name="i-svg-spinners-90-ring-with-bg" size="20" />
            <span v-else>Stuur reset link</span>
          </button>
        </div>
      </form>
    </AuthForm>

  </div>
</template>