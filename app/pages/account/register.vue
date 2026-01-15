<script setup lang="ts">
const router = useRouter();
const { t } = useI18n();
const localePath = useLocalePath();

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

    push.success(t('auth.register.side_title'));

    const { data } = useNuxtData('user-profile');
    data.value = response.user;

    // Gebruik localePath voor de redirect na registratie
    await router.push(localePath('/account'));
  } catch (error: any) {
    const msg = error.data?.statusMessage || t('auth.register.subtitle');
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
        :title="t('auth.register.side_title')"
        :description="t('auth.register.side_subtitle')"
        image-src="https://images.unsplash.com/photo-1595787572714-496673f87f71?q=80&w=2070&auto=format&fit=crop"
    />

    <AuthForm
        :title="t('auth.register.title')"
        :subtitle="t('auth.register.subtitle')"
        :footer-label="t('auth.register.login')"
        :footer-link-text="t('auth.register.login_link')"
        :footer-link-to="localePath('/account/login')"
    >
      <form @submit.prevent="handleRegister" class="space-y-5">
        <div class="grid grid-cols-2 gap-4">
          <UFormGroup :label="t('auth.register.form.first_name')" :ui="{ label: { base: 'text-neutral-600 dark:text-neutral-400 font-bold mb-1.5 ml-1 text-xs uppercase tracking-wide' } }">
            <UInput v-model="form.firstName" required :placeholder="t('auth.register.form.first_name_placeholder')" size="lg" :ui="inputUi" />
          </UFormGroup>
          <UFormGroup :label="t('auth.register.form.last_name')" :ui="{ label: { base: 'text-neutral-600 dark:text-neutral-400 font-bold mb-1.5 ml-1 text-xs uppercase tracking-wide' } }">
            <UInput v-model="form.lastName" required :placeholder="t('auth.register.form.last_name_placeholder')" size="lg" :ui="inputUi" />
          </UFormGroup>
        </div>

        <UFormGroup :label="t('auth.register.form.email')" :ui="{ label: { base: 'text-neutral-600 dark:text-neutral-400 font-bold mb-1.5 ml-1 text-xs uppercase tracking-wide' } }">
          <UInput v-model="form.email" type="email" required :placeholder="t('auth.register.form.email_placeholder')" icon="i-heroicons-envelope" size="lg" :ui="inputUi" />
        </UFormGroup>

        <UFormGroup :label="t('auth.register.form.password')" :ui="{ label: { base: 'text-neutral-600 dark:text-neutral-400 font-bold mb-1.5 ml-1 text-xs uppercase tracking-wide' } }">
          <UInput v-model="form.password" type="password" required minlength="8" placeholder="••••••••" icon="i-heroicons-lock-closed" size="lg" :ui="inputUi" />
        </UFormGroup>

        <div class="pt-2">
          <button type="submit" :disabled="loading" class="w-full flex justify-center py-3.5 px-4 rounded-xl font-bold text-white bg-black hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-all disabled:opacity-50 shadow-lg hover:shadow-xl active:scale-[0.98]">
            <UIcon v-if="loading" name="i-svg-spinners-90-ring-with-bg" size="20" />
            <span v-else>{{ t('auth.register.button') }}</span>
          </button>
        </div>
      </form>
    </AuthForm>
  </div>
</template>