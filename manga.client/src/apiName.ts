export const BASE_URL = 'https://api.tocaeru.com';

export const API_BASE_URL = `${BASE_URL}/api`;

// 必要に応じて、特定のエンドポイントを追加できます
export const getEndpoint = (path: string) => `${API_BASE_URL}${path}`;