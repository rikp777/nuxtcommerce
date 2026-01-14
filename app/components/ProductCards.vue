<!--app/components/ProductCard.vue-->
<script setup>
const localePath = useLocalePath();

defineProps({
  products: Object,
});
</script>

<template>
  <article v-for="product in products">
    <product-card :product="product" :show-price="true"/>
  </article>
</template>
