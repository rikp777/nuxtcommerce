<script setup lang="ts">
const router = useRouter();
const { t } = useI18n();
const localePath = useLocalePath(); // Toegevoegd voor gelokaliseerde routing

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

    push.success(t('auth.login.side_title'));
    // Gebruik localePath voor de redirect naar het account dashboard
    await router.push(localePath('/account'));
  } catch (error) {
    push.error(t('auth.login.subtitle'));
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
        :title="t('auth.login.side_title')"
        :description="t('auth.login.side_subtitle')"
        image-src="https://images.unsplash.com/photo-1595787572714-496673f87f71?q=80&w=2070&auto=format&fit=crop"
    />

    <AuthForm
        :title="t('auth.login.title')"
        :subtitle="t('auth.login.subtitle')"
        :footer-label="t('auth.login.register')"
        :footer-link-text="t('auth.login.register_link')"
        :footer-link-to="localePath('/account/register')"
    >
      <form @submit.prevent="handleLogin" class="space-y-5">
        <UFormGroup :label="t('auth.login.form.user')" :ui="{ label: { base: 'text-neutral-600 dark:text-neutral-400 font-bold mb-1.5 ml-1 text-xs uppercase tracking-wide' } }">
          <UInput
              v-model="form.username"
              type="text"
              required
              :placeholder="t('auth.login.form.user_placeholder')"
              size="lg"
              :ui="inputUi"
              icon="i-heroicons-user"
          />
        </UFormGroup>

        <UFormGroup :label="t('auth.login.form.password')" :ui="{ label: { base: 'text-neutral-600 dark:text-neutral-400 font-bold mb-1.5 ml-1 text-xs uppercase tracking-wide' } }">
          <UInput
              v-model="form.password"
              type="password"
              required
              :placeholder="t('auth.login.form.password_placeholder')"
              icon="i-heroicons-lock-closed"
              size="lg"
              :ui="inputUi"
          />
          <template #help>
            <div class="flex justify-end mt-1">
              <NuxtLink :to="localePath('/account/forgot-password')" class="text-xs text-neutral-500 hover:text-black dark:hover:text-white transition-colors">
                {{ t('auth.login.forgot_password') }}
              </NuxtLink>
            </div>
          </template>
        </UFormGroup>

        <div class="pt-2">
          <button type="submit" :disabled="loading" class="w-full flex justify-center py-3.5 px-4 rounded-xl font-bold text-white bg-black hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-all disabled:opacity-50 shadow-lg hover:shadow-xl active:scale-[0.98]">
            <UIcon v-if="loading" name="i-svg-spinners-90-ring-with-bg" size="20" />
            <span v-else>{{ t('auth.login.button') }}</span>
          </button>
        </div>
      </form>
    </AuthForm>
  </div>
</template>