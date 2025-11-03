/**
 * API client for Pause backend
 */

import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login if unauthorized
      localStorage.removeItem('auth_token')
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  register: (data: { email: string; username: string; password: string }) =>
    api.post('/users/register', data),

  login: (data: { email: string; password: string }) =>
    api.post('/users/login', data),

  getMe: () =>
    api.get('/users/me'),
}

// Videos API
export const videosApi = {
  upload: (formData: FormData) =>
    api.post('/videos/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  list: () =>
    api.get('/videos'),

  get: (id: number) =>
    api.get(`/videos/${id}`),

  delete: (id: number) =>
    api.delete(`/videos/${id}`),
}

// Archives API
export const archivesApi = {
  list: () =>
    api.get('/archives'),

  get: (id: number) =>
    api.get(`/archives/${id}`),

  update: (id: number, data: { title?: string; description?: string; tags?: string[] }) =>
    api.put(`/archives/${id}`, data),

  delete: (id: number) =>
    api.delete(`/archives/${id}`),

  getFrames: (id: number, page: number = 1, limit: number = 50) =>
    api.get(`/archives/${id}/frames`, { params: { page, limit } }),

  getFrame: (archiveId: number, frameId: number) =>
    api.get(`/archives/${archiveId}/frames/${frameId}`),

  updateFrame: (archiveId: number, frameId: number, data: { notes?: string; bookmarked?: boolean }) =>
    api.put(`/archives/${archiveId}/frames/${frameId}`, data),

  download: (id: number) =>
    api.get(`/archives/${id}/download`, { responseType: 'blob' }),

  search: (id: number, query: string) =>
    api.get(`/archives/${id}/search`, { params: { query } }),

  createShareLink: (id: number) =>
    api.post(`/archives/${id}/share`),

  revokeShareLink: (id: number) =>
    api.delete(`/archives/${id}/share`),
}

// Health API
export const healthApi = {
  check: () =>
    api.get('/health'),
}
