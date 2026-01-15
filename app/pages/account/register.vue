<script setup lang="ts">
const router = useRouter();

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: ''
});
const loading = ref(false);

async function handleRegister() {
  if (loading.value) return;
  loading.value = true;

  try {
    const response = await $fetch<any>('/api/auth/register', {
      method: 'POST',
      body: form
    });

    push.success(`Welkom ${form.firstName}, je account is aangemaakt!`);


    const { data } = useNuxtData('user-profile');
    data.value = response.user;
    await router.push('/account');
  } catch (error: any) {
    const msg = error.data?.statusMessage || 'Registreren mislukt. Controleer je gegevens.';
    push.error(msg);
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
        title="Join the club."
        description="Maak een account aan voor exclusieve toegang tot nieuwe collecties, snellere checkout en order tracking."
        image-src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070&auto=format&fit=crop"
    />

    <AuthForm
        title="Account aanmaken"
        subtitle="Vul je gegevens in om te starten."
        footer-label="Heb je al een account?"
        footer-link-text="Log hier in"
        footer-link-to="/account/login"
    >
      <form @submit.prevent="handleRegister" class="space-y-5">
        <div class="grid grid-cols-2 gap-4">
          <UFormGroup label="Voornaam" :ui="{ label: { base: 'text-neutral-600 dark:text-neutral-400 font-bold mb-1.5 ml-1 text-xs uppercase tracking-wide' } }">
            <UInput v-model="form.firstName" required placeholder="Henk" size="lg" :ui="inputUi" />
          </UFormGroup>
          <UFormGroup label="Achternaam" :ui="{ label: { base: 'text-neutral-600 dark:text-neutral-400 font-bold mb-1.5 ml-1 text-xs uppercase tracking-wide' } }">
            <UInput v-model="form.lastName" required placeholder="de Vries" size="lg" :ui="inputUi" />
          </UFormGroup>
        </div>

        <UFormGroup label="E-mailadres" :ui="{ label: { base: 'text-neutral-600 dark:text-neutral-400 font-bold mb-1.5 ml-1 text-xs uppercase tracking-wide' } }">
          <UInput v-model="form.email" type="email" required placeholder="henk@voorbeeld.nl" icon="i-heroicons-envelope" size="lg" :ui="inputUi" />
        </UFormGroup>

        <UFormGroup label="Wachtwoord" :ui="{ label: { base: 'text-neutral-600 dark:text-neutral-400 font-bold mb-1.5 ml-1 text-xs uppercase tracking-wide' } }">
          <UInput v-model="form.password" type="password" required minlength="8" placeholder="••••••••" icon="i-heroicons-lock-closed" size="lg" :ui="inputUi" />
        </UFormGroup>

        <div class="pt-2">
          <button type="submit" :disabled="loading" class="w-full flex justify-center py-3.5 px-4 rounded-xl font-bold text-white bg-black hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-all disabled:opacity-50 shadow-lg hover:shadow-xl active:scale-[0.98]">
            <UIcon v-if="loading" name="i-svg-spinners-90-ring-with-bg" size="20" />
            <span v-else>Registreren & Direct Inloggen</span>
          </button>
        </div>
      </form>
    </AuthForm>
  </div>
</template>