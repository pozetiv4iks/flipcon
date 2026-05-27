import { apiFetch } from './index';

export const companiesApi = {
  generateInvite: (projectIds: string[] = []) => apiFetch('/companies/generate-invite', {
    method: 'POST',
    body: JSON.stringify({ projectIds }),
  }),
};
