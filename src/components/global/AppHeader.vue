<template>
  <header class="app-header">
    <RouterLink :to="{ name: 'home' }">
      <img src="@/assets/logo.svg" class="h-9 pl-[0.625rem]" />
    </RouterLink>
    <nav class="navigations">
      <DropdownMenu
        v-for="(menu, i) in menuItems"
        :key="i"
        :label="menu.label"
        :items="menu.items"
        @item-click="handleMenuItemClick"
      />
      <SearchInput placeholder="Search Employees" />
      
      <div class="profile-picture"></div>
      <DropdownMenu
        label="Admin"
        :items="[{ text: 'Account' }, { text: 'Logout' }]"
      />
    </nav>
  </header>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import SearchInput from '../common/SearchInput.vue';
import DropdownMenu from '../common/DropdownMenu.vue';
import router from '@/router';

const menuItems = ref([
  {
    label: 'My Requests',
    items: [{ text: 'Requests' }],
  },
  {
    label: 'My Team',
    items: [{ text: 'Team' }],
  },
  {
    label: 'Company',
    items: [{ text: 'Company items' }],
  },
  {
    label: 'Administration Tools',
    items: [{ text: 'Attendance Management', actionName: 'gotoAttendance' }],
  },
  {
    label: 'Maintenance',
    items: [{ text: 'Clear data' }],
  },
]);

const handleMenuItemClick = (event: string ) => {
  if (event === 'gotoAttendance') {
    router.push({ name: 'attendance' })
  }
}
</script>

<style scoped>
.app-header {
  @apply bg-[#333333] h-app-header-height flex items-center px-5 justify-between;

  .navigations {
    @apply text-[#DDDDDD] flex gap-4 items-center;

    .profile-picture {
      @apply rounded-full bg-[#C4C4C4] h-[1.875rem] w-[1.875rem];
    }
  }
}
</style>
