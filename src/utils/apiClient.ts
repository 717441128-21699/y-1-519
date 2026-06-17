const API_BASE = '/api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const apiClient = {
  get: <T>(endpoint: string, params?: Record<string, unknown>) => {
    let url = endpoint;
    if (params) {
      const query = Object.entries(params)
        .filter(([, value]) => value !== undefined && value !== null)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
        .join('&');
      if (query) {
        url += `?${query}`;
      }
    }
    return request<T>(url, { method: 'GET' });
  },
  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};

export const dataApi = {
  getPlayers: () => apiClient.get('/data/players'),
  getPlayer: (id: string) => apiClient.get(`/data/players/${id}`),
  getItems: () => apiClient.get('/data/items'),
  getItem: (id: string) => apiClient.get(`/data/items/${id}`),
  getSkills: () => apiClient.get('/data/skills'),
  getCurrentPlayer: () => apiClient.get('/data/current-player'),
};

export const proposalApi = {
  calculate: (data: { proposerId: string; targetId: string; tokenItemId: string }) =>
    apiClient.post('/proposal/calculate', data),
  submit: (data: { proposerId: string; targetId: string; tokenItemId: string }) =>
    apiClient.post('/proposal/submit', data),
  getHistory: (playerId: string) => apiClient.get(`/proposal/history/${playerId}`),
};

export const marriageApi = {
  getByPlayer: (playerId: string) => apiClient.get(`/marriage/player/${playerId}`),
  getById: (id: string) => apiClient.get(`/marriage/${id}`),
  getSkills: (id: string) => apiClient.get(`/marriage/${id}/skills`),
  claimDailyLove: (id: string) => apiClient.post(`/marriage/${id}/daily-love`, {}),
  enterDungeon: (id: string) => apiClient.post(`/marriage/${id}/dungeon`, {}),
  getRecords: (id: string, days?: number) =>
    apiClient.get(`/marriage/${id}/records${days ? `?days=${days}` : ''}`),
  getAll: () => apiClient.get('/marriage/all'),
};

export const weddingApi = {
  getStyles: () => apiClient.get('/wedding/styles'),
  prepare: (data: { marriageId: string; style: string; startTime: string }) =>
    apiClient.post('/wedding/prepare', data),
  getById: (id: string) => apiClient.get(`/wedding/${id}`),
  addDecoration: (id: string, data: { itemId: string; positionX: number; positionY: number }) =>
    apiClient.put(`/wedding/${id}/decorate`, data),
  removeDecoration: (weddingId: string, decorationId: string) =>
    apiClient.delete(`/wedding/${weddingId}/decoration/${decorationId}`),
  getLuxury: (id: string) => apiClient.get(`/wedding/${id}/calculate-luxury`),
  calculateLuxury: (data: { style: string; decorations: string[] }) =>
    apiClient.post('/wedding/calculate-luxury', data),
  createWedding: (data: {
    marriageId: string;
    style: string;
    decorations: string[];
    startTime: string;
    luxuryScore: number;
    estimatedGift: number;
  }) => apiClient.post('/wedding/create', data),
  start: (id: string) => apiClient.post(`/wedding/${id}/start`, {}),
  sendBlessing: (id: string, data: { playerId: string; message: string; giftAmount: number }) =>
    apiClient.post(`/wedding/${id}/blessing`, data),
  complete: (id: string) => apiClient.post(`/wedding/${id}/complete`, {}),
  getByMarriage: (marriageId: string) => apiClient.get(`/wedding/marriage/${marriageId}`),
  getOngoing: () => apiClient.get('/wedding/ongoing'),
  getBlessings: (id: string) => apiClient.get(`/wedding/${id}/blessings`),
  playMiniGame: (id: string, data: { playerId: string; gameType: string }) =>
    apiClient.post(`/wedding/${id}/mini-game`, data),
};

export const guildApi = {
  getHall: (guildId: string) => apiClient.get(`/guild/hall/${guildId}`),
  getHallByPlayer: (playerId: string) => apiClient.get(`/guild/hall/player/${playerId}`),
  contribute: (data: { playerId: string; amount: number }) =>
    apiClient.post('/guild/hall/contribute', data),
  requestUpgrade: (data: { playerId: string }) =>
    apiClient.post('/guild/hall/upgrade', data),
  approveUpgrade: (data: { playerId: string; approve: boolean; rejectReason?: string }) =>
    apiClient.post('/guild/hall/approve', data),
  getUpgradeRequests: (hallId: string) =>
    apiClient.get(`/guild/hall/${hallId}/upgrade-requests`),
  getContributionRanking: (guildId: string, limit?: number) =>
    apiClient.get(`/guild/hall/${guildId}/ranking${limit ? `?limit=${limit}` : ''}`),
  getAllHalls: () => apiClient.get('/guild/halls/all'),
};

export const reportsApi = {
  getWeekly: (params?: { guildId?: string; style?: string; weekOffset?: number }) =>
    apiClient.get('/reports/weekly', params),
  getGuilds: () => apiClient.get('/reports/guilds'),
  getStyles: () => apiClient.get('/reports/styles'),
  exportWeekly: (data: { report: unknown }) =>
    apiClient.post('/reports/weekly/export', data),
};

export const rankingsApi = {
  getConfig: () => apiClient.get('/rankings/config'),
  getRanking: (type: string, limit?: number) =>
    apiClient.get(`/rankings/${type}${limit ? `?limit=${limit}` : ''}`),
  getPlayerRank: (type: string, playerId: string) =>
    apiClient.get(`/rankings/${type}/player/${playerId}`),
};
