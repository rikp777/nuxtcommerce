<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();

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
    push.error(t('auth.forgot_password.error'));
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
        :title="t('auth.forgot_password.side_title')"
        :description="t('auth.forgot_password.side_subtitle')"
        image-src="https://images.unsplash.com/photo-1595787572714-496673f87f71?q=80&w=2070&auto=format&fit=crop"
    />

    <AuthForm
        :title="t('auth.forgot_password.title')"
        :subtitle="t('auth.forgot_password.subtitle')"
        :footer-label="t('auth.forgot_password.footer_label')"
        :footer-link-text="t('auth.forgot_password.footer_link')"
        :footer-link-to="localePath('/account/login')"
    >
      <div v-if="emailSent" class="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl text-center border border-green-100 dark:border-green-900">
        <UIcon name="i-iconamoon-check-circle-1-fill" class="text-green-500 mb-3" size="48" />
        <h3 class="font-bold text-lg mb-2 text-black dark:text-white">
          {{ t('auth.forgot_password.success.title') }}
        </h3>
        <p class="text-neutral-600 dark:text-neutral-400 text-sm mb-6">
          {{ t('auth.forgot_password.success.description', { email: email }) }}
        </p>
        <UButton :to="localePath('/account/login')" block color="gray" variant="solid">
          {{ t('auth.forgot_password.success.button') }}
        </UButton>
      </div>

      <form v-else @submit.prevent="handleReset" class="space-y-5">
        <UFormGroup :label="t('auth.forgot_password.form.email')" :ui="{ label: { base: 'text-neutral-600 dark:text-neutral-400 font-bold mb-1.5 ml-1 text-xs uppercase tracking-wide' } }">
          <UInput v-model="email" type="email" required :placeholder="t('auth.forgot_password.form.email_placeholder')" icon="i-heroicons-envelope" size="lg" :ui="inputUi" />
        </UFormGroup>

        <div class="pt-2">
          <button type="submit" :disabled="loading" class="w-full flex justify-center py-3.5 px-4 rounded-xl font-bold text-white bg-black hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-all disabled:opacity-50 shadow-lg hover:shadow-xl active:scale-[0.98]">
            <UIcon v-if="loading" name="i-svg-spinners-90-ring-with-bg" size="20" />
            <span v-else>{{ t('auth.forgot_password.button') }}</span>
          </button>
        </div>
      </form>
    </AuthForm>

  </div>
</template>