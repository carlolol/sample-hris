<template>
  <div class="data-table">
    <div v-if="!data.length" class="empty-container">
      <img src="@/assets/empty-table-icon.svg" class="h-36 w-36" />
      <h5>No attendance logs to show</h5>
      <p>Get started by searching for the logs</p>
    </div>

    <table v-else class="table-content">
      <thead class="h-12">
        <tr>
          <th v-for="(h, i) in headers" :key="i" class="text-left">{{ h.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(r, key) in data" :key="key">
          <td v-for="h in headers" :key="h.field" class="truncate-text" :title="r[h.field]">
            <slot :name="h.field" :data="r[h.field]">
              {{ r[h.field] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>

    <footer class="table-paginator">
      <div class="items-per-page__container">
        <span>Items per page</span>
        <select name="itemsPerPage" v-model="currentPerPage">
          <option v-for="p in rowsPerPage" :key="p" :value="p">{{ p }}</option>
        </select>
      </div>
      <div class="paginator__container">
        <font-awesome-icon :icon="faBackward" />
        <font-awesome-icon :icon="faCaretLeft" />
        <div class="page__container">
          <span>Page</span>
          <input v-model="currentPage" >
          <span>{{ `of ${totalPages}` }}</span>
        </div>
        <font-awesome-icon :icon="faForward" />
        <font-awesome-icon :icon="faCaretRight" />
      </div>
      <div class="total-items__container">
        {{ `Showing ${currentItemsCountMin > 0 ? currentItemsCountMin + ' - ' : ''}${currentItemsCount} of ${totalItems}` }}
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, type PropType } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCaretLeft, faCaretRight, faBackward, faForward } from '@fortawesome/free-solid-svg-icons';

const props = defineProps({
  headers: {
    type: Array as PropType<Array<{ field: string, label: string }>>,
    default: () => ([])
  },
  data: {
    type: Array as PropType<Array<any>>,
    default: () => ([])
  },
  totalItems: {
    type: Number,
    default: 0,
  },
  rowsPerPage: {
    type: Array as PropType<Array<number>>,
    default: () => ([10, 25, 50]),
  },
});

const currentPage = ref<number>(1);
const currentPerPage = ref<number>(props.rowsPerPage[0] || 10);

const totalPages = computed(() => (props.totalItems / currentPerPage.value) || 1)
const currentItemsCount = computed(() => {
  const count = currentPage.value * currentPerPage.value;

  return count > props.totalItems ? props.totalItems : count;
});
const currentItemsCountMin = computed(() => {
  const min = currentItemsCount.value - currentPerPage.value + 1;
  return min > 0 ? min : 0;
});
</script>

<style scoped>
.data-table {
  @apply border-[1px] border-[#C3CDC9] w-full rounded-[4px];

  .empty-container {
    @apply flex flex-col justify-center items-center w-full min-h-[50vh] py-10;
  }

  .table-content {
    @apply w-full table-fixed;

    tbody > tr {
      @apply border-t border-t-[#C3CDC9] text-sm;
    }

    th,
    td {
      @apply py-3 px-4;
    }

    th {
      @apply !uppercase text-[#00291B] font-medium text-xs;
    }
  }

  .table-paginator {
    @apply flex justify-between px-4 text-sm h-16 items-center border-t border-t-[#C3CDC9] text-[#3C5B51];

    select {
      @apply w-12 text-center border-[#A5B3AF] border-[1px] rounded-[4px] mx-2;
    }

    .paginator__container {
      @apply flex gap-2 items-center;

      input {
        @apply w-14 text-center border-[#A5B3AF] border-[1px] rounded-[4px] mx-2;
      }

      > svg {
        @apply text-[#17AD49];
      }

      .page__container > span {
        @apply text-sm;
      }
    }
  }
}
</style>
