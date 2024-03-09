import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Announcement } from 'types/announcement';

export const useAnnouncementStore = defineStore('announcement', () => {
  const announcements = ref<Announcement[]>([]);

  const getAnnouncements = async () => {
    const res = await fetch('mocks/announcements.json');

    return <Announcement[]>await res.json();
  }

  const setAnnouncements = (val: Announcement[]) => {
    announcements.value = val;
  }

  return {
    announcements,
    getAnnouncements,
    setAnnouncements,
  };
})
