import { apiFetch } from './index';

export const authApi = {
  login: (credentials: any) => apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  register: (userData: any) => apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  registerWorker: (userData: any, inviteCode: string) => apiFetch('/auth/register-worker', {
    method: 'POST',
    body: JSON.stringify({ ...userData, inviteCode }),
  }),
};
