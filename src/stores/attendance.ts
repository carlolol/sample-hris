import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Attendance } from 'types/attendance';

export const useAttendanceStore = defineStore('attendance', () => {
  const attendances = ref<Attendance[]>([]);

  const getAttendances = async () => {
    const res = await fetch('mocks/attendances.json');

    return <Attendance[]>await res.json();
  }

  const setAttendances = (val: Attendance[]) => {
    attendances.value = val;
  }

  return {
    attendances,
    getAttendances,
    setAttendances,
  };
})
