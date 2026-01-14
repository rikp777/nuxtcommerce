<script setup>
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const props = defineProps({
  stores: {
    type: Array,
    required: true
  },
  selectedStoreId: {
    type: Number,
    default: null
  }
});

const emit = defineEmits(['reset']);

const map = ref(null);
const markers = ref({});
const hasMoved = ref(false);

let isProgrammaticMove = false;

const FIT_OPTIONS = {
  padding: [50, 50],
  maxZoom: 14
};

const getBounds = () => {
  if (!props.stores.length) return null;
  const bounds = L.latLngBounds();
  props.stores.forEach(store => {
    bounds.extend([store.lat, store.lng]);
  });
  return bounds;
};

const resetMap = () => {
  if (!map.value) return;

  const bounds = getBounds();
  if (bounds) {
    isProgrammaticMove = true;
    map.value.fitBounds(bounds, FIT_OPTIONS);
    map.value.closePopup();

    map.value.once('moveend', () => {
      hasMoved.value = false;
      isProgrammaticMove = false;
    });
  }

  emit('reset');
};

const onMapChange = () => {
  if (!isProgrammaticMove) {
    hasMoved.value = true;
  }
};

onMounted(() => {
  map.value = L.map('mapContainer', {
    minZoom: 7,
    maxZoom: 18,
    zoomControl: false,
    attributionControl: false
  });

  L.control.attribution({
    prefix: false
  }).addTo(map.value);

  L.control.zoom({ position: 'topright' }).addTo(map.value);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map.value);

  const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  L.Marker.prototype.options.icon = DefaultIcon;

  props.stores.forEach(store => {
    const latLng = [store.lat, store.lng];
    const marker = L.marker(latLng)
        .addTo(map.value)
        .bindPopup(`<b>${store.name}</b><br>${store.address}`);
    markers.value[store.id] = marker;
  });

  const bounds = getBounds();
  if (bounds) {
    isProgrammaticMove = true;
    map.value.fitBounds(bounds, FIT_OPTIONS);

    map.value.once('moveend', () => {
      isProgrammaticMove = false;
      hasMoved.value = false;
    });
  }

  map.value.on('moveend', onMapChange);
  map.value.on('zoomend', onMapChange);
});

watch(() => props.selectedStoreId, (newId) => {
  if (newId && markers.value[newId] && map.value) {
    map.value.flyTo([markers.value[newId].getLatLng().lat, markers.value[newId].getLatLng().lng], 16, { duration: 1.5 });
    markers.value[newId].openPopup();
  }
});
</script>

<template>
  <div class="relative h-full w-full">
    <div id="mapContainer" class="h-full w-full z-0"></div>

    <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-2"
    >
      <button
          v-if="hasMoved"
          @click="resetMap"
          class="absolute top-4 left-4 z-[500] bg-white dark:bg-black text-black dark:text-white px-4 py-2 rounded-xl shadow-lg border border-gray-200 dark:border-neutral-800 text-sm font-bold hover:bg-gray-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
      >
        <UIcon name="i-iconamoon-history" />
        {{ $t('stores.reset_map') || 'Reset View' }}
      </button>
    </Transition>
  </div>
</template>

<style>
.leaflet-container {
  background: #f8f9fa;
  font-family: inherit;
}

.leaflet-control-attribution {
  background: rgba(255, 255, 255, 0.8) !important;
  margin-right: 12px !important;
  margin-bottom: 5px !important;
  border-radius: 6px !important;
  padding: 2px 8px !important;
  font-size: 10px !important;
  color: #666 !important;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  backdrop-filter: blur(2px);
}
.dark .leaflet-control-attribution {
  background: rgba(0, 0, 0, 0.6) !important;
  color: #aaa !important;
}
.leaflet-control-attribution a {
  color: inherit !important;
  text-decoration: none !important;
}

.leaflet-control-zoom {
  border: none !important;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
  border-radius: 12px !important;
  overflow: hidden;
  margin-top: 16px !important;
  margin-right: 16px !important;
}

.leaflet-control-zoom a {
  background-color: white !important;
  color: black !important;
  width: 36px !important;
  height: 36px !important;
  line-height: 36px !important;
  font-size: 18px !important;
  font-weight: 400 !important;
  transition: background-color 0.2s ease;
  display: flex !important;
  align-items: center;
  justify-content: center;
}

.leaflet-control-zoom-in {
  border-bottom: 1px solid #f3f4f6 !important; /* gray-100 */
}

.leaflet-control-zoom a:hover {
  background-color: #f9fafb !important; /* gray-50 */
}

.leaflet-control-zoom a.leaflet-disabled {
  background-color: #fff !important;
  color: #d1d5db !important; /* gray-300 */
  cursor: not-allowed;
}

.dark .leaflet-control-zoom {
  border: 1px solid #262626 !important; /* neutral-800 */
}

.dark .leaflet-control-zoom a {
  background-color: black !important;
  color: white !important;
}

.dark .leaflet-control-zoom-in {
  border-bottom: 1px solid #262626 !important;
}

.dark .leaflet-control-zoom a:hover {
  background-color: #171717 !important; /* neutral-900 */
}

.dark .leaflet-control-zoom a.leaflet-disabled {
  background-color: black !important;
  color: #404040 !important;
}
</style>