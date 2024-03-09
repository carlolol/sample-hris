import type { Department } from './company';

export interface Attendance {
  id: string;
  user: User;
  createdAt: number;
  type: string;
  logDetails: string;
  location: string;
  locationNotes: string;
  project: Project;
}

export interface Project {
  id: string;
  name: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  company: Company;
}

export interface Company {
  name: string;
  department: Department;
}