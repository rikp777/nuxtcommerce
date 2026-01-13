<script setup lang="ts">
const email = ref('');

const handleSubscribe = () => {
  // TODO: Implement newsletter logic
  email.value = '';
  alert('Thanks for subscribing!');
};
</script>

<template>
  <div class="lg:col-span-4">
    <h3 class="font-bold text-black dark:text-white mb-4">{{ $t('footer.newsletter_title') }}</h3>
    <p class="text-neutral-500 dark:text-neutral-400 mb-4 leading-relaxed">
      {{ $t('footer.newsletter_desc') }}
    </p>
    <form @submit.prevent="handleSubscribe" class="flex gap-2">
      <input
          v-model="email"
          type="email"
          :placeholder="$t('footer.email_placeholder')"
          required
          class="w-full bg-white dark:bg-black border border-gray-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
      >
      <button type="submit"
              class="bg-black text-white dark:bg-white dark:text-black px-4 py-2.5 rounded-xl font-bold hover:opacity-80 transition-opacity">
        <UIcon name="i-iconamoon-send-fill" size="20"/>
      </button>
    </form>
  </div>
</template>
