<template>
  <AppHeader />

  <main>
    <RouterView />
  </main>
</template>

<script lang="ts" setup>
import { RouterView } from 'vue-router';
import AppHeader from '@/components/global/AppHeader.vue';
</script>
