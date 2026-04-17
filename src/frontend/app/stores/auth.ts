import { defineStore } from 'pinia'

interface User {
  id: number
  name: string
  email: string
  role: string
}

interface AuthState {
  user: User | null
  token: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin'
  },

  actions: {
    async login(email: string, password: string) {
      try {
        const response: any = await $fetch('http://localhost:8000/api/auth/login', {
          method: 'POST',
          body: { email, password }
        })

        this.user = response.user
        this.token = response.token

        if (import.meta.client) {
          localStorage.setItem('token', response.token)
          localStorage.setItem('user', JSON.stringify(response.user))
        }

        return { success: true }
      } catch (error: any) {
        return { success: false, message: error.data?.message || 'Login failed' }
      }
    },

    async register(name: string, email: string, password: string) {
      try {
        const response: any = await $fetch('http://localhost:8000/api/auth/register', {
          method: 'POST',
          body: { name, email, password }
        })

        this.user = response.user
        this.token = response.token

        if (import.meta.client) {
          localStorage.setItem('token', response.token)
          localStorage.setItem('user', JSON.stringify(response.user))
        }

        return { success: true }
      } catch (error: any) {
        return { success: false, message: error.data?.message || 'Registration failed' }
      }
    },

    logout() {
      this.user = null
      this.token = null

      if (import.meta.client) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }

      navigateTo('/login')
    },

    initFromStorage() {
      if (import.meta.client) {
        const token = localStorage.getItem('token')
        const userStr = localStorage.getItem('user')

        if (token && userStr) {
          this.token = token
          this.user = JSON.parse(userStr)
        }
      }
    }
  }
})
