<script setup lang="ts">
const { t } = useI18n();

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
});

const isLoading = ref(false);
const isSent = ref(false);

const resetFormState = () => {
  form.name = '';
  form.email = '';
  form.subject = '';
  form.message = '';
};

const submitForm = () => {
  isLoading.value = true;
  // Simuleer API call
  setTimeout(() => {
    isLoading.value = false;
    isSent.value = true;
    resetFormState();
  }, 1500);
};
</script>

<template>
  <div class="bg-white dark:bg-black border border-gray-200 dark:border-neutral-800 rounded-[32px] p-8 lg:p-10 shadow-sm h-full flex flex-col justify-center">

    <div v-if="!isSent">
      <h3 class="text-2xl font-bold text-black dark:text-white mb-2">
        {{ $t('company.contact.form.title') || 'Send us a message' }}
      </h3>
      <p class="text-secondary-text dark:text-secondary-text-d mb-8 text-base">
        {{ $t('company.contact.form.subtitle') || 'We usually respond within 24 hours.' }}
      </p>

      <form @submit.prevent="submitForm" class="flex flex-col gap-6">

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-bold text-black dark:text-white pl-1">
              {{ $t('company.contact.form.inputs.name') }}
            </label>
            <div class="relative group">
              <UIcon name="i-iconamoon-profile-circle" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand transition-colors" size="20" />
              <input v-model="form.name" type="text" required :placeholder="$t('company.contact.form.inputs.name_placeholder')"
                     class="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-neutral-800 rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all text-black dark:text-white placeholder:text-gray-400" />
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-bold text-black dark:text-white pl-1">
              {{ $t('company.contact.form.inputs.email') }}
            </label>
            <div class="relative group">
              <UIcon name="i-iconamoon-email" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand transition-colors" size="20" />
              <input v-model="form.email" type="email" required :placeholder="$t('company.contact.form.inputs.email_placeholder')"
                     class="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-neutral-800 rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all text-black dark:text-white placeholder:text-gray-400" />
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-sm font-bold text-black dark:text-white pl-1">
            {{ $t('company.contact.form.inputs.subject') || 'Subject' }}
          </label>
          <div class="relative group">
            <UIcon name="i-iconamoon-bookmark" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand transition-colors" size="20" />
            <input v-model="form.subject" type="text" required :placeholder="$t('company.contact.form.inputs.subject_placeholder')"
                   class="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-neutral-800 rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all text-black dark:text-white placeholder:text-gray-400" />
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-sm font-bold text-black dark:text-white pl-1">Message</label>
          <div class="relative group">
            <textarea v-model="form.message" rows="5" required :placeholder="$t('company.contact.form.inputs.message_placeholder')"
                      class="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-neutral-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all resize-none text-black dark:text-white placeholder:text-gray-400"
            ></textarea>
          </div>
        </div>

        <div class="flex items-center gap-3 mt-2">
          <button
              type="button"
              @click="resetFormState"
              :disabled="isLoading"
              class="px-6 py-4 rounded-xl font-bold text-neutral-500 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors"
          >
            {{ $t('general.reset') || 'Reset' }}
          </button>

          <button
              type="submit"
              :disabled="isLoading"
              class="flex-1 bg-brand text-white font-bold py-4 rounded-xl hover:bg-brand-d transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-brand/20 group"
          >
            <span v-if="!isLoading">{{ $t('company.contact.form.send') }}</span>
            <UIcon v-if="!isLoading" name="i-iconamoon-send-fill" class="group-hover:translate-x-1 transition-transform"/>
            <UIcon v-else name="i-svg-spinners-90-ring-with-bg"/>
          </button>
        </div>

      </form>
    </div>

    <div v-else class="h-full flex flex-col items-center justify-center text-center py-10">
      <div class="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-6 animate-bounce">
        <UIcon name="i-iconamoon-check-circle-1-fill" size="48"/>
      </div>
      <h3 class="text-3xl font-bold text-black dark:text-white mb-3">Message Sent!</h3>
      <p class="text-secondary-text dark:text-secondary-text-d max-w-sm mx-auto text-lg leading-relaxed">
        Thanks for reaching out. We have received your message and will get back to you shortly.
      </p>

      <button @click="isSent = false" class="mt-10 flex items-center gap-2 text-brand font-bold hover:text-brand-d transition-colors group">
        <UIcon name="i-iconamoon-arrow-left-2" class="group-hover:-translate-x-1 transition-transform"/>
        Send another message
      </button>
    </div>

  </div>
</template>