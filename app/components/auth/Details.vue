<script setup lang="ts">
const props = defineProps<{
  user: any
}>();

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
  return props.user?.dateRegistered ? new Date(props.user.dateRegistered).getFullYear() : new Date().getFullYear();
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

    push.success('Profielgegevens succesvol bijgewerkt.');
    await refreshNuxtData('user-profile');

  } catch (e) {
    push.error('Opslaan mislukt. Controleer je invoer.');
  } finally {
    loadingProfile.value = false;
  }
}

async function changePassword() {
  if (loadingPassword.value) return;

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    push.error('Nieuwe wachtwoorden komen niet overeen.');
    return;
  }

  loadingPassword.value = true;

  try {
    await new Promise(r => setTimeout(r, 1000));

    push.success('Wachtwoord gewijzigd!');
    passwordForm.currentPassword = '';
    passwordForm.newPassword = '';
    passwordForm.confirmPassword = '';
  } catch (e) {
    push.error('Kon wachtwoord niet wijzigen.');
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
          <h2 class="text-2xl font-bold text-black dark:text-white">Publiek Profiel</h2>
          <p class="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
            Dit zijn de gegevens die we gebruiken voor communicatie en op je facturen.
          </p>
          <div class="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-neutral-800 text-xs font-bold text-neutral-600 dark:text-neutral-400">
            <UIcon name="i-iconamoon-certificate-badge" />
            Lid sinds {{ memberSince }}
          </div>
        </div>
      </div>

      <form @submit.prevent="saveProfile" class="max-w-2xl space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <UFormGroup label="Voornaam" :ui="{ label: { base: 'font-bold text-xs uppercase tracking-wide text-neutral-500 mb-1 ml-1' } }">
            <UInput v-model="profileForm.firstName" :ui="inputUi" size="lg" icon="i-heroicons-user" />
          </UFormGroup>
          <UFormGroup label="Achternaam" :ui="{ label: { base: 'font-bold text-xs uppercase tracking-wide text-neutral-500 mb-1 ml-1' } }">
            <UInput v-model="profileForm.lastName" :ui="inputUi" size="lg" />
          </UFormGroup>
        </div>

        <UFormGroup label="E-mailadres" :ui="{ label: { base: 'font-bold text-xs uppercase tracking-wide text-neutral-500 mb-1 ml-1' } }">
          <UInput v-model="profileForm.email" type="email" icon="i-heroicons-envelope" :ui="inputUi" size="lg" />
        </UFormGroup>

<!--        <div class="pt-2">-->
<!--          <label class="flex items-start gap-3 p-4 rounded-xl border border-gray-100 dark:border-neutral-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800 transition">-->
<!--            <UCheckbox v-model="profileForm.newsletter" color="black" />-->
<!--            <div class="text-sm">-->
<!--              <span class="font-bold block text-black dark:text-white">Meld me aan voor de nieuwsbrief</span>-->
<!--              <span class="text-neutral-500 block mt-0.5">Ontvang als eerste updates over nieuwe collecties en exclusieve aanbiedingen.</span>-->
<!--            </div>-->
<!--          </label>-->
<!--        </div>-->

        <div class="pt-2">
          <UButton type="submit" color="black" size="lg" :loading="loadingProfile">
            Wijzigingen opslaan
          </UButton>
        </div>
      </form>
    </div>

    <div class="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-[32px] p-8 shadow-sm">
      <div class="mb-6">
        <h2 class="text-xl font-bold text-black dark:text-white flex items-center gap-2">
          <UIcon name="i-iconamoon-lock" class="text-neutral-400" />
          Beveiliging
        </h2>
        <p class="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
          Wijzig je wachtwoord om je account veilig te houden.
        </p>
      </div>

      <form @submit.prevent="changePassword" class="max-w-2xl space-y-5">
        <UFormGroup label="Huidig wachtwoord" :ui="{ label: { base: 'font-bold text-xs uppercase tracking-wide text-neutral-500 mb-1 ml-1' } }">
          <UInput v-model="passwordForm.currentPassword" type="password" :ui="inputUi" size="lg" placeholder="••••••••" />
        </UFormGroup>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <UFormGroup label="Nieuw wachtwoord" :ui="{ label: { base: 'font-bold text-xs uppercase tracking-wide text-neutral-500 mb-1 ml-1' } }">
            <UInput v-model="passwordForm.newPassword" type="password" :ui="inputUi" size="lg" placeholder="••••••••" />
          </UFormGroup>
          <UFormGroup label="Bevestig nieuw wachtwoord" :ui="{ label: { base: 'font-bold text-xs uppercase tracking-wide text-neutral-500 mb-1 ml-1' } }">
            <UInput v-model="passwordForm.confirmPassword" type="password" :ui="inputUi" size="lg" placeholder="••••••••" />
          </UFormGroup>
        </div>

        <div class="pt-2">
          <UButton type="submit" variant="outline" color="black" size="lg" :loading="loadingPassword" :disabled="!passwordForm.currentPassword">
            Wachtwoord bijwerken
          </UButton>
        </div>
      </form>
    </div>

    <div class="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-[32px] p-8 shadow-sm">
      <h3 class="font-bold text-red-600 dark:text-red-400 mb-2">Account verwijderen</h3>
      <p class="text-sm text-red-600/70 dark:text-red-400/70 mb-6 max-w-xl">
        Als je je account verwijdert, worden al je gegevens gewist. Dit kan niet ongedaan worden gemaakt. Bestelhistorie blijft anoniem bewaard voor administratieve doeleinden.
      </p>
      <UButton color="red" variant="soft" label="Account verwijderen" />
    </div>

  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>