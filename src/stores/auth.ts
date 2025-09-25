import { defineStore } from 'pinia'
import { useCookies } from 'vue3-cookies'

export const useAuthStore = defineStore('auth', {
  state: () => {
    const { cookies } = useCookies()
    return {
      token: cookies.get('token') || null
    }
  },
  getters: {
    isLoggedIn: (state) => !!state.token
  },
  actions: {
    login(token: string) {
      const { cookies } = useCookies()
      cookies.set('token', token)
      this.token = token
    },
    logout() {
      const { cookies } = useCookies()
      cookies.remove('token')
      this.token = null
    }
  }
})
