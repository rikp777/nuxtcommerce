<script setup lang="ts">
const { initialize, gtag } = useGtag()
const localePath = useLocalePath()
const config = useRuntimeConfig()
const isOpen = ref(false)

const hasValidAnalytics = () => {
  const id = config.public.gtag?.id
  return id && id !== 'G-XXXXXXXXXX'
}

onMounted(() => {
  if (!hasValidAnalytics()) return

  const consent = localStorage.getItem('cookie-consent')

  if (!consent) {
    isOpen.value = true
  } else if (consent === 'accepted') {
    initialize()
  }
})

function accept() {
  localStorage.setItem('cookie-consent', 'accepted')
  initialize()

  gtag('consent', 'update', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'granted',
    ad_personalization: 'denied'
  })

  isOpen.value = false
}

function decline() {
  localStorage.setItem('cookie-consent', 'declined')
  isOpen.value = false
}
</script>

<template>
  <div v-if="isOpen" class="fixed bottom-0 left-0 right-0 z-[50] p-4 flex justify-center pointer-events-none">

    <div
        class="
        w-full max-w-4xl
        pointer-events-auto animate-fade-up
        bg-white/90 dark:bg-gray-900/90 backdrop-blur-md
        border border-gray-300 dark:border-gray-800
        rounded-[32px] shadow-2xl
        p-5 sm:p-6
      "
    >
      <div class="flex flex-col md:flex-row md:items-center gap-5 justify-between">

        <div class="flex gap-4 items-start sm:items-center">

          <div class="flex p-3 bg-primary-50 dark:bg-primary-950/50 rounded-2xl shrink-0">
            <UIcon name="i-heroicons-finger-print" class="w-6 h-6 text-primary-500" />
          </div>

          <div>
            <h4 class="font-bold text-gray-900 dark:text-white text-sm">
              {{ $t('cookie.preferences') }}
            </h4>
            <div class="text-sm text-gray-500 dark:text-gray-400 leading-snug mt-1 max-w-2xl">
              <span>{{ $t('cookie.description') }}</span>
              <NuxtLink
                  :to="localePath('/legal')"
                  class="ml-1 underline decoration-gray-300 underline-offset-4 hover:text-primary-500 hover:decoration-primary-500 transition-colors cursor-pointer"
              >{{ $t('legal.title') }}</NuxtLink>
            </div>
          </div>
        </div>

        <div class="flex gap-3 shrink-0 w-full md:w-auto">

          <button
              @click="decline"
              class="
                flex-1 md:flex-none px-4 py-2 text-sm font-medium rounded-xl transition-colors
                text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400
              "
          >
            {{ $t('cookie.decline') }}
          </button>

          <button
              @click="accept"
              class="
                flex-1 md:flex-none px-6 py-2 text-sm font-bold rounded-xl shadow-lg transition-all duration-300

                bg-green-600 text-white

                md:bg-gray-900 md:text-white
                md:dark:bg-white md:dark:text-black

                md:hover:bg-green-600 md:hover:text-white md:hover:shadow-green-500/30
                md:dark:hover:bg-green-500 md:dark:hover:text-white
              "
          >
            {{ $t('cookie.accept') }}
          </button>
        </div>

      </div>
    </div>
  </div>
</template>