import { apiFetch } from './index';

export const projectsApi = {
  getMyProjects: () => apiFetch('/projects/my-projects'),
};
