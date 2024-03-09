<template>
  <div class="search-input">
    <input type="text" :placeholder="placeholder" />
    <font-awesome-icon :icon="faMagnifyingGlass" class="append-icon"/>
  </div>
</template>

<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

defineProps({
  placeholder: {
    type: String,
    default: ''
  },
});
</script>

<style scoped>
.search-input {
  @apply relative;

  & > input {
    @apply bg-transparent border-[#DDDDDD] border-solid border-[1px] rounded-[4px] py-[0.375rem] px-4;
  }

  .append-icon {
    @apply absolute right-4 top-[0.625rem];
  }
}

</style>