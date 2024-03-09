<template>
  <div class="home-page">

    <header class="page-header">
      <div class="page-details">
        <h3 class="font-medium">Announcements</h3>
        <p>View, create, or edit announcements for all employees of your company.</p>
      </div>
      <div>
        <button class="text-white bg-[#17AD49] px-2 py-1 rounded-[4px]">
          <font-awesome-icon :icon="faPlus" />
          Post an Announcement
        </button>
      </div>
    </header>

    <div class="page-subheader">
      <div class="content-summary">
        <div class="flex gap-[0.625rem] items-center p-2 text-[#17AD49] bg-[#E6FFEE]">
          <div class="chip green">{{ data.length || 0 }}</div>
          <span>All</span>
        </div>
        <div class="flex gap-[0.625rem] items-center p-2">
          <div class="chip orange">{{ data.length || 0 }}</div>
          <span>Drafts</span>
        </div>
      </div>
      <div class="flex gap-1">
        <select name="filterBy" class="filter-by">
          <option>Filter by</option>
        </select>
        <SearchInput placeholder="Search..." />
      </div>
    </div>

    <DataTable :headers="headers" :data="data" :total-items="data.length || 0">
      <template #startDate="{ data }">
        <p>{{ data ? format(data, 'MM/dd/yyyy') : '' }}</p>
        <p class="time-text">{{ data ? format(data, 'h:mm a') : '' }}</p>
      </template>
      <template #endDate="{ data }">
        <p>{{ data ? format(data, 'MM/dd/yyyy') : '' }}</p>
        <p class="time-text">{{ data ? format(data, 'h:mm a') : '' }}</p>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import DataTable from '@/components/common/DataTable.vue';
import { useAnnouncementStore } from '@/stores/announcement';
import SearchInput from '@/components/common/SearchInput.vue';

const { getAnnouncements, setAnnouncements } = useAnnouncementStore();

const { announcements } = storeToRefs(useAnnouncementStore());

const headers = ref([
  { field: 'title', label: 'Title' },
  { field: 'message', label: 'Message' },
  { field: 'sentBy', label: 'Sent by' },
  { field: 'sentThrough', label: 'Sent Through' },
  { field: 'dateCreated', label: 'Date Created' },
  { field: 'startDate', label: 'Start Date' },
  { field: 'endDate', label: 'End Date' },
]);

const data = computed(() => announcements.value.map(a => {
  return {
    title: a.title,
    message: a.message,
    sentBy: `${a.firstName} ${a.lastName}`,
    sentThrough: 'All Platforms',
    dateCreated: format(a.createdAt, 'MM/dd/yyyy'),
    startDate: a.startAt,
    endDate: a.endAt,
  }
}));

onMounted(async () => {
  try {
    const res = await getAnnouncements();
    setAnnouncements(res);
  } catch (error) {
    console.error(error);
  }
})
</script>

<style scoped>
.home-page {
  @apply p-12;

  .page-header {
    @apply flex justify-between items-center pb-3;
  }

  .page-subheader {
    @apply flex justify-between items-center pt-3 pb-3;

    .content-summary {
      @apply flex;
    }
  }

  .chip {
    @apply px-2 rounded-full text-white text-sm py-0 align-middle h-4 leading-4;

    &.green {
      @apply bg-[#17AD49];
    }

    &.orange {
      @apply bg-[#FF7F00];
    }

    > span {
      @apply leading-[0.875rem];
    }
  }

  .filter-by {
    @apply border-[#B4C0BC] border-[1px] rounded-[4px] mx-2 w-[19rem] text-left px-3;
  }

  .time-text {
    @apply text-[#788E86] tracking-wider text-sm;
  }
}
</style>
