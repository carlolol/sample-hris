<template>
  <component :is="pageLayout" />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed, defineAsyncComponent } from 'vue';

const EmptyLayout = defineAsyncComponent(() => import('@/layouts/EmptyLayout.vue'));
const DefaultLayout = defineAsyncComponent(() => import('@/layouts/DefaultLayout.vue'));

const route = useRoute();

// Read the layour data from the router and provide layout
const pageLayout = computed(() => {
  const { layout } = route.meta;

  switch (layout) {
    case 'empty': {
      return EmptyLayout;
    }
    default: {
      return DefaultLayout;
    }
  }
});
</script>

<style scoped>
</style>
