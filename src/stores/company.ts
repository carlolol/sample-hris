import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Company } from 'types/company';

export const useCompanies = defineStore('company', () => {
  const companies = ref<Company[]>([]);

  const getCompanies = async () => {
    const res = await fetch('mocks/companies.json');

    return <Company[]>await res.json();
  }

  const setCompanies = (val: Company[]) => {
    companies.value = val;
  }

  return {
    companies,
    getCompanies,
    setCompanies,
  };
})
