<script setup lang="ts">
const props = defineProps<{
  user: any
}>();

const { t } = useI18n();

const loadingProfile = ref(false);
const profileForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  newsletter: false
});

const loadingPassword = ref(false);
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

watch(() => props.user, (newUser) => {
  if (newUser) {
    profileForm.firstName = newUser.firstName || '';
    profileForm.lastName = newUser.lastName || '';
    profileForm.email = newUser.email || '';
    profileForm.newsletter = newUser.newsletter || false;
  }
}, { immediate: true });

const memberSince = computed(() => {
  const year = props.user?.dateRegistered ? new Date(props.user.dateRegistered).getFullYear() : new Date().getFullYear();
  return t('auth.details.member_since', { year });
});

async function saveProfile() {
  if (loadingProfile.value) return;
  loadingProfile.value = true;

  try {
    await $fetch('/api/auth/user', {
      method: 'PUT',
      body: {
        id: props.user.id,
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        email: profileForm.email,
        newsletter: Boolean(profileForm.newsletter)
      }
    });

    push.success(t('auth.details.notifications.profile_success'));
    await refreshNuxtData('user-profile');

  } catch (e) {
    push.error(t('auth.details.notifications.profile_error'));
  } finally {
    loadingProfile.value = false;
  }
}

async function changePassword() {
  if (loadingPassword.value) return;

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    push.error(t('auth.details.notifications.password_mismatch'));
    return;
  }

  loadingPassword.value = true;

  try {
    // Hier zou je API call komen
    await new Promise(r => setTimeout(r, 1000));

    push.success(t('auth.details.notifications.password_success'));
    passwordForm.currentPassword = '';
    passwordForm.newPassword = '';
    passwordForm.confirmPassword = '';
  } catch (e) {
    push.error(t('auth.details.notifications.password_error'));
  } finally {
    loadingPassword.value = false;
  }
}

const inputUi = {
  base: 'bg-gray-50 dark:bg-neutral-800 border-none rounded-xl text-black dark:text-white',
  placeholder: 'placeholder-gray-400 dark:placeholder-neutral-600',
};
</script>

<template>
  <div class="space-y-8 animate-fade-in">

    <div class="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-[32px] p-8 shadow-sm">
      <div class="flex flex-col sm:flex-row items-start gap-6 mb-8 border-b border-gray-100 dark:border-neutral-800 pb-8">
        <div class="w-20 h-20 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-2xl font-bold uppercase shrink-0">
          {{ profileForm.firstName[0] }}{{ profileForm.lastName[0] }}
        </div>

        <div class="flex-1">
          <h2 class="text-2xl font-bold text-black dark:text-white">{{ t('auth.details.profile_title') }}</h2>
          <p class="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
            {{ t('auth.details.profile_subtitle') }}
          </p>
          <div class="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-neutral-800 text-xs font-bold text-neutral-600 dark:text-neutral-400">
            <UIcon name="i-iconamoon-certificate-badge" />
            {{ memberSince }}
          </div>
        </div>
      </div>

      <form @submit.prevent="saveProfile" class="max-w-2xl space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <UFormGroup :label="t('auth.details.form.first_name')" :ui="{ label: { base: 'font-bold text-xs uppercase tracking-wide text-neutral-500 mb-1 ml-1' } }">
            <UInput v-model="profileForm.firstName" :ui="inputUi" size="lg" icon="i-heroicons-user" />
          </UFormGroup>
          <UFormGroup :label="t('auth.details.form.last_name')" :ui="{ label: { base: 'font-bold text-xs uppercase tracking-wide text-neutral-500 mb-1 ml-1' } }">
            <UInput v-model="profileForm.lastName" :ui="inputUi" size="lg" />
          </UFormGroup>
        </div>

        <UFormGroup :label="t('auth.details.form.email')" :ui="{ label: { base: 'font-bold text-xs uppercase tracking-wide text-neutral-500 mb-1 ml-1' } }">
          <UInput v-model="profileForm.email" type="email" icon="i-heroicons-envelope" :ui="inputUi" size="lg" />
        </UFormGroup>

        <div class="pt-2">
          <UButton type="submit" color="black" size="lg" :loading="loadingProfile">
            {{ t('auth.details.form.save_button') }}
          </UButton>
        </div>
      </form>
    </div>

    <div class="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-[32px] p-8 shadow-sm">
      <div class="mb-6">
        <h2 class="text-xl font-bold text-black dark:text-white flex items-center gap-2">
          <UIcon name="i-iconamoon-lock" class="text-neutral-400" />
          {{ t('auth.details.security_title') }}
        </h2>
        <p class="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
          {{ t('auth.details.security_subtitle') }}
        </p>
      </div>

      <form @submit.prevent="changePassword" class="max-w-2xl space-y-5">
        <UFormGroup :label="t('auth.details.form.current_password')" :ui="{ label: { base: 'font-bold text-xs uppercase tracking-wide text-neutral-500 mb-1 ml-1' } }">
          <UInput v-model="passwordForm.currentPassword" type="password" :ui="inputUi" size="lg" placeholder="••••••••" />
        </UFormGroup>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <UFormGroup :label="t('auth.details.form.new_password')" :ui="{ label: { base: 'font-bold text-xs uppercase tracking-wide text-neutral-500 mb-1 ml-1' } }">
            <UInput v-model="passwordForm.newPassword" type="password" :ui="inputUi" size="lg" placeholder="••••••••" />
          </UFormGroup>
          <UFormGroup :label="t('auth.details.form.confirm_password')" :ui="{ label: { base: 'font-bold text-xs uppercase tracking-wide text-neutral-500 mb-1 ml-1' } }">
            <UInput v-model="passwordForm.confirmPassword" type="password" :ui="inputUi" size="lg" placeholder="••••••••" />
          </UFormGroup>
        </div>

        <div class="pt-2">
          <UButton type="submit" variant="outline" color="black" size="lg" :loading="loadingPassword" :disabled="!passwordForm.currentPassword">
            {{ t('auth.details.form.password_button') }}
          </UButton>
        </div>
      </form>
    </div>

    <div class="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-[32px] p-8 shadow-sm">
      <h3 class="font-bold text-red-600 dark:text-red-400 mb-2">{{ t('auth.details.delete_account') }}</h3>
      <p class="text-sm text-red-600/70 dark:text-red-400/70 mb-6 max-w-xl">
        {{ t('auth.details.delete_warning') }}
      </p>
      <UButton color="red" variant="soft" :label="t('auth.details.delete_account')" />
    </div>

  </div>
</template>