export type Department = 'Product' | 'Sales' | 'Marketing' | 'IT';

export interface Company {
  name: string;
  departments: Department[];
}