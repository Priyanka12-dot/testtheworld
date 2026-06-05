// src/services/api.js
import axios from 'axios'
import store from '../redux/store'
import { logout } from '../redux/slices/authSlice'

const api = axios.create({
  baseURL: 'https://testtheworld-backend.onrender.com',
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
})

// ── Request interceptor: attach JWT from Redux store ─────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response interceptor: handle 401 globally ────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — log out automatically
      store.dispatch(logout())
    }
    return Promise.reject(error)
  }
)

export default api