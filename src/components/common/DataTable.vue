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
        <tr v-for="(r, key) in dataSubset" :key="key">
          <td v-for="h in headers" :key="h.field" class="truncate-text">
            <slot :name="h.field" :data="r[h.field]">
              <span :title="r[h.field]">{{ r[h.field] }}</span>
            </slot>
          </td>
        </tr>
      </tbody>
    </table>

    <footer class="table-paginator">
      <div class="items-per-page__container">
        <span>Items per page</span>
        <select name="itemsPerPage" v-model="currentPerPage" @change="currentPage = 1">
          <option v-for="p in rowsPerPage" :key="p" :value="p">{{ p }}</option>
        </select>
      </div>
      <div class="paginator__container">
        <font-awesome-icon :icon="faBackward" class="cursor-pointer" @click="handlePagination('first')" />
        <font-awesome-icon :icon="faCaretLeft" class="cursor-pointer" @click="handlePagination('prev')" />
        <div class="page__container">
          <span>Page</span>
          <input
            ref="pageInputRef"
            inputmode="numeric"
            :value="currentPage"
            @blur="onInputValueChange"
            @keyup.enter="onInputValueChange"
            @input="onInputValueChange"
          >
          <span>{{ `of ${totalPages}` }}</span>
        </div>
        <font-awesome-icon :icon="faCaretRight" class="cursor-pointer" @click="handlePagination('next')" />
        <font-awesome-icon :icon="faForward" class="cursor-pointer" @click="handlePagination('last')" />
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
  serverSidedMode: {
    type: Boolean,
    default: false,
  },
});

const currentPage = ref<number>(1);
const currentPerPage = ref<number>(props.rowsPerPage[0] || 10);
const pageInputRef = ref<HTMLInputElement>();

const dataSubset = computed(() => {
  return props.data.slice(currentItemsCountMin.value - 1, currentItemsCount.value);
});
const totalPages = computed(() => Math.ceil(props.totalItems / currentPerPage.value) || 1)
const currentItemsCount = computed(() => {
  const count = currentPage.value * currentPerPage.value;

  return count > props.totalItems ? props.totalItems : count;
});
const currentItemsCountMin = computed(() => {
  return ((currentPage.value - 1) * currentPerPage.value) + 1;
});

const handlePagination = (action: 'first' | 'last' | 'prev' | 'next') => {
  switch (action) {
    case 'first': {
      currentPage.value = 1;
      break;
    }
    case 'last': {
      currentPage.value = totalPages.value;
      break;
    }
    case 'prev': {
      !(currentPage.value <= 1) && currentPage.value--;
      break;
    }
    case 'next': {
      !(currentPage.value >= totalPages.value) && currentPage.value++;
      break;
    }
  }
};
const onInputValueChange = ($event: any) => {
  console.warn($event)
  console.warn($event.target.value)

  if ($event instanceof InputEvent) {
    console.warn('input')
    pageInputRef.value!.value = pageInputRef!.value!.value.replace(/\D+/g, '');
    
    if (+pageInputRef.value!.value <= 0) {
      pageInputRef.value!.value = '1';
    } else if (+pageInputRef.value!.value > totalPages.value) {
      pageInputRef.value!.value = '' + totalPages.value;
    }
  } else {
    currentPage.value = $event.target.value;
  }
}
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

    .items-per-page__container,
    .total-items__container,
    .paginator__container {
      @apply basis-1/3;
    }

    select {
      @apply w-12 text-center border-[#A5B3AF] border-[1px] rounded-[4px] mx-2;
    }

    .paginator__container {
      @apply flex gap-2 items-center justify-center;

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

    .total-items__container {
      @apply text-right;
    }
  }
}
</style>
