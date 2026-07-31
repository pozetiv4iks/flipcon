import { apiFetch } from './index';

export const githubApi = {
  connect: (repoName: string, installationId: string) => apiFetch('/github/connect', {
    method: 'POST',
    body: JSON.stringify({ repoName, installationId }),
  }),

  getMarketInsights: (repoName: string) => apiFetch(`/github/market-insights/${encodeURIComponent(repoName)}`),
};
