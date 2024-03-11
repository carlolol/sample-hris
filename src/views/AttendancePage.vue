<template>
  <div class="attendance-page">
    <aside class="sidebar-filters__container">
      <div class="page-summary-section">
        <h3 class="pb-2">Manage Attendance</h3>
        <p class="mb-7">Attendance management is where you can generate, add, edit, and export the logs of the employees.</p>
        <button class="accent-btn">
          <font-awesome-icon :icon="faCalendarDay" />
          Attendance Logs
        </button>
        <button class="flat-btn">
          <font-awesome-icon :icon="faDownload" />
          Exported Files
        </button>
      </div>
      <div class="filters-section">
        <p class="uppercase font-medium text-[#3C5B51] mb-3">Date Range</p>
        <div class="datepicker__wrapper mb-5"> 
          <span class="label">Date From</span>
          <VueDatePicker v-model="fromDate" :enable-time-picker="false" :clearable="false" :format="displayFormat">
            <template #input-icon>
              <font-awesome-icon :icon="faCalendar" class="calendar-icon" />
            </template>
          </VueDatePicker>
        </div>
        <div class="datepicker__wrapper mb-5">
          <span class="label">Date From</span>
          <VueDatePicker v-model="toDate" :enable-time-picker="false" :clearable="false" :format="displayFormat">
            <template #input-icon>
              <font-awesome-icon :icon="faCalendar" class="calendar-icon" />
            </template>
          </VueDatePicker>
        </div>
        <div class="flex justify-between mb-5">
          <span class="uppercase font-medium text-[#3C5B51] text-sm">Filters</span>
          <span class="font-medium text-[#0F6EEB] text-sm cursor-pointer" @click="showAllFilters = !showAllFilters">
            {{ showAllFilters ? 'Hide' : 'Show' }} All
          </span>
        </div>
        <div v-show="!showAllFilters" class="hidden-filters">
          <p class="flex gap-2">
            <font-awesome-icon :icon="faBuilding" class="basis-1/12" />
            {{ selectedCompany }}
          </p>
          <p class="flex gap-2">
            <font-awesome-icon :icon="faUsers" class="basis-1/12" />
            {{ selectedDepartment }}
          </p>
          <p class="flex gap-2">
            <font-awesome-icon :icon="faLocationDot" class="basis-1/12" />
            {{ selectedLocation }}
          </p>
          <p class="flex gap-2">
            <font-awesome-icon :icon="faUser" class="basis-1/12" />
            {{ selectedEmployees }}
          </p>
        </div>
        <div v-show="showAllFilters" class="show-filters">
          <div class="select__wrapper">
            <span class="label">Company</span>
            <select v-model="selectedCompany" name="companyFilter" class="dropdown">
              <option v-for="(item, i) in companyFilterItems" :key="i" :value="item">{{ item }}</option>
            </select>
          </div>
          <div class="select__wrapper">
            <span class="label">Department</span>
            <select v-model="selectedDepartment" name="departmentFilter" class="dropdown">
              <option v-for="(item, i) in departmentFilterItems" :key="i" :value="item">{{ item }}</option>
            </select>
          </div>
          <div class="select__wrapper">
            <span class="label">Location</span>
            <select v-model="selectedLocation" name="locationFilter" class="dropdown">
              <option v-for="(item, i) in locationFilterItems" :key="i" :value="item">{{ item }}</option>
            </select>
          </div>
          <div class="select__wrapper">
            <span class="label">Employees</span>
            <select v-model="selectedEmployees" name="employeesFilter" class="dropdown">
              <option v-for="(item, i) in employeesFilterItems" :key="i" :value="item">{{ item }}</option>
            </select>
          </div>
        </div>
      </div>
      <div class="actions-section">
        <button class="primary-btn mb-2">
          <font-awesome-icon :icon="faMagnifyingGlass" />
          Search
        </button>
        <button class="secondary-btn">
          <font-awesome-icon :icon="faDownload" />
          Export
        </button>
      </div>
    </aside>
    <section class="content__container">
      <div class="content__wrapper">
        <header class="flex justify-between">
          <h6 class="text-base flex gap-2 items-center">
            <font-awesome-icon :icon="faCalendarDay" class="text-[#17AD49]" />
            {{ `${format(fromDate, 'MMM dd, yyyy')} - ${format(toDate, 'MMM dd, yyyy')}` }}
          </h6>
        </header>
        <DataTable :headers="headers" :data="data" :total-items="data.length || 0">
          <template #nameAndId="{ data }">
            <p class="truncate-text" :title="data.name">{{ data.name }}</p>
            <p class="text-[#788E86] text-sm truncate-text" :title="data.id">{{ data.id }}</p>
          </template>
          <template #type="{ data }">
            <p class="font-medium" :class="data === 'IN' ? 'text-[#0F6EEB]' : 'text-[#FF7F00]'">{{ data }}</p>
          </template>
          <template #logDetails="{ data }">
            <p class="font-medium text-[#3C5B51] px-1 rounded-sm bg-[#C3CDC9] w-fit">{{ data }}</p>
          </template>
          <template #locationAndNotes="{ data }">
            <p class="truncate-text" :title="data.location || '-'">{{ data.location || '-' }}</p>
            <p class="text-[#788E86] text-sm truncate-text italic" :title="data.notes">{{ data.notes }}</p>
          </template>
          <template #projectName="{ data }">
            <p class="truncate-text" :title="data">{{ data }}</p>
            <p class="text-[#788E86] text-sm">{{ getProjectNameInitials(data) }}</p>
          </template>
          <template #actions>
            <p class="text-[#17AD49] text-right">
              <font-awesome-icon :icon="faPenToSquare" class="cursor-pointer" />
            </p>
          </template>
        </DataTable>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { storeToRefs } from 'pinia';
import { format, subMonths } from 'date-fns';
import { computed, onMounted, ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCalendar, faBuilding, faUser } from '@fortawesome/free-regular-svg-icons';
import { faMagnifyingGlass, faDownload, faCalendarDay, faUsers, faLocationDot, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import DataTable from '@/components/common/DataTable.vue';
import { useCompanyStore } from '@/stores/company';
import { useAttendanceStore } from '@/stores/attendance';

const { getCompanies, setCompanies } = useCompanyStore();
const { getAttendances, setAttendances } = useAttendanceStore();

const { companies } = storeToRefs(useCompanyStore());
const { attendances } = storeToRefs(useAttendanceStore());

const headers = ref([
  { field: 'nameAndId', label: 'Name' },
  { field: 'createdDate', label: 'Date' },
  { field: 'createdTime', label: 'Time' },
  { field: 'type', label: 'In/Out' },
  { field: 'logDetails', label: 'Log Details' },
  { field: 'locationAndNotes', label: 'Location' },
  { field: 'projectName', label: 'Project Name' },
  { field: 'actions', label: '' },
]);
const fromDate = ref(subMonths(new Date(), 1));
const toDate = ref(new Date());
const showAllFilters = ref(false);
const selectedCompany = ref('All');
const selectedDepartment = ref('All');
const selectedLocation = ref('All');
const selectedEmployees = ref('All');

const data = computed(() => attendances.value.map(a => ({
  nameAndId: { id: a.id, name: `${a.user.lastName}, ${a.user.firstName}` },
  createdDate: a.createdAt ? format(a.createdAt, 'MM/dd/yyyy') : '',
  createdTime: a.createdAt ? format(a.createdAt, 'hh:mm a') : '',
  type: a.type.toUpperCase(),
  logDetails: a.logDetails.toUpperCase(),
  locationAndNotes: { location: a.location, notes: a.locationNotes },
  projectName: a.project.name,
  actions: ['edit'],
})));
const companyFilterItems = computed(() => {
  return ['All', ...companies.value.map(c => c.name)];
});
const departmentFilterItems = computed(() => {
  if (selectedCompany.value === 'All') return ['All'];

  return ['All'].concat(companies.value.find(c => c.name === selectedCompany.value)?.departments || []);
});
const locationFilterItems = computed(() => {
  if (selectedCompany.value === 'All' && selectedDepartment.value === 'All') return ['All'];

  // Filter employees under selectedCompany
  const filteredEmployees = attendances.value.filter(a => a.user.company.name === selectedCompany.value);

  // Return all locations if selectedDepartment==='All'
  if (selectedDepartment.value === 'All') {
    return ['All']
      .concat(filteredEmployees.map(e => e.location)
        .reduce(removeDuplicate, [])
      );
  }

  return ['All'].concat(filteredEmployees
    .filter(e => e.user.company.department === selectedDepartment.value)
    .map(e => e.location)
    .reduce(removeDuplicate, [])
  );
});
const employeesFilterItems = computed(() => {
  if (selectedCompany.value === 'All' && selectedDepartment.value === 'All' && selectedLocation.value === 'All') return ['All'];
  
  // Filter employees under selectedCompany
  let filteredEmployees = attendances.value.filter(a => a.user.company.name === selectedCompany.value);
  // Return all employees if (selectedDepartment & selectedLocation) === 'All'
  if (selectedDepartment.value === 'All' && selectedLocation.value === 'All') {
    return ['All']
      .concat(filteredEmployees.map(e => `${e.user.lastName}, ${e.user.firstName}`));
  }

  // Filter employees under selectedDepartment
  filteredEmployees = filteredEmployees.filter(a => a.user.company.department === selectedDepartment.value);
  if (selectedLocation.value === 'All') {
    return ['All']
      .concat(filteredEmployees.map(e => `${e.user.lastName}, ${e.user.firstName}`))
  }

  // Filter employees under selectedLocation
  const filtered = filteredEmployees
    .filter(e => e.location === selectedLocation.value)
    .map(e => `${e.user.lastName}, ${e.user.firstName}`);

  // Make sure that filtered employee
  if (!filtered.length) {
    return ['No Employee'];
  } else {
    return ['All'].concat(filtered);
  }
});

const displayFormat = (date: Date) => format(date, 'MM / dd / yyyy');
const removeDuplicate = (acc: string[], curr: string) => {
  const index = acc.indexOf(curr);
  if (index === -1) acc.push(curr);

  return acc;
}
const getProjectNameInitials = (project: string) => {
  return project.split(' ').map(p => p.charAt(0)).join('');
};

onMounted(async () => {
  try {
    const attandanceRes = await getAttendances();
    setAttendances(attandanceRes);

    const companyRes = await getCompanies();
    setCompanies(companyRes);
  } catch (error) {
    console.error(error);
  }
});
</script>

<style scoped>
.attendance-page {
  @apply h-full relative;

  .sidebar-filters__container {
    @apply absolute w-[22rem] min-h-[calc(100vh-4.75rem)] h-full border-r-[1px] border-r-[#879A94];

    .page-summary-section {
      @apply border-b-[1px] border-b-[#C3CDC9] px-8 py-[1.375rem];

      > button {
        @apply w-full p-4 text-left flex gap-2 items-center
      }
    }

    .filters-section {
      @apply border-b-[1px] border-b-[#C3CDC9] px-8 py-[1.375rem];

      .datepicker__wrapper {
        @apply relative;

        > span.label {
          @apply text-[#879A94] text-xs bg-white absolute left-3 -top-2 px-1 -mx-1 z-[2];
        }
      }

      .hidden-filters {
        @apply text-[#3C5B51] flex flex-col gap-2;

        > p {
          @apply flex gap-2 items-center uppercase text-xs leading-3;
        }
      }

      .show-filters {
        @apply flex flex-col gap-5;
      }
    }

    .actions-section {
      @apply px-8 py-[1.375rem];

      > button {
        @apply w-full p-4 text-base leading-4 flex gap-2 justify-center items-center;
      }
    }
  }

  .content__container {
    @apply py-6 min-h-[calc(100vh-4.75rem)] ml-[22rem];

    .content__wrapper {
      @apply px-6 flex flex-col gap-6;
    }
  }

  .primary-btn {
    @apply text-white bg-[#17AD49] rounded-[4px];
  }

  .secondary-btn {
    @apply rounded-[4px] border-[1px] border-[#C3CDC9] text-[#C3CDC9]
  }
  
  .accent-btn {
    @apply bg-[#E6FFEE] rounded-[4px];
  }
  
  .flat-btn {
    @apply text-[#5A756B] rounded-[4px];
  }

  .select__wrapper {
    @apply relative;

    > span.label {
      @apply text-[#879A94] text-xs bg-white absolute left-3 -top-2 px-1 z-[2];
    }

    .dropdown {
      @apply border-[#C3CDC9] border-[1px] rounded-[4px] w-full text-left px-3 h-12 mx-0;
    }
  }


  :deep(.dp__input_wrap) {

    & > input.dp__input {
      @apply px-3 h-12;
    }

    & > div {
      @apply absolute right-6 top-0 h-full;
    }
  }
}
</style>
