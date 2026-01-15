<script setup lang="ts">
const router = useRouter();

const form = reactive({ username: '', password: '' });
const loading = ref(false);

async function handleLogin() {
  if (loading.value) return;
  loading.value = true;

  try {
    await $fetch<any>('/api/auth/login', {
      method: 'POST',
      body: form
    });

    await refreshNuxtData('user-profile');

    push.success('Welkom terug!');
    await router.push('/account');
  } catch (error) {
    push.error('Inloggen mislukt. Controleer je gegevens.');
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
        title="Welcome back."
        description="Log in om je bestellingen te bekijken en je gegevens te beheren."
        image-src="https://images.unsplash.com/photo-1623126908029-58cb08a2b272?q=80&w=2070&auto=format&fit=crop"
    />

    <AuthForm
        title="Inloggen"
        subtitle="Vul je gegevens in om verder te gaan."
        footer-label="Nog geen account?"
        footer-link-text="Registreer hier"
        footer-link-to="/account/register"
    >
      <form @submit.prevent="handleLogin" class="space-y-5">
        <UFormGroup label="Gebruikersnaam of E-mail" :ui="{ label: { base: 'text-neutral-600 dark:text-neutral-400 font-bold mb-1.5 ml-1 text-xs uppercase tracking-wide' } }">
          <UInput v-model="form.username" type="text" required placeholder="Je gebruikersnaam" size="lg" :ui="inputUi" icon="i-heroicons-user" />
        </UFormGroup>

        <UFormGroup label="Wachtwoord" :ui="{ label: { base: 'text-neutral-600 dark:text-neutral-400 font-bold mb-1.5 ml-1 text-xs uppercase tracking-wide' } }">
          <UInput v-model="form.password" type="password" required placeholder="••••••••" icon="i-heroicons-lock-closed" size="lg" :ui="inputUi" />
          <template #help>
            <div class="flex justify-end mt-1">
              <NuxtLink to="/account/forgot-password" class="text-xs text-neutral-500 hover:text-black dark:hover:text-white transition-colors">
                Wachtwoord vergeten?
              </NuxtLink>
            </div>
          </template>
        </UFormGroup>

        <div class="pt-2">
          <button type="submit" :disabled="loading" class="w-full flex justify-center py-3.5 px-4 rounded-xl font-bold text-white bg-black hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-all disabled:opacity-50 shadow-lg hover:shadow-xl active:scale-[0.98]">
            <UIcon v-if="loading" name="i-svg-spinners-90-ring-with-bg" size="20" />
            <span v-else>Inloggen</span>
          </button>
        </div>
      </form>
    </AuthForm>
  </div>
</template>