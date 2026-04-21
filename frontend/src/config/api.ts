// Backend API configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  recognize: `${API_BASE_URL}/api/songs/recognize`,
  identify: `${API_BASE_URL}/api/songs/identify`,
  health: `${API_BASE_URL}/api/songs/health`,
} as const;
