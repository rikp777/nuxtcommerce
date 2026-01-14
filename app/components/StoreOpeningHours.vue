<script setup lang="ts">
interface DaySchedule {
  day: string;
  hours: string;
}

const props = defineProps<{
  schedule: DaySchedule[]
  defaultOpen?: boolean
}>();

const { t } = useI18n();
const isExpanded = ref(props.defaultOpen ?? false);

const timeToMinutes = (timeStr: string) => {
  if (!timeStr || timeStr.toLowerCase() === 'closed') return -1;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

const isOpenNow = computed(() => {
  const now = new Date();
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const todaySchedule = props.schedule.find(day => day.day === currentDay);

  if (!todaySchedule || todaySchedule.hours.toLowerCase().includes('closed')) {
    return false;
  }

  const [openStr, closeStr] = todaySchedule.hours.split(' - ');
  if (!openStr || !closeStr) return false;

  const openTime = timeToMinutes(openStr);
  const closeTime = timeToMinutes(closeStr);

  return currentMinutes >= openTime && currentMinutes < closeTime;
});

const currentDayName = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
</script>

<template>
  <div>
    <button
        @click.stop="isExpanded = !isExpanded"
        class="flex items-center gap-2 text-sm w-full group"
    >
      <span
          class="text-xs font-bold px-2 py-0.5 rounded-md uppercase transition-colors"
          :class="isOpenNow
          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'"
      >
        {{ isOpenNow ? $t('stores.open') : $t('stores.closed') }}
      </span>

      <span class="text-neutral-500 group-hover:text-black dark:group-hover:text-white transition-colors">
        {{ $t('stores.opening_hours') }}
      </span>

      <UIcon
          name="i-iconamoon-arrow-down-2"
          class="text-neutral-400 transition-transform duration-300"
          :class="{ 'rotate-180': isExpanded }"
      />
    </button>

    <div
        class="grid transition-all duration-300 ease-in-out overflow-hidden"
        :class="isExpanded ? 'grid-rows-[1fr] mt-3 opacity-100' : 'grid-rows-[0fr] mt-0 opacity-0'"
    >
      <div class="min-h-0 text-sm text-neutral-600 dark:text-neutral-400 space-y-1 pl-1">
        <div v-for="(daySchedule, i) in schedule" :key="i" class="flex justify-between w-full max-w-[200px]">
          <span
              class="capitalize w-24"
              :class="{'font-bold text-black dark:text-white': daySchedule.day === currentDayName}"
          >
            {{ $t(`days.${daySchedule.day}`) }}
          </span>
          <span class="font-medium text-black dark:text-white">
            {{ daySchedule.hours }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>